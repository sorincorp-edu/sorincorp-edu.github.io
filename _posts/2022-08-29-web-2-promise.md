---
layout: single
title:  "[WEB] - Promise 패턴사용"
excerpt: "promise"

categories:
  - web-2
tags:
  - [web-2, ES6]

toc: false
toc_sticky: false
 
date: 2022-08-29
last_modified_at: 2022-08-29
---
# Promise 정리
- 비동기 작업을 순차적으로 처리하게 되면 앞의 콜백 패턴에서 본 것처럼 콜백이 중첩된 콜백 트라이앵글 구조가 되어서 코드의 가독성이 떨어지게 된다.

- 콜백 중첩으로 인한 코드 가독성을 해결하기 위해서 Promise 패턴이 제안되었다. 이 패턴은 코드가 병렬로 배열되어서 가독성이 높아지고 또한 오류 처리등에 대해서도 추가되었다. es5에서 Promise가 많이 사용되자 ES6에서부터는 Promise 가 표준 객체가 되었다.

- 가장 기초적으로 기억해야 할 것은 다음과 같다.
  - Promise 패턴은 비동기 작업을 순차적으로 처리한다.
  - Promise는 new 키워드로 선언과 동시에 실행된다.
  - Promise는 .then() 콜백 메서드에서 비동기 작업의 결과를 처리한다.
  - Promise는 반드시 resolve 되거나 reject 되어야 한다. 만일 어느한쪽도 리턴되지 않으면 .then() 이 호출되지 않는다. 비유하자면 약속을 했으면 반드시 지켜지거나 파기되어야 한다. 어느쪽도 아니면 아직 pending 상태가 되어서 .then()이 호출 되지 않는다.

### 목차
- Promise 상태
- 응답 결과 전달 방법
- 마이크로테스크
- 연속적인 동작
- Promise API
- catch 케이스 스터디
- 적용 사례

### Promise 상태
Promise의 상태는 **대기**, **이행**, **거부** 상태가 있다.
상태는 대기에서 이행/거부로만 변경이 가능하다.
- 대기 : 초기상태
- 이행 : 성공 상태, resolve(), Promise.resolve()
- 거부 : 실패 상태, reject(), Promise.reject()

**이행상태**는 then으로 처리할 수 있다. resolve를 통해 전달한 값이 then에 인자로 전달된다.
```js
Promise.resolve(10)
  .then(result => console.log(result)) // 10
```

**거부상태**는 catch으로 처리할 수 있다. reject를 통해 전달한 값이 catch에 인자로 전달된다.
```js
Promise.reject({code: 404})
  .catch(({code}) => console.log(code)) // 404
```

### 응답 결과 전달 방법
응답 결과의 전달에 있어서 Callback과 Promise 차이가 있다.
#### [Promise] Active Async Control
프로미스는 then을 호출해야 결과를 얻는 다.
필요할 때 then을 호출해서 데이터를 받는 것이다.
```js
let result;
const promise = new Promise(r => $.post(url1, data1, r));
promise.then(v => {
    result = v;
});
```
```js
const promise1 = new Promise(r => $.post(url1, data1, r));
const promise2 = new Promise(r => $.post(url2, data2, r));
promise1.then(result => {
    promise2.then(v => {
        result.nick = v.nick;
        report(result);
    });
});
```
#### [Callback] Passive Async Control
콜백을 보낼 수는 있지만 언제 올지는 모른다.
```js
$.post(url. data, () => {
  // 언제 실행 되는 가
})
```

현실적으로 다수의 API 요청을 통해 결과를 만들기 때문에 언제 응답이 오는 지 중요하다.
```js
let result;
$.post(url1, data1, v => {
    result = v;
});
$.post(url2, data2, v => {
    result.nick = v.nick;
    report(result);
});
```

### 마이크로테스크
비동기로 등록되는 테스크 중 가장먼저 실행되는 마이크로테스크가 있다.
마이크로테스크는 Promise를 통해 등록 가능하다.

#### 자바스크립트 엔진
자바스크립트 엔진은 기본적으로 하나의 스레드에서 동작한다. 하나의 스레드는 하나의 스택을 가지고 있다는 의미하고, 
동시에 단 하나의 작업만을 할 수 있다는 의미이다. 그 비밀은 이벤트 루프와 큐에 있다.

#### 이벤트 루프와 큐
> https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
자바스크립트는 이벤트 루프와 큐를 통해 비동기 작업을 수행한다. 직접적인 작업은 Web API에서 처리되고, 작업이 완료되면 요청 시 등록했던
콜백이 큐에 등록된다.

이벤트 루프는 계속 반복해서 콜 스택과 큐 사이의 작업을 확인한다. 콜 스택이 비워 있는 경우 큐에서 작업을 꺼내어 콜 스택에 넣는 다.

콜 스택에 작업이 없을 경우 우선적으로 마이크로테스크 큐를 확인한다. 마이크로테스크에 작업이 있다면 작업을 꺼내서 콜 스택에 넣는 다.
만약 마이크로테스크 큐가 비어서 더 이상 처리할 작업이 없으면 테스크 큐를 확인한다. 테스크 큐에 작업이 있다면 작업을 꺼내서 콜 스택에 넣는 다.

#### 자바스크립트 처리 과정
1. 비동기 작업으로 등록되는 작업은 Task와 Microtask 그리고 AnimationFrame 작업으로 구분된다.
2. Microtask는 Task보다 먼저 작업이 처리된다.
3. Microtask가 처리된 이후 requestAnimationFrame이 호출되고 이후 브라우저 렌더링이 발생한다.

```js
console.log('script start')

setTimeout(() => console.log('setTimeout'), 0)

Promise.resolve()
  .then(() => console.log('promise1'))
  .then(() => console.log('promise2'))

requestAnimationFrame(() => console.log('requestAnimationFrame'))

console.log('script end')
```
```
$ script start
$ script end
$ promise1
$ promise2
$ requestAnimationFrame
$ setTimeout
```

### 연속적인 동작
Promise는 비동기를 값으로 다룰 수 있다.
Promise로 처리하는 함수는 리턴된 Promise를 통해서 **연속적인 동작**을 할 수 있다.
반면에 콜백으로 처리하는 함수는 리턴되는 값이 없어 내부에서 처리해야 한다.
```js
const add10 = (a, callback) => {
  setTimeout(() => callback(a + 10), 100);
};

add10(10, res => {
  add10(res, res => {
    console.log(res);
  });
});

const add20 = (a, callback) => {
  return new Promise(resolve => setTimeout(() => resolve(a + 20), 100));
};

add20(10)
  .then(add20)
  .then(console.log);
```

### Promise API
#### resolve/reject
```javascript
const promise = new Promise((resolve, reject) => {
  getData(
    response => resolve(response.data), 
    error => reject(error.message)
  )
})
```
#### then/catch
```javascript
promise
  .then(data => console.log(data))
  .catch(err => console.error(err))
```
#### all
**Promise.all**은 모두 **이행**상태일 때 **then**을 통해 결과를 받게 된다.
```javascript
Promise
  .all([
    getPromise(),
    getPromise(),
    getPromise()
  ])
  //response all data
  .then(data => console.log(data))
  .catch(err => console.error(err))
```

**하나**라도 **거부**상태가 되면 **catch**가 실행되게 된다.
```javascript
Promise
  .all([
    Promise.resolve(1),
    Promise.reject(2),
  ])
  .catch(err => console.error(err))
  // 2
```

#### race
**Promise.race**는 **하나라도 이행 또는 거부 상태일 때** 완료를 하게 된다. 완료시에는 상태에 따라 then 또는 catch를 실행하게 된다.
```javascript
Promise
  .race([
    getPromise(), //1000ms
    getPromise(), //500ms
    getPromise() //250ms
  ])
  //response of 250ms
  .then(data => console.log(data))
```

```javascript
Promise
  .race([
    getPromise(), //1000ms
    getPromise(), //500ms
    getPromiseReject() //250ms
  ])
  //response of 250ms
  .catch(err => console.error(err))
```

### catch 케이스 스터디
#### catch에서 동기값 리턴
catch에서 값을 리턴하게 되면 다음 then에서 받게 된다.
HTTP Status가 2XX가 아닐 때 catch에 받더라도
경우에 따라 성공으로 처리하고 싶을 때가 있다.
해당 케이스에 유용할 것으로 보인다.
```js
const fetchData = _ => new Promise((_, reject) => {
  reject(100)
})
const fetchWrapper = _ => fetchData()
  .catch(() => 'fail')

fetchWrapper()
  .then(response => console.log(`response ${response}`))
// response fail
```

#### catch에서 Promise.reject() 리턴
catch에서 Promise.reject()을 리턴하면 catch에서 받게 된다.
**공통 에러 처리**할 때 용이할 것으로 보인다.
```js
const fetchData = _ => new Promise((_, reject) => {
  reject(100)
})
const fetchWrapper = _ => fetchData()
  .catch(() => Promise.reject('fail'))

fetchWrapper()
  .catch(error => console.log(`error ${error}`))
// error fail
```

### 적용 사례
#### 최소 요청 시간이 있는 비동기 처리
5초전에 응답이 오면 경우 5초뒤에 재요청할 것이고 5초뒤에 응답이 오면 응답이 온뒤 재요청한다.
```js
const recur = () => Promise.all([
  new Promise(resolve => setTimeout(resolve, 5000)),
  getData
]).then(recur)
```

#### async, await + Promise.all
async, await를 사용하여 동기코드와 유사하게 코드 작성이 가능하다. 여기에 Promise.all를 사용하면
병렬처리를 구현할 수 있다. 아래와 같이 일정시간이 지나면 resolve를 실행해는 delay함수가 있다.
```js
const delay = ms => new Promise(resolve => {
  setTimeout(() => resolve(ms), ms)
});
```
Promise를 리턴하는 함수를 사용할 때 await를 통해 resolve값을 받을 수 있다. main 함수의 결과는 6000ms 뒤에 반환된다.
```js
const main = async () => {
  console.time('main');
  const delay1s = await delay(1000);
  const delay2s = await delay(2000);
  const delay3s = await delay(3000);
  console.timeEnd('main');
  return delay1s + delay2s + delay3s;
};
main().then(console.log);
// main: 6005.81787109375ms
// 6000
```
각각의 Promise들이 서로 영향이 없다면 병렬로 처리할 필요가 있다. 모든 Promise가 끝날 때 Promise.all를 통해 확인한다.
함수의 결과는 3000ms 뒤에 반환된다. 병렬 처리를 하게 되면 빠른 응답을 받을 수 있다.
```js
const main = async () => {
  console.time('main');
  const [delay1s, delay2s, delay3s] = await Promise.all([delay(1000), delay(2000), delay(3000)]);
  console.timeEnd('main');
  return delay1s + delay2s + delay3s;
};
main().then(console.log);
// main: 3001.468017578125ms
// 6000
```



## 참고
### Using promises
- Promise는 비동기 작업의 최종 완료 또는 실패를 나타내는 객체입니다. 대부분 여러분은 이미 만들어진 promise를 사용했었기 때문에 이 가이드에서는 어떻게 promise를 만드는지 설명하기에 앞서 promise의 사용법에 대해 설명합니다.

- 기본적으로 promise는 함수에 콜백을 전달하는 대신에, 콜백을 첨부하는 방식의 객체입니다.

- 비동기로 음성 파일을 생성해주는 createAudioFileAsync()라는 함수가 있었다고 생각해보세요. 해당 함수는 음성 설정에 대한 정보를 받고, 두 가지 콜백 함수를 받습니다. 하나는 음성 파일이 성공적으로 생성되었을때 실행되는 콜백, 그리고 다른 하나는 에러가 발생했을때 실행되는 콜백입니다.

- createAudioFileAsync()는 함수는 아래와 같이 사용됩니다.

``` javascript
function successCallback(result) {
  console.log("Audio file ready at URL: " + result);
}

function failureCallback(error) {
  console.log("Error generating audio file: " + error);
}

createAudioFileAsync(audioSettings, successCallback, failureCallback);
```

- 모던한 함수들은 위와 같이 콜백들을 전달하지 않고 콜백을 붙여 사용할 수 있게 Promise를 반환해줍니다.
- 만약 createAudioFileAsync() 함수가 Promise를 반환하도록 수정한다면, 다음과 같이 간단하게 사용될 수 있습니다.

``` javascript
createAudioFileAsync(audioSettings).then(successCallback, failureCallback);
```

- 조금 더 간단하게 써보자면:

``` javascript
const promise = createAudioFileAsync(audioSettings);
promise.then(successCallback, failureCallback);
```

- 우리는 이와 같은 것을 비동기 함수 호출이라고 부릅니다. 이런 관례는 몇 가지 장점을 갖고 있습니다. 각각에 대해 한번 살펴보도록 합시다.

#### Guarantees
- 콜백 함수를 전달해주는 고전적인 방식과는 달리, Promise는 아래와 같은 특징을 보장합니다.
  - 콜백은 자바스크립트 Event Loop가 현재 실행중인 콜 스택을 완료하기 이전에는 절대 호출되지 않습니다.
  - 비동기 작업이 성공하거나 실패한 뒤에 then() 을 이용하여 추가한 콜백의 경우에도 위와 같습니다.
  - then()을 여러번 사용하여 여러개의 콜백을 추가 할 수 있습니다. 그리고 각각의 콜백은 주어진 순서대로 하나 하나 실행되게 됩니다. Promise의 가장 뛰어난 장점 중의 하나는 chaining입니다.

#### Chaining
- 보통 두 개 이상의 비동기 작업을 순차적으로 실행해야 하는 상황을 흔히 보게 됩니다. 순차적으로 각각의 작업이 이전 단계 비동기 작업이 성공하고 나서 그 결과값을 이용하여 다음 비동기 작업을 실행해야 하는 경우를 의미합니다. 우리는 이런 상황에서 promise chain을 이용하여 해결하기도 합니다.

- then() 함수는 새로운 promise를 반환합니다. 처음에 만들었던 promise와는 다른 새로운 promise입니다.

``` javascript
const promise = doSomething();
const promise2 = promise.then(successCallback, failureCallback);
```

또는

``` javascript
const promise2 = doSomething().then(successCallback, failureCallback);
```

- 두 번째 promise는 doSomething() 뿐만 아니라 successCallback or failureCallback 의 완료를 의미합니다. successCallback or failureCallback 또한 promise를 반환하는 비동기 함수일 수도 있습니다. 이 경우 promise2에 추가된 콜백은 successCallback또는 failureCallback에 의해 반환된 promise 뒤에 대기합니다.

- 기본적으로, 각각의 promise는 체인 안에서 서로 다른 비동기 단계의 완료를 나타냅니다.

- 예전에는 여러 비동기 작업을 연속적으로 수행하면 고전적인 '지옥의 콜백 피라미드'가 만들어 졌었습니다.

``` javascript
doSomething(function(result) {
  doSomethingElse(result, function(newResult) {
    doThirdThing(newResult, function(finalResult) {
      console.log('Got the final result: ' + finalResult);
    }, failureCallback);
  }, failureCallback);
}, failureCallback);
```

- 모던한 방식으로 접근한다면, 우리는 콜백 함수들을 반환된 promise에 promise chain을 형성하도록 추가할 수 있습니다:

``` javascript
doSomething().then(function(result) {
  return doSomethingElse(result);
})
.then(function(newResult) {
  return doThirdThing(newResult);
})
.then(function(finalResult) {
  console.log('Got the final result: ' + finalResult);
})
.catch(failureCallback);
```

- then 에 넘겨지는 인자는 선택적(optional)입니다. 그리고 catch(failureCallback) 는 then(null, failureCallback) 의 축약입니다. 이 표현식을 화살표 함수로 나타내면 다음과 같습니다.

``` javascript
doSomething()
.then(result => doSomethingElse(result))
.then(newResult => doThirdThing(newResult))
.then(finalResult => {
  console.log(`Got the final result: ${finalResult}`);
})
.catch(failureCallback);
```

**중요: 반환값이 반드시 있어야 합니다, 만약 없다면 콜백 함수가 이전의 promise의 결과를 받지 못합니다. (화살표 함수 () => x는 () => {return x;}와 같습니다.)**

#### Chaining after a catch
- chain에서 작업이 실패한 후에도 새로운 작업을 수행하는 것이 가능하며 매우 유용합니다. (예 : catch) 다음 예를 읽으십시오:

``` javascript
new Promise((resolve, reject) => {
    console.log('Initial');

    resolve();
})
.then(() => {
    throw new Error('Something failed');

    console.log('Do this');
})
.catch(() => {
    console.log('Do that');
})
.then(() => {
    console.log('Do this, whatever happened before');
});
```

- 그러면 다음 텍스트가 출력됩니다.

>    Initial
>    Do that
>    Do this, whatever happened before


> 참고: "Do this" 텍스트가 출력되지 않은 것을 주의깊게 보십시오. 
> "Something failed" 에러가 rejection을 발생시켰기 때문입니다.

#### Error propagation
- '콜백 지옥'에서 failureCallback이 3번 발생한 것을 기억할 것입니다. promise chain에서는 단 한 번만 발생하는 것과 비교되죠.

``` javascript
doSomething()
.then(result => doSomethingElse(result))
.then(newResult => doThirdThing(newResult))
.then(finalResult => console.log(`Got the final result: ${finalResult}`))
.catch(failureCallback);
```
- 기본적으로 promise chain은 예외가 발생하면 멈추고 chain의 아래에서 catch를 찾습니다. 이것은 동기 코드가 어떻게 동작하는지 모델링 한 것입니다.

``` javascript
try {
  const result = syncDoSomething();
  const newResult = syncDoSomethingElse(result);
  const finalResult = syncDoThirdThing(newResult);
  console.log(`Got the final result: ${finalResult}`);
} catch(error) {
  failureCallback(error);
}
```

- 비동기 코드를 사용한 이러한 대칭성은 ECMAScript 2017에서 async/await 구문(Syntactic sugar) 에서 최고로 느낄 수 있습니다.

``` javascript
async function foo() {
  try {
    const result = await doSomething();
    const newResult = await doSomethingElse(result);
    const finalResult = await doThirdThing(newResult);
    console.log(`Got the final result: ${finalResult}`);
  } catch(error) {
    failureCallback(error);
  }
}
```

- 이것은 promise를 기반으로 합니다. doSomething()은 이전 함수와 같습니다. 문법은 이곳에서 확인할 수 있습니다.

- Promise는 모든 오류를 잡아내어, 예외 및 프로그래밍 오류가 발생해도 콜백 지옥의 근본적인 결함을 해결합니다. 이는 비동기 작업의 기능 구성에 필수적입니다.

#### Promise rejection events
- Promise가 reject될 때마다 두 가지 이벤트 중 하나가 전역 범위에 발생합니다.(일반적으로, 전역 범위는 window거나, 웹 워커에서 사용되는 경우, Worker, 혹은 워커 기반 인터페이스입니다.) 두 가지 이벤트는 다음과 같습니다.

##### rejectionhandled (en-US)
- executor의 reject함수에 의해 reject가 처리 된 후 promise가 reject 될 때 발생합니다.

##### unhandledrejection (en-US)
- promise가 reject되었지만 사용할 수 있는 reject 핸들러가 없을 때 발생합니다.

- (PromiseRejectionEvent (en-US) 유형인) 두 이벤트에는 멤버 변수인 promise와 reason 속성이 있습니다. promise (en-US)는 reject된 promise를 가리키는 속성이고, reason (en-US)은 promise가 reject된 이유를 알려 주는 속성입니다.

- 이들을 이용해 프로미스에 대한 에러 처리를 대체(fallback)하는 것이 가능해지며, 또한 프로미스 관리시 발생하는 이슈들을 디버깅하는 데 도움을 얻을 수 있습니다. 이 핸들러들은 모든 맥락에서 전역적(global)이기 때문에, 모든 에러는 발생한 지점(source)에 상관없이 동일한 핸들러로 전달됩니다.

- 특히 유용한 사례 : Node.js로 코드를 작성할 때, 흔히 프로젝트에서 사용하는 모듈이 reject된 프로미스를 처리하지 않을 수 있습니다. 이런 경우 노드 실행 시 콘솔에 로그가 남습니다. 이를 수집에서 분석하고 직접 처리할 수도 있습니다. 아니면 그냥 콘솔 출력을 어지럽히는 것을 막기 위해 그럴 수도 있죠. 이런 식으로 unhandledrejection (en-US)(영어) 이벤트를 처리하는 핸들러를 추가하면 됩니다.

``` javascript
window.addEventListener("unhandledrejection", event => {
  /* You might start here by adding code to examine the
     promise specified by event.promise and the reason in
     event.reason */

  event.preventDefault();
}, false);
```

- 이벤트의 preventDefault() 메서드를 호출하면 reject 된 프로미스가 처리되지 않았을 때 JavaScript 런타임이 기본 동작을 수행하지 않습니다. 이 기본 동작은 대개 콘솔에 오류를 기록하는 것이기 때문에, 이것은 확실히 NodeJS를 위한 것이죠.

- 제대로 하려면, 당연한 말이지만, 이 이벤트를 그냥 무시해버리기 전에 reject된 프로미스 코드에 실제로 버그가 없는지 확실히 검사해야 합니다.

#### 오래된 콜백 API를 사용하여 Promise만들기
- Promise는 생성자를 사용하여 처음부터 생성 될 수 있습니다. 이것은 오래된 API를 감쌀 때만 필요합니다.

- 이상적인 프로그래밍 세계에서는 모든 비동기 함수는 promise을 반환해야 하지만, 불행히도 일부 API는 여전히 success 및 / 또는 failure 콜백을 전달하는 방식일거라 생각합니다. 예를 들면 setTimeout () 함수가 있습니다.

``` javascript
setTimeout(() => saySomething("10 seconds passed"), 10000);
```

- 예전 스타일의 콜백과 Promise를 합치는 것은 문제가 있습니다. 함수 saySomething()이 실패하거나 프로그래밍 오류가 있으면 아무 것도 잡아 내지 않습니다. setTimeout의 문제점 입니다.

- 다행히도 우리는 setTimeout을 Promise로 감쌀 수 있습니다. 가장 좋은 방법은 가능한 가장 낮은 수준에서 문제가 되는 함수를 감싼 다음 다시는 직접 호출하지 않는 것입니다.

``` javascript
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

wait(10000).then(() => saySomething("10 seconds")).catch(failureCallback);
```

- 기본적으로 promise constructor는 promise를 직접 해결하거나 reject 할 수 있는 실행자 함수를 사용합니다. setTimeout()은 함수에서 fail이 일어나거나 error가 발생하지 않기 때문에 이 경우 reject를 사용하지 않습니다.

#### Composition
- Promise.resolve ()와 Promise.reject ()는 각각 이미 resolve되거나 reject 된 promise를 여러분이 직접 생성하기위한 바로 가기입니다. 가끔 유용하게 사용됩니다.

- Promise.all()와 Promise.race()는 비동기 작업을 병렬로 실행하기위한 두 가지 구성 도구입니다.

- 우리는 병렬로 작업을 시작하고 다음과 같이 모두 완료될 때까지 기다릴 수 있습니다.

``` javascript
Promise.all([func1(), func2(), func3()])
.then(([result1, result2, result3]) => { /* use result1, result2 and result3 */ });
```

- 고급진 JavaScript를 사용하여 순차적 구성이 가능합니다.

``` javascript
[func1, func2, func3].reduce((p, f) => p.then(f), Promise.resolve())
.then(result3 => { /* use result3 */ });
```

- 기본적으로, 우리는 비동기 함수 배열을 다음과 같은 promise 체인으로 줄입니다. Promise.resolve().then(func1).then(func2).then(func3);

- 이것을 재사용 가능한 합성 함수로 만들 수 있는데, 이는 함수형 프로그래밍에서 일반적인 방식입니다.

``` javascript
const applyAsync = (acc,val) => acc.then(val);
const composeAsync = (...funcs) => x => funcs.reduce(applyAsync, Promise.resolve(x));
```
- composeAsync() 함수는 여러 함수를 인수로 받아들이고 composition 파이프 라인을 통해 전달되는 초기 값을 허용하는 새 함수를 반환합니다.

``` javascript
const transformData = composeAsync(func1, func2, func3);
const result3 = transformData(data);
```
- ECMAScript 2017에서는 async / await를 사용하여 순차적 구성을 보다 간단하게 수행할 수 있습니다.

``` javascript
let result;
for (const f of [func1, func2, func3]) {
  result = await f(result);
}
/* use last result (i.e. result3) */
```

#### Timing
- 놀라움(역자 주. 에러가 난다거나, 코드가 문제가 생긴다거나..했을때의 그 놀라움..)을 피하기 위해 then()에 전달된 함수는 already-resolved promise에 있는 경우에도 동기적으로 호출되지 않습니다.

``` javascript
Promise.resolve().then(() => console.log(2));
console.log(1); // 1, 2
```

- 즉시 실행되는 대신 전달된 함수는 마이크로 태스크 대기열에 저장됩니다. 즉, 자바 스크립트 이벤트 루프의 현재 실행이 끝나고, 대기열도 비어있을 때에 제어권이 이벤트 루프로 반환되기 직전에 실행됩니다.

``` javascript
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

wait().then(() => console.log(4));
Promise.resolve().then(() => console.log(2)).then(() => console.log(3));
console.log(1); // 1, 2, 3, 4
```

#### Nesting
- 간단한 promise 체인은 평평하게 유지하는 것이 가장 좋습니다. 중첩된 체인은 부주의한 구성의 결과일 수 있습니다. common mistakes를 참조하십시오.

- 중첩은 catch 문 범위를 제한하는 제어 구조입니다. 특히, 중첩된 catch는 중첩된 범위 외부의 체인에 있는 오류가 아닌 범위 및 그 이하의 오류만 잡습니다. 올바르게 사용하면 오류 복구 시 더 정확한 결과를 얻을 수 있습니다.

``` javascript
doSomethingCritical()
.then(result => doSomethingOptional(result)
  .then(optionalResult => doSomethingExtraNice(optionalResult))
  .catch(e => {})) // Ignore if optional stuff fails; proceed.
.then(() => moreCriticalStuff())
.catch(e => console.log("Critical failure: " + e.message));
```

- 여기에 있는 선택적 단계는 들여 쓰기가 아닌 중첩되어 있지만 주위의 바깥 쪽 ( 및 ) 의 규칙적이지 않은 배치를 하지않도록 조심하세요.

- inner neutralizing catch 문은 doSomethingOptional()및 doSomethingExtraNice()에서 발생한 오류를 catch 한 후에 코드가 moreCriticalStuff()로 다시 시작됩니다. 중요한 것은 doSomethingCritical()이 실패하면 해당 오류는 최종 (외부) catch에서만 포착된다는 것입니다.

#### Common mistakes
- promise chains을 작성할 때 주의해야 할 몇 가지 일반적인 실수는 다음과 같습니다. 이러한 실수 중 몇 가지는 다음 예제에서 나타납니다.

``` javascript
// Bad example! Spot 3 mistakes!
doSomething().then(function(result) {
  doSomethingElse(result) // Forgot to return promise from inner chain + unnecessary nesting
  .then(newResult => doThirdThing(newResult));
}).then(() => doFourthThing());
// Forgot to terminate chain with a catch!
```

- 첫 번째 실수는 제대로 체인을 연결하지 않는 것입니다. 이것은 우리가 새로운 promise를 만들었지만 그것을 반환하는 것을 잊었을 때 일어납니다. 결과적으로 체인이 끊어지거나 오히려 두 개의 독립적인 체인이 경쟁하게 됩니다. 즉, doFourthThing()은 doSomethingElse() 또는 doThirdThing()이 완료될 때까지 기다리지 않고 우리가 의도하지 않았지만 이들과 병렬로 실행됩니다. 또한 별도의 체인은 별도의 오류 처리 기능을 가지고 있어서 잡기 어려운 오류가 발생합니다.

- 두 번째 실수는 불필요하게 중첩되어 첫 번째 실수를 가능하게 만드는 것입니다. 또한 중첩은 내부 오류 처리기의 범위를 제한하며, 의도하지 않은 에러가 캐치되지 않는 오류가 발생할 수 있습니다. 이 변형은 promise constructor anti-pattern입니다. 이 패턴은 이미 약속을 사용하는 코드를 감싸기 위해 promise 생성자의 중복 사용과 중첩을 결합합니다.

- 세 번째 실수는 catch로 체인을 종료하는 것을 잊는 것입니다. 종료되지 않은 promise 체인은 대부분의 브라우저에서 예상하지 못한 promise rejection을 초래합니다.

- 좋은 경험 법칙은 항상 promise 체인을 반환하거나 종결하는 것이며, 새로운 promise를 얻자마자 즉시 반환하여 복잡도를 낮추는 것입니다.

``` javascript
doSomething()
.then(function(result) {
  return doSomethingElse(result);
})
.then(newResult => doThirdThing(newResult))
.then(() => doFourthThing())
.catch(error => console.log(error));
```

- () => x 은 () => { return x; }의 축약형임을 참고하세요.

- 이제 우리는 적절한 오류 처리 기능을 갖춘 결정성있는 단일 체인이 있습니다.

- async/await를 사용하면 대부분의 문제를 해결할 수 있습니다. 이러한 문법의 가장 흔한 실수는 await키워드를 빼먹는 것입니다.

#### promise와 작업이 충돌할 때
- 예측할 수 없는 순서로 실행되는 promise 및 작업(예: 이벤트 또는 콜백)이 있는 상황에 직면하면 마이크로 태스크를 사용하여 상태를 확인하거나 promise가 조건부로 생성될 때 promise의 균형을 맞추는 것이 좋습니다.

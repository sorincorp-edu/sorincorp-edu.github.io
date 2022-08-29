---
layout: single
title:  "[WEB] Javascript ES5 vs ES6 비교 문법 정리"
excerpt: "ECMA5 vs ECMA6"

categories:
  - web-2
tags:
  - [ES5, ES6]

toc: false
toc_sticky: false
 
date: 2022-08-29
last_modified_at: 2022-08-29
---
## 변수 선언의 방식
``` javascript
function scopeVariableWindow() {
    var var1 = 1;

    if(true){
        var var2 = 2;
    }
    console.log(var1);  // 출력결과 : 1
    console.log(var2);  // 출력결과 : 2
}
```

- ES5 의 변수 선언시 var는 Function Scope를 사용한다.
- var 는 block scope가 아닌 function scope이기 때문에 if 조건문의 block 과는 상관없이 외부에서도 접근이 가능하다. 기존의 var keywork의 scope는 전역범위로 스크립트 파일 어디서나 참조하여 사용이 가능하다.
- var keyworkd의 장점은 함수 호이스팅이 되기 때문에 var로 생성안하고 그냥 변수로 사용해도 Error없이 생성되어 사용이 가능하였다. 하지만 이러한 경우 스크립트 파일이 많아지거나 길어질 경우 개발자가 의도하지 않게 동일한 변수명에 다른 값을 넣어서 시스템에 문제를 발생시킬수 있는 여지가 있다.

``` javascript
function scopeVariableBlock() {
    let let1 = 1;

    // let2변수는 block scope이기때문에 if문 안에서만 유효하다.
    if(true){
        let let2 = 2;
    }
    console.log(let1);  // 출력 결과 : 1
    console.log(let2);  // 출력 결과 : Uncaught ReferenceError: let2 is not defined
}
```
- ES6 에서의 변수 선언시 let과 const가 존재 하며 이 두가지의 변수 선언에 사용되는 문법은 기존 ES5의 var와 달리 Block Scope를 따른다.

- let , const는 function scope가 아닌 block scope이기 떄문에 if 문안에있는 block에서 생성된 변수 b 는 if문이 끝남과 동시에 사라지기 때문에 외부에서 b를 참조할수 없어 Reference Error가 발생한다. 

- let - block scope로 일반 변수 생성시 사용 , 중복 선언시 Type Error를 발생시킨다.
      장점은 잘못된 변수 사용으로 인해 발생하는 오해의 소지를 줄여주기때문에 정확한 사용으로 생산성 

- const - block scope로 JavaScript에서 상수용 변수로 사용된다 , 처음 생성시 초기값을 지정해주어야 한다.
       주의할 점은 변수에 담긴 값이 불변이라기보다는 재할당이 불가능하다는 의미이다.

## 함수(function) 선언 방식의 변경
- ES5 함수의 선언 방식 
``` javascript
function plus (a,b) { return a+b; }
var plus = function(a,b) { return a+b; }
 ```

- ES6 함수의 선언 방식 
``` javascript
let plus = (a,b) => {return a+b}
```
- 함수 선언 방식이 간결해짐.

- this의 사용에도 큰 변화가 있었다.
- ES5같은 경우 객체내에있는 메소드를 실행시 메소드의 this는 메소드가 선언된 해당 객체를 가리킨다. 하지만 객체안에서 선언된 함수의 this는 해당 객체가 아닌 window를 바라보고있기 떄문에 함수 안에서 this.name , this.age를 하여도 아무 값이 나오지 않는다.
- 이러한 경우 해결방안으로는 innerInfo.call(this)를 통해 this를 바인딩 시켜주었거나 this를 해당 변수에 담아서 
var self = this 와 같은 방식으로 접근하여 사용하였습니다.

``` javascript
var thisTest = {
     name : "최 윤진",   
     age : 27,
     info : function() {
          console.log(this)
          console.log(this.name , this.age)

          function innerInfo(){
              console.log(this)
              return this.name + ":" + this.age
          }
          return innerInfo()
     }
}

// 실행결과 
// {name: "최 윤진", age: 27, info: ƒ}
// 최 윤진 27
// Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, parent: Window, …}
// ":undefined"
```

- ES6에서의 this는 자신을 둘러싸고 있는 this를 바라보기때문에  따로 바인딩이나 변수에 담을 필요없이 사용 가능합니다 .
- 아래의 예시는 화살표 함수가 지원되지 않는 ES5에서 this를 사용하기 위한 처리 예시다.

``` javascript
var _this = this
$('.btn').click(function(event){
  _this.sendData()
})
```

- 다음은 위 예시를 화살표 함수로 대체한 ES6 예시이다.

``` javascript
$('.btn').click((event) => {
  this.sendData()
})
```

- 또한 ES5의 info : function(){} 처럼 사용하지 않고 바로 info key에게 함수를 선언하여 사용할 수있도록 되어 좀더 간결하게 짤수있습니다.

``` javascript
let thisTest = {
     name : "최 윤진",   
     age : 27,
     info() {
          console.log(this)
          console.log(this.name , this.age)
 
          innerInfo = () =>{
              console.log(this)
              return this.name + ":" + this.age
          }
          return innerInfo()
     }
}
```

## 문자열 처리  ( 템플릿 리터럴 (Template Literals) )
- ES5에서는 아래와 같이 문자열을 처리해야 했다.

``` javascript
var name = 'Your name is ' + first + ' ' + last + '.'
var url = 'http://localhost:3000/api/messages/' + id
```

- ES6에서는 템플릿 리터럴을 제공하므로 "`" (back-ticked) 문자열 안에 ${NAME}라는 새로운 구문을 사용해서 아래와 같이 간단히 처리

``` javascript
var name = `Your name is ${first} ${last}.`
var url = `http://localhost:3000/api/messages/${id}`
```

## 멀티 라인 문자열 (Multi-line Strings)
- ES5에서는 멀티 라인 문자열을 처리하기 위해 아래와 같은 방법들을 사용해야 했다.

``` javascript
var roadPoem = 'Then took the other, as just as fair,\n\t'
    + 'And having perhaps the better claim\n\t'
    + 'Because it was grassy and wanted wear,\n\t'
    + 'Though as for that the passing there\n\t'
    + 'Had worn them really about the same,\n\t'

var fourAgreements = 'You have the right to be you.\n\
    You can only be you when you do your best.'
```

- 하지만 ES6에서는 "`" (back-ticked) 문자열을 이용해서 아래와 같이 간단히 처리할 수 있다.

``` javascript
var roadPoem = `Then took the other, as just as fair,
    And having perhaps the better claim
    Because it was grassy and wanted wear,
    Though as for that the passing there
    Had worn them really about the same,`

var fourAgreements = `You have the right to be you.
    You can only be you when you do your best.`
```

## 객체의 변화
- 메소드를 줄여쓸수있습니다 ES5의 객체 내부함수에서는 의미없는 function keywork를 항상 적어줘서 함수라는것을 명시해줘야 했습니다. 하지만 ES6에서는 일반 메서드처럼 name()과 같이 사용할 수있으며 넣고자 하는 변수와 object의 key가 같다면 변수명만 적어주어도 변수명으로 key:value가 생성된다.

``` javascript
var getInfo = function() {
    var name = "최윤진";
    return name;
};
var age = 27;
var object = {
    getAge : function(){
        return age;
    },
    getInfo : getInfo(),
};

object["getInfo"+age] = "getInfo"+age;
```

``` javascript
let getInfo = () => {
    let name = "최윤진";
    return name;
};
let age = 27;
let object = {
    getAge(){
        return age;
    },
    getInfo,
    ["getInfo" + age] :"getInfo" + age
};
```

## class
- 지금까지 자바스크립트는 class가 없었습니다 . 하지만 함수와 객체를 이용하여 class처럼 사용

``` javascript
var Human = function (  type ){
    this.type = type || 'Human';
};

Human.isHuman = function(human){
    return human instanceof Human;
};

Human.prototype.info = function() {
    return "이름 : "+ this.firstName + this.lastName;
};

var Person = function(type, firstName, lastName) {
    console.log(arguments)
    Human.apply(this, arguments);
    this.firstName = firstName;
    this.lastName = lastName;
};

Person.prototype = Object.create(Human.prototype);
Person.prototype.constructor = Person; // 상속하는 부분
Person.prototype.sayName = function() {
    alert(this.firstName + ' ' + this.lastName);
};

var yunjin = new Person(undefined ,'YunJin', 'Choi');
Human.isHuman(yunjin); // true
```

``` javascript
class Human {
    constructor(type = "Human"){
        this.type = type;
    }

    static isHuman(human){
        return human instanceof Human;
    }

    info (){
        return "이름 : "+ this.firstName + this.lastName;
    }
}

class Person extends Human{
    constructor(type , firstName , lastName){
        super(type)
        this.firstName = firstName;
        this.lastName = lastName;
    }

    sayName(){
        alert(this.firstName + ' ' + this.lastName);
    }
}
let yunjin = new Person(undefined ,'YunJin', 'Choi');
Human.isHuman(yunjin);
```

## 구조화 할당 vs 비구조화 할당
- 한줄의 코드로 객체를 분해하여 각 변수에 담아주는 문법. 
- 지금까지의 객체는 기존의 객체에서 값을 꺼내 변수에 담아 사용.

``` javascript
var type = ['a','b','c','d'];
var settings = {
    SERVER_INFO : "ORACLE",
    SERVER_IP : "127.0.0.1",
    PORT : "1521",
    SID : "ORCL"
};

var SERVER_INFO = settings.SERVER_INFO;
var SERVER_IP = settings.SERVER_IP;
var PORT = settings.PORT;
var SID = settings.SID;
console.log(SERVER_INFO ,  SERVER_IP , PORT , SID);
console.log(type[0] , type[1] , type[2] , type[3]);
``` 

``` javascript
let type = ['a','b','c','d'];
let settings = {
    SERVER_INFO : "ORACLE",
    SERVER_IP : "127.0.0.1",
    PORT : "1521",
    SID : "ORCL"
};

let [a,b,c,d] = type;
let {SERVER_INFO , SERVER_IP, PORT, SID} = settings;
console.log(SERVER_INFO ,  SERVER_IP , PORT , SID);
console.log(a,b,c,d);
```

- 주의할 점은 var로 할당하려는 변수명과 구조화된 데이터의 property명이 같아야 한다.({} 안에 있는 구조화된 key값들과 변수명이 같아야 한다) 또한 구조화된 데이터가 아니라 배열의 경우 {} 대신 []를 사용해서 위와 유사하게 사용할 수 있다.

``` javascript
  var [col1, col2]  = $('.column'),
  [line1, line2, line3, , line5] = file.split('\n')
```
 
## Promises
- ES6에서는 표준 Promise가 제공된다.
- 아래는 setTimeout 을 이용한 지연된 비동기 실행에 대한 ES5 예시다.

``` javascript
setTimeout(function(){
  console.log('Yay!')
}, 1000)
```
- 위 예시를 ES6에서 Promise를 사용해서 재작성하면 아래와 같다.

``` javascript
var wait1000 =  new Promise(function(resolve, reject) {
  setTimeout(resolve, 1000)
}).then(function() {
  console.log('Yay!')
})
```
- 위 예시를 화살표 함수를 사용해 재작성한 예시는 아래와 같다.

``` javascript
var wait1000 =  new Promise((resolve, reject)=> {
  setTimeout(resolve, 1000)
}).then(()=> {
  console.log('Yay!')
})
```
- ES5 보다 ES6의 Promise를 사용한 예시가 더 복잡해 보이지만 아래와 같이 중첩된 setTimeout 예시를 보면 Promise의 이점을 확인할 수 있다.

``` javascript
setTimeout(function(){
  console.log('Yay!')
  setTimeout(function(){
    console.log('Wheeyee!')
  }, 1000)
}, 1000)
```

- 아래는 ES6 Promise 로 작성된 예시.
``` javascript
var wait1000 =  ()=> new Promise((resolve, reject)=> {setTimeout(resolve, 1000)})
wait1000()
    .then(function() {
        console.log('Yay!')
        return wait1000()
    })
    .then(function() {
        console.log('Wheeyee!')
    });
```
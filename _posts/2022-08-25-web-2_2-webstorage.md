---
layout: single
title:  "[WEB] - Web Storage 기본"
excerpt: "localStorage, sessionStorage"

categories:
  - web-2
tags:
  - [web-2, localStorage, sessionStorage]

toc: false
toc_sticky: true
 
date: 2022-08-25
last_modified_at: 2022-08-25
---

# Web Storage 

## 1. localStorage와 sessionStorage
  * 웹 스토리지 객체(web storage object)인 localStorage와 sessionStorage는 브라우저 내에 키-값 쌍을 저장.
  * 이 둘을 사용하면 페이지를 새로 고침하고(sessionStorage의 경우) 심지어 브라우저를 다시 실행해도(localStorage의 경우) 데이터가 사라지지 않고 저장가능.

### 쿠키 이외 WebStorage 사용이유
  * 쿠키와 다르게 웹 스토리지 객체는 네트워크 요청 시 서버로 전송되지 않음. 
  * 쿠키보다 더 많은 자료를 보관가능, 대부분의 브라우저가 최소 2MB 이상 웹 스토리지 객체를 저장가능. 
  * 서버가 HTTP 헤더를 통해 스토리지 객체를 조작불가
  * 웹 스토리지 객체는 도메인·프로토콜·포트로 정의되는 오리진(origin)에 종속. 
    - 따라서 프로토콜과 서브 도메인이 다르면 데이터에 접근불가.
  * 두 스토리지 객체는 동일한 메서드와 프로퍼티를 제공합니다.

### 사용법
  * setItem(key, value) – 키-값 쌍을 보관.
  * getItem(key) – 키에 해당하는 값을 취득.
  * removeItem(key) – 키와 해당 값을 삭제.
  * clear() – 모든 값 삭제.
  * key(index) – 인덱스(index)에 해당하는 키 취득.
  * length – 저장된 항목의 개수 취득.

### localStorage
  * 오리진이 같은 경우 데이터는 모든 탭과 창에서 공유.
  * 브라우저나 OS가 재시작하더라도 데이터가 파기되지 않음.

#### 사용법
> localStorage.setItem('test', 1);
> 브라우저를 닫고 재오픈 후 다른 창에서 실헹
>
> alert( localStorage.getItem('test') ); // 1
>
> 오리진(domain/port/protocol)만 같다면 url 경로는 달라도 동일한 결과.

  - localStorage는 동일한 오리진을 가진 모든 창에서 공유
  - 한 창에 데이터를 설정하면 다른 창에서도 변동 사항이 적용

  - 일반 객체처럼 사용하기
    - localStorage의 키를 얻거나 설정할 때, 아래처럼 일반 객체와 유사한 방법을 사용할 수 있습니다.

```javascript
  // 키 설정하기
  localStorage.test = 2;
  // 키 얻기
  alert( localStorage.test ); // 2
  // 키 삭제하기
  delete localStorage.test;
```

##### 키 순회하기

```javascript
  let keys = Object.keys(localStorage);
  for(let key of keys) {
    alert(`${key}: ${localStorage.getItem(key)}`);
  }
```
- Object.keys는 해당 객체에서 정의한 키만 반환하고 프로토타입에서 상속받은 키는 무시.
- localStorage의 키와 값은 반드시 문자열이어야 합니다.
- 숫자나 객체 등 다른 자료형을 사용하게 되면 문자열로 자동 변환됩니다.

- JSON을 사용하면 객체를 쓸 수 있긴 합니다.
```javascript
  localStorage.user = JSON.stringify({name: "John"});

  let user = JSON.parse( localStorage.user );
  alert( user.name ); // John

  // 보기 좋도록 JSON.stringify에 서식 옵션을 추가했습니다.
  alert( JSON.stringify(localStorage, null, 2) );
```

### sessionStorage
- essionStorage는 현재 떠 있는 탭 내에서만 유지.
- 같은 페이지라도 다른 탭에 있으면 다른 곳에 저장.
- 하나의 탭에 여러 개의 iframe이 있는 경우엔 동일한 오리진에서 왔다고 취급되기 때문에 sessionStorage가 공유.
- 페이지를 새로 고침할 때 sessionStorage에 저장된 데이터는 보존. 하지만 탭을 닫고 새로 열 때는 사라짐.

##### storage 이벤트
- localStorage나 sessionStorage의 데이터가 갱신될 때, storage 이벤트가 실행
- storage 이벤트는 다음과 같은 프로퍼티를 지원합니다.
  - key – 변경된 데이터의 키(.clear()를 호출했다면 null)
  - oldValue – 이전 값(키가 새롭게 추가되었다면 null)
  - newValue – 새로운 값(키가 삭제되었다면 null)
  - url – 갱신이 일어난 문서의 url
  - storageArea – 갱신이 일어난 localStorage나 sessionStorage 객체

- storage 이벤트가 이벤트를 발생시킨 스토리지를 제외하고 스토리지에서 접근 가능한 window 객체 전부에서 발생
- 두 개의 창에 같은 사이트를 띄워놨다고 가정해봅시다. 창은 다르지만 localStorage는 서로 공유.
- 사용자가 실수로 페이지를 닫은 경우, 다시 열었을 때 미처 마무리하지 못했던 입력을 이어서 할 수 있도록 해줍시다.

```javascript
  <!doctype html>
  <textarea style="width:200px; height: 60px;" id="area" placeholder="Write here"></textarea>
  <br>
  <button onclick="localStorage.removeItem('area');area.value=''">Clear</button>
  <script>
      area.value = localStorage.getItem('area');
      area.oninput = () => {
        localStorage.setItem('area', area.value)
      };
  </script>
```
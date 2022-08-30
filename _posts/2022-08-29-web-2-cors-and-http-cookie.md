---
layout: single
title:  "[WEB] - CORS와 HTTP Cookie"
excerpt: "웹소켓"

categories:
  - web-2
tags:
  - [web-2, CORS, Cookie]

toc: false
toc_sticky: false
 
date: 2022-08-27
last_modified_at: 2022-08-27
---
# CORS와 HTTP Cookie
### CORS (Cross-Origin Resource Sharing) 
- 서로 다른 도메인, 또는 프로토콜을 사용하는 클라이언트와 API 서버가 통신할 때 발생하는 현상.
- 추가 HTTP 헤더를 사용하여, 한 출처에서 실행 중인 웹 애플리케이션이 다른 출처의 선택한 자원에 접근할 수 있는 권한을 부여하도록 브라우저에 알려주는 체제.
- 웹 애플리케이션은 리소스가 자신의 출처(도메인, 프로토콜, 포트)와 다를 때 교차 출처 HTTP 요청을 실행
- 클라이언트가 다른 도메인의 서버에 요청하면 **Cross-Origin HTTP 요청**에 의해 요청. **Cross-Origin HTTP 요청**에 따른 HTTP 요청과 응답은 CORS 매커니즘으로 구성.
- 서버에서는 다른 도메인을 사용하는 클라이언트의 요청이 왔을 때 허용/거부 여부를 설정. 허용/거부에 대한 설정은 HTTP Header 중 **Access-Control-Allow-Origin**을 사용.
- **Access-Control-Allow-Origin**에 허용할 도메인을 명시하거나 모든 도메인을 허용할 수 있는 와일드 카드(*)를 작성한다.

![CORS1](./../../images/sr_web/cors1.png)


![CORS2](./../../images/sr_web/cors2.png)


#### [예제] Access-Control-Allow-Origin 사용전 현상
> 클라이언트(http://localhost:3000), 서버(http://localhost:4000)

**Access-Control-Allow-Origin**을 서버 응답 헤더에 설정하지 않으면 정책에 대한 오류를 발생한다.

##### Chrome 개발자 도구 > Console
Access to fetch at 'http://localhost:4000/' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

## 서버쪽에서의 설정
#### Access-Control-Allow-Origin 사용
**Access-Control-Allow-Origin**를 서버 응답 헤더에 설정하면 정상적으로 동작된다.

## HTTP Cookie 사용을 위한 Credentials 설정
#### HTTP Cookie를 사용하게된 상황
먼저 HTTP Cookie를 사용하게 되었던 이유는 로그인과 로그인 여부를 판단하기 위해서다. 서비스 구성은 클라이언트 서비스, API 서버, 로그인 서비스가 세가지로 각각 다른 도메인을 사용하고 있다.

로그인 서비스에서 로그인 완료 후 Cookie에 로그인 완료 여부를 담아주고 클라이언트 서비스로 Redirect를 해준다. Cookie를 클라이언트 서비스에서 접근할 수 없게 Cookie는 HttpOnly로 설정되어 있다.

> Cookie가 HttpOnly로 설정되면 Javascript의 `document.cookie`로 접근할 수 없다.

클라이언트 서비스에서는 **로그인 여부를 판단**하기 위해서 API 서버에 요청하게 된다. 이때 API 서버에서 Cookie를 사용하기 위해서 **클라이언트와 서버의 Credentials** 설정이 필요하다.

## 해결방법
### Credentials 설정
클라이언트와 서버에서는 모두 Credentials를 활성화 해야 한다.

#### 1. 클라이언트 Credentials 설정
클라이언트에서는 Javascript API 에 따라 다르게 설정할 수 있다. 대표적으로 사용하는 fetch, XMLHttpRequest 예시이다.
```js
fetch('http://localhost:4000', {
  credentials: 'include'
})
```
```js
const xhr = new XMLHttpRequest();
const url = 'http://localhost:4000';

xhr.open('GET', url, true);
xhr.withCredentials = true;
xhr.send();
```

#### 2. 서버 Credentials 설정
서버에서 Credentials은 응답 헤더에 설정한다. **Access-Control-Allow-Credentials** 명의 헤더에 true로 설정하면 된다.
```js
res.header("Access-Control-Allow-Credentials", true)
```

**Credentials**를 활성화 후 HTTP 요청을 하게되면 아래와 같은 에러가 발생한다.

Access to fetch at 'http://localhost:4000/' from origin 'http://localhost:3000' has been blocked by CORS policy: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.

**Credentials** 활성화 후에는 **Access-Control-Allow-Origin**에 와일드 카드(*)를 사용할 수 없기 때문이다.

여기서 주의할 점은 Credentials를 활성화하는 것으로 클라이언트와 서버의 상황이 다르다. 서버에서는 Credentials를 활성화하는 것으로 Cookie를 접근할 수 있기 때문에 정상동작처럼 보인다. 하지만 클라이언트에서는 CORS 정책으로 HTTP 응답을 확인할 수 없다.

##### Credentials와 Access-Control-Allow-Origin 설정
서버 HTTP 응답 헤더 중 **Access-Control-Allow-Origin**에 허용할 클라이언트의 도메인을 작성한다. 설정 후 클라이언트 응답 헤더를 확인하면 정상 동작을 확인 할 수 있다.

##### 서버 HTTP 응답 헤더 설정
```js
res.header("Access-Control-Allow-Origin", "http://localhost:3000");
res.header("Access-Control-Allow-Credentials", true);
```

### 결론
- 클라이언트와 API 서버가 서로 다른 도메인을 사용하는 것은 현업에서 자주 사용되는 패턴. 
- CORS에 대한 이슈는 클라이언트와 서버 담당자 어느 한쪽에서만 숙지하는 게 아니라 모두 이해가 필요


## 참고 
### 새로고침 했을 때, Cookie가 없어지는 오류
- CORS 설정, Cookie 옵션까지 잘 작성한 뒤 서버에서 테스트를 했을 때 페이지를 새로고침(reload)했을 때 Cookie에 저장한 token이 없어지는 문제 발생
- Domain이 프론트 서버 도메인이 아닌 백앤드서버 도메인으로 되어 있을 것을 확인
- cookie option에 domain으로 프론트서버 주소를 지정해주니 쿠키 사라짐 문제 해결

#### CORS 설정
``` javascript
const corsOption = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOption));
```

- Origin
  - 프론트엔드 서버에서 credentials : 'include' 로 설정했을 때, 백엔드 서버에서 보내주는 origin이 '*' 이면 안된다. 따라서 하나의 도메인만 허용이 되도록 설정한다.
 
- Credentials
  - 백엔드 서버 : header에 Access-Control-Allow-Credentials를 포함할지 여부를 결정한다. => true
  - 백엔드 서버에서 response header에 Access-Control-Allow-Credentials 가 포함되고, 이렇게 헤더를 설정해서 보내줘야 브라우저에서 서버로부터 받은 response 메세지(body)를 클라이언트 서버에 전달해준다.
  - 프론트엔드 서버 : 클라이언트가 서버로 요청을 보낼 때, 어떤 경우에 쿠키 정보를 포함해서 보낼 건지 설정한다.
    - ommit : 어떤 경우에도 절대 쿠키정보를 포함하지 않는다.
    - same-origin : 도메인이 동일한 경우에만 쿠키를 자동을 포함한다.
    - include : 다른 도메인이라도 쿠키를 포함한다.
 
#### Cookie 설정
``` javascript
const options = {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        domain: 'localhost',
        maxAge: config.jwt.expiresInSec * 1000,
      };

res.cookie('token', token, options);
```

- HttpOnly
  - HttpOnly 옵션을 이용하면 브라우저만 cookie 정보를 읽을 수 있음.
  - 자바스크립트(코드)에서도 cookie의 정보를 읽을 수 없기 때문에 보안에 좋다.
 
- SameSite
  - 서로 다른 도메인에서의 쿠키전송에 관한 보안.
  - none : 도메인이 다른 경우(cross-origin)에도 브라우저가 쿠키를 포함해서 요청을 보낼 수 있음.
  - strict : 도메인이 다른 경우(cross-origin) 브라우저가 쿠키를 포함하지 않음.
  - lax : strict과 비슷하지만, 다른 도메인 내에서 same-origin의 도메인 주소를 가리키는 링크를 클릭한 경우, 해당 요청에 대해서만 쿠키를 포함해줌.
  - **크롬80버전 부터 기본값이 Lax**
 
- Secure
  - **SameSite='none' 일 경우 true 여야 한다.**
  - https 프로토콜을 사용할 때만 쿠키를 request header에 담겨서 서버에 보내지고 http 프로토콜일 때는 쿠키가 담겨지지 않음. 다만, localhost에서는 예외적으로 허용

- Domain
  - Secure 쿠키 전달을 하려면 프론트엔드와 백엔드가 같은 도메인을 공유해야한다.
  - 예: 클라이언트: https://shop.abc.com, 서버 API: https://api.abc.com)
 
- MaxAge
  - 쿠키의 만료기간을 지정한다.
  - JWT 토큰과 동일하게 만료기간을 적용, 다만 단위가 ms임에 주의 필요.



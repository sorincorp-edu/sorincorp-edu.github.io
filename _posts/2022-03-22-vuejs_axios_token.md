---
layout: single
title:  "[vusJS] axios와 jwt 토큰"
excerpt: "axios와 jwt 토큰"

categories:
  - vusJS
tags:
  - [vusJS]

toc: true
toc_sticky: true
 
date: 2022-03-22
last_modified_at: 2022-03-22
---
# 1. axios와 jwt 토큰
## 클라이언트에서 JWT 토큰 확인하기
- 서버에서 JWT 토큰을 전달하게 될 경우, res.data를 통해서 확인 가능. 
- httpsonly 보안 설정으로 브라우저 내에서 개발자 콘솔로 확인이 불가능 하니 염두하도록 하자.

```javascript
// 아래 token을 accesstoken으로 활용하면 된다.
//res.data = { 서버가 보내준 키 : 서버가 보내준 값, token : jwt토큰 값 }
const accessToken = res.data;
axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken.token}`;

//쿠키에 저장하기
document.cookie = `키이름=${accessToken.token}`;
```

## Authorizaiton
- Ajax request를 이용해 cookie를 비롯한 credential을 주고받기 위해서는 request, response에 Authorization HTTP header set up이 필요

- axios.post 발송시 하단 요청 추가

```json
  {
    withCredentials: true,
    crossDomain: true, 
    credentials: "include",
  }
```

## samesite 이슈로 서버에 samesite = none 추가요청
- HTTPS 프로토콜을 사용하시지 않는다면 sameSite = none을 설정하더라도 역시 쿠키가 보내지지 않는다. (로컬호스트에서 진행하는 경우는 예외) 
- 서버를 HTTPS 서버로 만들어야 한다.
- 로그아웃 시, clearCookie가 되지 않는다.
- 로그아웃을 보내면 clearCookie 가 되지 않는 이슈

res.clearCookie function doesn't delete cookies
ㄴ res.clearCookie() doesn't work#691

- jwt 방식 사용 시 로그아웃 관련 질문 : 한번 발생한 토큰은 수정/삭제가 불가능(만료시간까지!)

- 수동삭제를 하는게 아니라, 토큰이 만료되는 시간을 쿠키와 맞추는 방법을 시도해봐야할 듯하다. 토큰 만료시간은 현재 서버가 24시간 설정해뒀으므로, 발급 되는 순간 cookie의 만료시간이 24시간으로 동일하게 설정시키면 알아서 파괴되지 않을까 예상.

## 새로고침 없이 로그인 하기(by 인터셉터)
- 매번 요청시 코드 신경쓰지 않으면서 토큰을 매번 날리도록 만들어보겠습니다.
- 매번 액시오스로 api 요청을 할 때마다 헤더에 토큰을 넣어야 작동하는 부분을 사전 정의해서 생략해봅니다.
- 인터셉터란 : 뜻 그대로 가로채는 놈입니다. 보내기/받기 전에 뭔가 해줄 수 있는 것.
- 액시오스 인터셉터를 전역설정을 해두고 사용.

```javascript
  // Add a request interceptor
  axios.interceptors.request.use(function (config) {
      // Do something before request is sent
      return config;
    }, function (error) {
      // Do something with request error
      return Promise.reject(error);
    });
  
  // Add a response interceptor
  axios.interceptors.response.use(function (response) {
      // Do something with response data
      return response;
    }, function (error) {
      // Do something with response error
      return Promise.reject(error);
    });
```  
- 현재 코드는 아무 일도 일어나지 않습니다. 주석 부분의 do somthing에 뭔가를 하라는 거죠

#### 코드 추가

```javascript
  fe/src/router.js
  Vue.prototype.$apiRootPath = apiRootPath
  axios.defaults.baseURL = apiRootPath

  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  // axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  // Add a request interceptor
  axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers.Authorization = localStorage.getItem('token')
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
  })
  // Add a response interceptor
  axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response
  }, function (error) {
    // Do something with response error
    return Promise.reject(error)
  })
```

- 코드를 그대로 넣고 config.headers.Authorization 부분만 넣어주면 매번 보내기전에 거쳐서 토큰을 읽어서 헤더에 넣어놓는 것.

- 추가적인 방법들
  - 받는 부분에서도 토큰이 있을 경우 저장해 놓는 로직을 넣으면 좋습니다.
  - 액시오스 설정중 인스턴스를 만들어 놓고 하는 방법도 있습니다.

  ```javascript
    var instance = axios.create({
      baseURL: 'https://some-domain.com/api/',
      timeout: 1000,
      headers: {'X-Custom-Header': 'foobar'}
      interceptors //
    });
  ```

### 프로젝트 내 예제

```javascript
    LOGIN ({ commit }, { id, password }) {
      const form = new FormData()
      form.append('id', id)
      form.append('password', password)

      return axios.post('/login_processing', form)
        .then(res => {
          if (res.data.isSuccess) {
            this.chiefYn = res.data.chiefYn
            this.dept = res.data.dept
            this.loginInfo = res.data.details.deptNm + ' ' + res.data.details.name + ' ' + res.data.details.jikgubNm
            commit('LOGIN', res.headers)
            axios.defaults.headers.common.Authorization = 'Bearer ' + res.headers.bearer
          } else {
            alert(res.data.message)
          }
          return res.data
        })
    },
    LOGOUT ({ commit }) {
      commit('LOGOUT')
      return true
    },
```
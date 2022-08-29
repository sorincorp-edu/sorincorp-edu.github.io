---
layout: single
title:  "[WEB] - Web개발시 주의해야 할 보안요소"
excerpt: "Secure Coding"

categories:
  - web-5
tags:
  - [web-5, secureCoding]

toc: false
toc_sticky: false
 
date: 2022-08-29
last_modified_at: 2022-08-29
---
# Web개발시 주의해야 할 보안요소
- 웹 애플리케이션을 개발하면서 대부분 요구사항에 맞는 주요 기능을 개발하는데 열을 올린다. 주요 기능을 개발하는 것도 중요하지만 그것 못지 않게 아니면 더 중요한 것이 보안이다.해커가 공격하는 루트는 엄청나게 많지만 개발을 공부하는 입장에서 최소한의 방어를 가진 애플리케이션을 개발해야 한다. 간단한 케이스 별로 정리를 해두겠다. 

## 1. 버그 없는 코드 유지
- 대부분의 버그는 나쁜 것이며 버그가 보안 취약점을 일으킬 수 있다.
- 버그를 최소화 하는 법
  - 1) 테스트 하기 : 단위테스트부터 꼼꼼한 테스트는 버그를 줄일 수 있다.
  - 2) 코드 검토하기 : 코드를 많은 사람들과 본다.
  - 3) 신뢰할만한 라이브러리 사용 : 누군가 라이브러리를 만들었다면 잘 테스트되고 신뢰할만 한지 확인할 것.
  - 4) 좋은 코딩 관례 따르기 : 구조화가 잘 되어있는지 확인한다. 
  
  ## 2. 예외 처리
  - 소스코드 어디서든 에러가 발생할 수 있다. 그치만 에러 이후 개발자가 예상하지 못한 중단이 발생해서는 안된다.
  
  ## 3. 쿼리 문자열 분석 위험
  - 웹 애플리케이션에서는 쿼리 문자열을 사용하는 경우가 많다. 
  - 예를들어 "jeongpro blog" 라고 검색하면 아래처럼 표시될 수 있다.
    - http://mysearchengine.com/search?q=jeongpro+blog
  - 이것을 Express에서 req.query로 가져와서 분석하는 예제를 보겠다.
  
  ``` javascript
  app.get("/search",function(req,res){    
      var search = req.query.q.replace(/\+/g, " ");    
      // .... 기타처리....
  });
  ```

  - 이것은 예상대로 쿼리가 들어오지 않으면 문제를 일으킨다. 
  - "/search"만 입력하면 정의되지 않은 변수에서 .replace를 호출해서 에러가 난다.
  
  ``` javascript
  app.get("/search",function(req,res){    
    var search = req.query.q || ""; 
    // 정의되지 않았을 때     
    var terms = search.split("+");    
    // .... 기타처리....
  });
  ```

  - 조금 개선해서 정의되지 않았을 때 빈문자열로 하게 만들었지만 이번엔 쿼리 문자열의 형식이 문제다.
  - 예를들어 "/search?q=abc"를 방문하면 req.query.q는 문자열이다. 
  - "/search?q=abc&name=jeongpro"를 방문하면 req.query.q는 여전히 문자열이다. 그런데 "/search?q=abc&q=def"를 방문하면 req.query.q는 배열이 된다. 배열에 split() 함수가 없으니 에러가 난다. 이런 동작이 허용되어서는 안된다. 
  - nodejs에서는 "arraywrap 패키지"를 받아서 처리한다. 원리는 문자열이 오면 배열로 래핑해버리고 배열이 오면 이미 배열이기때문에 배열 그대로 리턴한다.

    ``` javascript
  var arrayWrap = require("arraywrap");
  //..
  app.get("/search",function(req,res){    
    var search = arrayWrap(req.query.q || "");    
    var terms = search[0].split("+");    
    // .... 기타처리....
  });
  ```
  - 이렇게 처리하면 많은 쿼리가 와도 첫번째 쿼리만 받고 나머지는 무시하며 쿼리 인수를 하나든 없든 잘 동작한다.
  - **결론 : 사용자 입력을 절대로 신뢰하지 말라.**
  
## 4. HTTPS 사용
- HTTPS를 사용하면 모든 종류의 공격에 대해 사용자를 보호하는 데 도움을 준다.
### 사용자에게 HTTPS 사용 적용하기
- 1) "trust proxy" 설정 (heroku를 사용한다면 heroku는 서버와 클라이언트 사이에 놓인다. 이것을 Express에게 알려줘야 한다.)
- 2) 미들웨어 호출하기.

``` javascript  
  var enforceSSL = require("express-enforces-ssl");
  // ....
  app.enable("trust proxy");
  app.use(enforceSSL());
```

- 기본적으로 HTTPS를 통한 요청이 오면 나머지 미들웨어와 라우트를 계속 실행하고, HTTP요청으로 오면 HTTPS버전으로 redirection 한다.

### 사용자의 HTTPS 연결 유지하기
- HTTPS로 접속했을 때 HTTP로 가지 않게 하기위해 HSTS(HTTP Strict Transport Security)라는 기능을 지원한다.
- Strict-Transport-Security : max-age=31536000 하면 약 1년간 HTTPS로 묶어둔다.

``` javascript  
var helmet = require("helmet");
var ms = require("ms");
//....
app.use(helmet.hsts({    
  maxAge: ms("1 year"),    
  includeSubdomains: true}
));
```

- helmet 미들웨어와 ms 모듈을 설치했다. 
- helmet을 통해 HSTS기능을 적용하고 ms를 통해 "2 days" 같이 사람이 쓰는 문자열을 밀리초로 변환 해줬다.

## 5. 교차 사이트 스크립팅 공격 방어
- XSS(교차 사이트 스크립팅) 공격은 쉽게 생각하면 입력하는 곳에 스크립트를 넣어버리는 것이다.
- 이름에 Jeong pro<script>tansferMoney(1000000,"jeong amateur");</script>를 넣는다면 계좌 이체가 되어버릴 수 도 있다.
- 또한 <script src="http://jeongama.biz/hacker.js"></script>를 추가할 수도 있다.
### 방어법
- 1) 일단 유효성 검사를 통해서 불가하게 할 수 있고, 긴 입력이 불가하게 막을 수도 있다.
- 2) html태그를 무력화 시켜버리는 것도 있다.
  - hello <script src="http://jeongama.biz/hacker.js"></script>가hello &lt;script src="http://jeongama.biz/hacker.js"&gt;&lt;/script&gt; 으로 변환 되는 것이다. 
  - 이런 escape 처리는 템플릿 엔진으로 처리 한다. Pug는 자동 처리되고 ejs는 <%= myString %>을 사용하고 <%- userString %>을 사용하지 않는다.
- 3) URL을 입력해야 한다면 encodeURI 함수를 호출해 URL이 안전한지 확인해야 한다.
- 4) html특성 내에 뭔가 넣기(링크의 href)를 한다면 사용자가 인용부호를 넣을 수 없는지 확인해야한다. 또한 DB에 넣기전에도 검사하는 것도 좋다.
- 5) HTTP헤더로 완화하기

``` javascript  
app.use(helmet.xssFilter());
```

- 한 문장으로 이용해서 X-XSS-Protection 보안헤더를 작성. 
- 이것으로 검색엔진에서 "<script src="http://jeongama.biz/hacker.js"></script>" 로 검색하는 경우 url을 보호할 수 있다.

## 6. CSRF (교차 사이트 요청 위조)
- 은행 사이트를 예로 들면 이체 양식 post form이 있다. 은행은 어차피 쿠키가 올바른 것을 확인하고 이체를 하는데 이런 보안 방법을 악용해서 내가 POST요청을 만드는 즉, 해커가 심어놓으면 내 쿠키의 값이 올바른 것을 확인하고 이체가 되게 만들어 버릴수 있다.
- CSRF 공격을 성사시키기 위해서는 아무도 모르게 양식을 제출해야한다.

``` html
<h1>Transfer money</h1>
<form method="post" action="https://mybank.biz/transfermoney">    
  <input name="recipient" value="yourname" type="text">    
  <input name="amount" value="1000000" type="number">    
  <input type="submit">
</form>
```

- 이렇게 만들면 의심스러워서 보통 submit을 누르지 않는다.따라서 해커는 자동으로 제출해버리는 방법을 택한다.

``` javascript 
<script>
  var formElement = document.querySelector("form");
  formElement.submit();
</script>
```

- 이렇게 자기의 폼과 자동 제출을 넣은 것을 iframe으로 보이지 않게 해버린다.
- CSRF 보호 방법은행에서 특정 폼에대한 HTML을 전송할 때 숨긴 요소(토큰)을 양식에 추가한다.
- 토큰은 완전 랜덤하고 추측이 어려운 문자열이다. <input name="_csrf" type="hidden" value="1dmkTnkHePmTB0d1glhm">이제 양식을 제출하고 POST요청을 할 때 은행은 csrf토큰이 방금 받은 것과 일치하는지 확인한다.

  - 1) 사용자에게 데이터 요청할 때마다 임의의 csrf 토큰을 만든다.
  - 2) 그 데이터를 처리할 때마다 토큰의 유효성을 검증한다.
  
### 방어법
- Referer 체크
  - HTTP 헤더에 있는 Referer로 해당 요청이 요청된 페이지의 정보를 확인하는 방법. 간단하여 소규모 웹사이트에 주로 이용된다. 하지만, 해당 정보는 Paros나 Zap, fiddler같은 프로그램으로 조작이 가능하다.

- GET / POST 요청 구분
  - img 태그 등의 경우 GET 요청으로, form 태그로 값을 받을 경우 POST를 이용하여 요청을 구분해준다.

- Token 사용
  - 서버에서 hash로 암호화 된 token을 발급, 사용자는 매 요청마다 token을 함께 보내어 서버의 검증을 거쳐야한다.

- 추가 인증 수단 사용 ( ex. CAPCHA )
  - 추가 인증 수단을 거쳐 만약 테스트를 통과하지 못할 시, 해당 요청 자체를 거부하는 방법.
  
  
## 7. 클릭재킹으로 부터 보호
- 클릭재킹은 쉽게 설명하면 클릭을 유도한 후 내가 클릭하는 부분을 가로채서 다른 것을 누르게 해서 문제를 만드는 방식이다.
- 페이스북 좋아요 버튼 위치에 클릭을 가로채서 포르노 사이트로 유도하는 것이 하나의 예다.
- 이것에 대응할 수 있는 것이 제한적인 X-Frame-Option을 보내서 브라우저가 더이상 이 프레임을 로드하지 않게 하는 것이다.
- X-Frame-Option의 종류
  - DENY : 이 홈페이지는 다른 홈페이지에서 표시할 수 않음
  - SAMEORIGIN : 이 홈페이지는 동일한 도메인의 페이지 내에서만 표시할 수 있음
  - ALLOW-FROM origin : 이 홈페이지는 origin 도메인의 페이지에서 표함하는 것을 허용함

### 방어법  
  - X-Frame-Option을 deny를 줘서 방지.
  **해당하는 웹서버의 설정파일의 마지막에 다음과 같이 추가하고 웹서버를 다시 시작한다.**
>
> [Apache]
> Header always append X-Frame-Options DENY
>
> [Nginx]
> add_header X-Frame-Options DENY;
>
> [Java 어플리케이션]
> response.addHeader("X-Frame-Options", "SAMEORIGIN");
>
> [IIS - web.config]
> 
> <system.webServer>
>  ...
>  <httpProtocol>
>    <customHeaders>
>      <add name="X-Frame-Options" value="DENY" />
>    </customHeaders>
>  </httpProtocol>
> ...
> </system.webServer>
>  
## 8. 브라우저에서 파일 형식 추측 금지하기
- 사용자가 서버에 file.txt라는 평문의 파일을 업로드할 경우 file.txt 파일안에 스크립트가 있었다면

``` javascript 
function stealuserData(){    
  //해...킹
}
stealuserData();
```

- cs많은 브라우저에서 파일 형식이 자바스크립트용이 아니라면 실행하도록 허용한다. 
- 굉장히 위험파일이 html과 같다면 이 파일을 html로 해석한다.

### 방어법
- X-Content-Type-Options 헤더를 nosniff라는 옵션으로 설정
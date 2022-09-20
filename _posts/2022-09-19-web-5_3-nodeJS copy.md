---
layout: single
title:  "[WEB] - nodeJS와 npm"
excerpt: "node.js 설치와 간단한 예제"

categories:
  - web-5
tags:
  - [nodeJS, npm]

toc: false
toc_sticky: false
 
date: 2022-08-29
last_modified_at: 2022-08-29
---

# Javascript와 Nodejs의 차이
## 1. 개요
- JavaScript : 브라우저, 문서 등을 다루는 즉, client에 대한 개발을 하는 도구
- nodejs : backend 에서 server에 대한 개발을 하는 도구

## 2. 설명
- nodejs는 chrome의 자바스크립트 엔진인 v8을 이용.
- 자바스크립트는 스크립트 언어로써 특정한 환경(브라우저) 에서만 사용가능한데
nodejs를 통하여 특정한 환경(브라우저) 없이도 실행가능.
- JavaScript를 크롬(Chrome)같은 브라우저에서만 쓰는 것이 아닌 브라우저 밖. 즉, 내 컴퓨터에서 다양한 용도로 확장하기 위해 만들어진 것이 바로 Node.js.
- nodejs를 이용하여 Express 같은 라이브러리를 사용하여 자바스크립트 언어로 서버구축 가능

## 3. 정리

| Javascript | Node.js |
| ---------- | ------- |
| 프로그래밍 언어 |	브라우저 밖에서 동작하는 Javascript 런타임 |
| 브라우저에서만 동작 | 데스크탑에서 동작 |
| Client에 대한 개발 | Express 와 같은 라이브러리를 사용하여 js언어로 웹서버 구축 |

## 4 .설치
### npm의 정의
- npm : Node.js 패키지 관리자(NodeJs Package Manager)
- npm 은 'node.js 로 만들어진 프로그램을 쉽게 설치 등을 주는 것

### npm 설치 (Node.js 설치)

#### 01. Node.js 홈페이지 방문
- https://nodejs.org/ko/

#### 02. Node.js 다운로드
  Node.js 홈페이지에 들어가면 자신의 운영체제에 맞는 다운로드가 제공.
  - 현재버전 : 지금까지 나온 버전 들 중 최신 버전.  
  - LTS : 지금까지 나온 버전들 중 많은 사람들이 사용하면서 나온 버그들을 패치하여 가장 안정적인 버전
  - 전체 버전 확인 : nodejs.org/ko/download/

#### 03. Node.js 설치
- 다운로드 받은 파일 설치.

#### 04. Node.js 버전 확인
- node -v : 설치된 버전을 확인.

#### 05. npm 버전 확인
- npm -v : npm 버전 확인
 
  > 잠고 : Node.js Error: Cannot find module express
  >
  > $ npm install express

## 5. 샘플
hello.js
 
```javascript
  // Load HTTP modulevar 
  http = require("http"); 

  // Create HTTP server and listen on port 8000 for requests
  http.createServer(function(request, response) {

    // Set the response HTTP header with HTTP status and Content type   
    response.writeHead(200, {'Content-Type': 'text/plain;charset=UTF-8'});

    // Send the response body "Hello World"   
    response.end('안녕하세요~~~ nodeJS 입니다.\n');
  }).listen(8000); 

  // Print URL for accessing server
  console.log('Server running at http://127.0.0.1:8000/');
```
- 실행 : node hello.js


app.html
 
```html
<html>
    <head>
        <title>NodeJS-Test</title>
        
        <!-- 제이쿼리 불러오기 -->
        <script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
        <script src="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
    </head>
    <body>
        <input type="text" id="name" />
        <input type="submit" id="OK"/>
        
        <script>
            $("#OK").click(function(){      // OK 버튼 클릭하면
                $.ajax({
                    url: 'http://127.0.0.1:3000/postTest',       // postTest 주소로
                    async: true,            // 동기화 - 서버에서 반응이 올때까지 기다림
                    type: 'POST',           // POST 방식으로
                    data: {
                        test: $("#name").val()  // 텍스트필드에 입력한 값을 test라는 이름으로 보냄
                    },
                    dataType: 'json',
                    success: function(data) {   // POST 요청 성공 시
                        alert("보내기 성공");
                    },
                    error: function(err) {      // POST 요청 실패 시
                        alert("보내기 실패 " + err);
                    }
                }); 
            });
        </script>
    </body>
</html>
```

app.js
 
```javascript
  const express = require("express");
  const ejs = require("ejs");
  const bodyParser = require("body-parser"); // body-parser 요청
  const app = express();

  app.set("view engine", "ejs");
  app.use(bodyParser.urlencoded({ extended: false })); // URL 인코딩 안함
  app.use(bodyParser.json()); // json 타입으로 파싱하게 설정
  app.use(express.static(__dirname + "/"));

  app.get("/", function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.render("test1", {});
  });

  app.get("/", function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.render("test2", {});
  });

  app.post("/postTest", function (req, res) {
    // postTest라는 주소로 POST요청이 들어오면 실행

    console.log(req.body); // body에 있는 정보를 콘솔창에 출력.
    res.header("Access-Control-Allow-Origin", "*");
    res.json({ ok: true }); // 클라이언트에 성공했다고 신호를 보냄.
  });

  app.listen(3000, function () {
    console.log("실행중...");
  });
```


## 참고 npm 명령어
### npm init
Node.js 프로젝트를 시작할때 package.json을 생성.

- package.json : 프로젝트의 정보와 특히 프로젝트가 의존하고 있는(설치한) 패키지(모듈)에 대한 정보가 저장되어 있는 파일.
- 기본 프로젝트 package.json 예제
```json
{
  "name": "example",
  "version": "1.0.0",
  "description": "example",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "example"
  },
  "keywords": [
    "example"
  ],
  "author": "minchan",
  "license": "MIT"
}
```

- React Native 프로젝트 package.json 예제
```json
{
  "name": "example",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    "@react-native-community/masked-view": "0.1.6",
    "@react-navigation/bottom-tabs": "5.0.0",
    "@react-navigation/drawer": "5.0.0",
    "@react-navigation/native": "5.0.0",
    "@react-navigation/stack": "5.0.0",
    "react": "16.9.0",
    "react-native": "0.61.5",
    "react-native-gesture-handler": "1.5.6",
    "react-native-reanimated": "1.7.0",
    "react-native-safe-area-context": "0.7.0",
    "react-native-screens": "2.0.0-beta.2"
  },
  "devDependencies": {
    "@babel/core": "7.8.4",
    "@babel/runtime": "7.8.4",
    "@react-native-community/eslint-config": "0.0.7",
    "@types/react": "16.9.19",
    "@types/react-native": "0.61.10",
    "babel-jest": "25.1.0",
    "eslint": "6.8.0",
    "jest": "25.1.0",
    "metro-react-native-babel-preset": "0.58.0",
    "react-test-renderer": "16.9.0",
    "typescript": "3.7.5"
  },
  "jest": {
    "preset": "react-native"
  }
}
```

package.json에 프로젝트에 대한 정보, npm과 연결하여 사용할 명령("scripts"객체), 프로젝트가 의존하고 있는(설치한) 패키지(모듈)에 대한 정보("dependencies"객체), 프로젝트의 개발과 관련된 테스트, 컴파일, 코드 작성 형태와 같은 패키지(모듈)에 대한 정보("devDependencies"객체) 등이 저장.

### npm install 패키지명(npm i 패키지명)
- 필요한 패키지를 설치. (설치한 패키지는 node_modules 폴더에 저장)
- 옵션

  -g : 패키지가 해당 프로젝트(local)가 아닌 시스템 레벨에 전역(global) 설치되어 다른 Node.js 프로젝트에서도 사용할 수 있게 됩니다.
 
  --save(-S) : package.json의 "dependencies"객체에 추가됩니다. (npm5부터 default로 설정되어 더 이상 사용하지 않습니다.)
 
  -–save-dev(-D) : package.json의 "devDependencies"객체에 추가됩니다.
 
  @패키지 버전 : 패키지명 뒤에 @패키지 버전을 쓰면 해당 버전의 패키지가 설치되며 입력하지 않을 시 최신 버전으로 설치.

- npm install(npm i) 사용요령
  - 만약 패키지명을 입력하지 않고 npm install(npm i)만 입력할 시 package.json의 "dependencies"객체에 명시되어 있는 패키지(모듈)들을 모두 설치.

  - 프로젝트의 형상관리를 위해 GitHub와 같은 저장소에 업로드할 때, 무겁고 수많은 패키지(모듈)들을 전부 업로드하는 것이 아니라, package.json만 업로드해놓으시면 나중에 프로젝트를 내려받았을 때 npm i 명령어를 통해서 기존 프로젝트에서 사용하던 패키지(모듈)들을 손쉽게 원상복귀 가능 (.gitignore파일에 node_modules를 추가하여 패키지(모듈)들이 commit되지 않게 주의)

### npm uninstall 패키지명
- npm uninstall 명령 뒤에 삭제하실 패키지명을 입력하면 설치된 패키지가 node_modules폴더에서 삭제될 뿐만 아니라 package.json의 "dependencies"객체에서도 삭제. (단, 설치하실 때 옵션을 사용했다면 삭제하실 때도 같은 옵션을 추천)

### npm update 패키지명
- 설치된 패키지를 최신 버전으로 업데이트합니다.

### npm cache clean, npm rebuild
- npm cache clean 명령은 npm의 cache를 삭제 npm rebuild 명령은 npm을 새롭게 재설치. 
- 주로 npm 명령어가 안 먹히거나 기타 잡다한 버그가 생겼을 시 사용.


## 랜덤한 강아지 이미지표시 예제

```javascript
npm init -y
npm install express ejs request

mkdir public
mkdir views

main.js 셍성
/views/randomdog.ejs 생성
```

main.js

```javascript
const express=require('express');
const request=require('request');
const ejs=require("ejs");
const app=express();
 
app.set('view engine', 'ejs');
app.set('views', './views');
 
// public 폴더하위의 파일들을 기본으로 서비스
app.use(express.static('public'));
 
app.get('/randomdog', function(req,res) {
    request("https://random.dog/woof.json",
function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            let object = JSON.parse(body);
            res.render('randomdog', {
                imagesize: object.fileSizeBytes,
                imageurl: object.url
            });
        }
    });
});
 
// 페이지를 찾을 수 없음 오류 처리
app.use(function(req, res, next) {
    res.status(404);
    res.send(
        '<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">' +
        '<html><head><title>404 페이지 오류</title></head>' +
        '<body><h1>찾을 수 없습니다</h1>' +
        '<p>요청하신 URL ' + req.url + ' 을 이 서버에서 찾을 수 없습니다..</p><hr>' +
        '</body></html>'
    );
});
app.listen(5500, function() {
    console.log("실행중...");
});
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>랜덤 강아지</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
        <h1>랜덤한 강아지가 화면에 표시가 되요</h1><br/>
        용량 : <%=imagesize%> bytes.<br/>
        <div style="border:5px solid black;padding:5px; width:550px;heght:550px;">
                <img src='<%=imageurl%>' width='500' height='500' style='text-align:center'>
        </div>
        API 정보 : https://random.dog/woof.json
  </body>
</html>
```

- node main.js 실행

- http://localhost:5500/randomdog 으로 접속



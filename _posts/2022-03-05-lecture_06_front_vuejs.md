---
layout: single
title:  "[vusJS] - vueJS 설치 및 BackEnd 연계"
excerpt: "Windows환경 VueJS 설치 및 BackEnd 연계방법"

categories:
  - vusJS
tags:
  - [vusJS, vusJS, vusJS]

toc: true
toc_sticky: true
 
date: 2022-03-21
last_modified_at: 2022-03-21
---
# vueJS 개발환경 및 BadkEnd 연동
## 1. vueJS 개발환경
### 1-1. VSCode 설치
#### 플러그인 설치
- [공통]
  - Auto close Tag : 자동 태그 닫기
  - Color Highlight : 컬러 색상 미리보기
  - Live Server : 코딩을 실시간으로 확인-적용시켜 작업하기 편리
  - One dark pro : 어두운 테마로 작성하는 코딩이 눈에 잘 띔
  - Korean Language Pack for Visual Studio Code : VSCode 한국어 지원
  - Prettier : 코드 자동 정렬 ( ** 추후 추가 설정 필요 **)
  - ESLint  : 소스코드를 분석해 문법 에러, 버그를 찾기 ( ** 추후 추가 설정 필요 **)
  - vscode-icons : VSCode 내 파일의 아이콘을 설정하여 무슨 파일인지 한번에 파악가능
  - project manager 

- [ Vue관련 ]
  - Vetur : 문법 강조, vue.js 파일 코드의 하이라이팅 지원
  - Vue VSCode Snippets : 코드 조작 지원, vue.js 파일 초기 구성 생성
  - vue-beautify : 코드정렬
  - Vetur Extension
  - Vue 2 Snippets Extension
  - Vue 3 Snippets Extension
  - Vue peek

### 1-2. nodeJS 환경구축
- https://nodejs.org/ko/
- NodeJS를 설치하면 자동으로 npm(NodeJS Package Manager)도 함께 설치되므로 별도로 설치할 필요는 없다. npm이란 자바스크립트 기반의 패키지를 쉽게 설치 및 관리할 수 있도록 도와주는 툴.

```
PS C:\09_BLOG> node -v
v16.14.1
PS C:\09_BLOG> npm -v
8.5.0
```

### 1-3. Vue Devtools 설치
- Vue Devtools는 웹 브라우저인 크롬이나 파이어폭스에서 사용할 수 있는 확장애플리케이션.
- Vue를 사용한 애플리케이션을 개발할 때 도움을 주는 유용한 툴로서, 애플리케이션의 구조 및 데이터의 흐름을 디버깅할 때 유용하다. 별도로 설정을 변경하지 않으면 개발용 빌드에서는 사용할 수 있지만 배포용 빌드에서는 사용할 수 없다

### 1-4. Vue CLI 설치
- Vue CLI의 설치를 위해서 먼저 터미널 혹은 CMD에 설치 명령어를 입력한다.

>
> $ npm install vue-cli -g 
> 
> $ vue -V
> vue : 이 시스템에서 스크립트를 실행할 수 없으므로 C:\Users\m2m-129\AppData\Roaming\npm\vue.ps1 파일을 로드할 수
>  없습니다. 자세한 내용은 about_Execution_Policies(https://go.microsoft.com/fwlink/?LinkID=135170)를 참조하십시
> + ~~~
>     + CategoryInfo          : 보안 오류: (:) [], PSSecurityException
>     + FullyQualifiedErrorId : UnauthorizedAccess
> 
> $ vue.cmd create vue-cli
> 
>   vue create is a Vue CLI 3 only command and you are using Vue CLI 2.9.6.
>   You may want to run the following to upgrade to Vue CLI 3:
> 
>   npm uninstall -g vue-cli
>   npm install -g @vue/cli
> 
> $ get-executionpolicy
>
> Restricted
>
> $ set-executionpolicy remotesigned
>
> $ get-executionpolicy
>
> RemoteSigned
>
> $ vue --version
>
> @vue/cli 5.0.3
>
> $ vue -V
>
> @vue/cli 5.0.3  
>
> $ vue init webpack m2mVueJSDemo
> 
> ? Project name m2m-vuejs-demo
> ? Project description m2mglobal vueJS Demo
> ? Author m2m
> ? Vue build standalone
> ? Install vue-router? Yes
> ? Use ESLint to lint your code? Yes
> ? Pick an ESLint preset Standard
> ? Set up unit tests No
> ? Setup e2e tests with Nightwatch? No
> ? Should we run `npm install` for you after the project has been created? (recommended) npm
> 
>    vue-cli · Generated "m2mVueJSDemo".
> 
> 
> # Installing project dependencies ...
> # ========================
> 
> # Project initialization finished!
> # ========================
> 
> To get started:
> 
>   cd m2mVueJSDemo
>
>   npm run dev
> 

### vueJS 실행시 node-sass 관련 버전 오류발생의 경우

> $ npm install
>
> $ npm run serve
>
> $ npm uninstall node-sass
>
> $ npm i -D sass
>
> $ npm run serve
>

### Docker 에 설치한 MS SQL 백업파일적용방법

$ docker exec -it m2m-mssql "bash"
mssql@3cf7ac76cf3c:/$ /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "m2makstp!"

1> BACKUP DATABASE vuetest TO DISK = N'/var/opt/mssql/data/DB.bak'
2> GO

$ docker cp C:\00_WORK\01_LECTURE\Download\vuetest_20220322.bak 3cf7ac76cf3c:/var/opt/mssql/data

$ BACKUP DATABASE vuetest TO DISK = N'3cf7ac76cf3c:/var/opt/mssql/data'



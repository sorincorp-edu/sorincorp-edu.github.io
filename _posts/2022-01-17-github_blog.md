---
title:  "[github 블로그] - github 블로그 생성 (feat - jekyll, ruby)"
excerpt: "github 블로그 생성을 위한 Rudy, jekyll 설치 및 Theme 설정등"

categories:
  - Blog
tags:
  - [Blog, jekyll, Github]

toc: true
toc_sticky: true
 
date: 2022-01-17
last_modified_at: 2022-01-17
---

## 1. Github 계정생성
 * Github Blog - Github 저장소에서 제공하는 무료 정적 웹 사이트.
   - Github 에서 Github계정 생성. 
   - 신규 Repository를 {Git ID}.github.com 생성.

 * 정상 생성시 https://{ Git ID }.github.io/ URL로 접근가능.

## 2. 로컬환경 Ruby설치
 * Jekyll은 Ruby로 작성되었기에 로컬 개발 환경에 Rubby 설치가 필요
 * Ruby 설치방법
   - 방법1. https://rubyinstaller.org/downloads/ 에서 다운로드 후 설치.
   - 방법2. Chocolatey를 사용.

```powershell
     choco install ruby --params "/InstallDir:C:\GIT\etc\ruby"
     choco install ruby2.devkit  
```

## 3. 로컬환경 Jekyll(지킬)설치
 * Jekyll : Markdown(.md) 등 다양한 포맷의 텍스트들을 읽어 가공히여 블로그등 웹 사이트에 바로 게시할 수 있게 해주는 텍스트 변환 엔진(Ruby사용)

 * Jekyll 설치방법
   - 윈도우 검색창에서 Ruby 검색 후 루비콘솔(Start Command Prompt with Ruby) 실행.
   - 콘솔창에서 gem 명령어를 이용 지킬과 실행에 필요한 패키지들을 설치.

```powershell
        gem install jekyll
        gem install minima
        gem install bundler
        gem install jekyll-feed
        gem install tzinfo-data
```

   - 플러그인 의존성 이슈 발생시 플러그인 재설치 필요.

```powershell
        gem uninstall -aIx ( 설치된 플러그인 전체 삭제 명령어 )
        gem uninstall { 충돌한 플러그인 명 } ( 특정 플러그인 삭제 명령어 )      
```

## 4. Jekyll(지킬) Theme Fork또는 Download
 * Jekyll 테마검색 사이트
   - http://jekyllthemes.org/
   - http://themes.jekyllrc.org/
   - https://jekyllthemes.io/

 * 샘플로 https://github.com/mmistakes/minimal-mistakes 테마사용
 * 테마레포지토리를 Fork 또는 Download

## 5. 로컬환경 Jekyll(지킬) 적용화면 확인
 * zip파일 다운로드 시 이하 방법으로 Jekyll 기동후 로컬화면 테마적용 확인.
   - 1) minimal-mistakes테마 Zip파일을 Repository에서 압축 해제.
   - 2) 지킬을 통한 로컬환경 미리보기 (Gemfile이 있는 위치에서 이하 커멘드 실행)

```powershell
        bundle
        jekyll serve
```

   - 3) http://localhost:4000/ 에 접속하여 화면확인
      포트 변경 시는 jekyll serve –port {원하는 포트 번호} 사용

## 6. 로컬환경 파일 PUSH
 * 이하 불필요한 파일 삭제.
   - .github
   - test
   - .editorconfig
   - .gitattributes
   - .travis.yml
   - CHANGELOG.md
   - docs

 * git 커멘드로 파일 push
 
```powershell
    git add .
    git commit -m "github 블로그 jekyll 초기버전"
    git push -u origin main
```

 * https://{GitID}.github.io 주소에서 블로그 메인화면 확인 가능

## 7. github 블로그 커스터마이징 및 추가설정
 * 이하 설정은 구글링 통해 설정 및 적용
   - _config.yml 수정
   - js 빌드를 위한 설정
   - Node.js 설치
   - SCSS설정
   - Admin 세팅
   - 도메인 연결
   - MakerWidget 및 Disqus 세팅
   - 댓글 관련설정
   - 구글 검색관련설정 (sitemap.xml, robots.txt 등)

## minimal-mistakes 커스터마이징
 * 폰트크기 수정 : _sass/minimal-mistakes/_reset.scss
 * 우측레이아웃 크기수정 :  _sass/minimal-mistakes/_variables.scss 


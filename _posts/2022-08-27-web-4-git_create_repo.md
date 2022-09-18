---
layout: single
title:  "[WEB] - Git 저장소 생성방법"
excerpt: "Git 저장소 생성방법"

categories:
  - web-4
tags:
  - [Gitlab, Github]

toc: false
toc_sticky: false
 
date: 2022-08-27
last_modified_at: 2022-08-27
---
# git 저장소 생성방법

## git은 원격 저장소와 로컬 저장소 두 종류의 저장소를 제공.
- 원격 저장소(Remote Repository): 파일이 원격 저장소 전용 서버에서 관리되며 여러 사람이 함께 공유하기 위한 저장소.
- 로컬 저장소(Local Repository): 내 PC에 파일이 저장되는 개인 전용 저장소.

- 작업은 보통 내 PC의 로컬 저장소에서 진행. 작업이 끝나면 혹은 작업 내용을 공유하고 싶다면 로컬에 있는 작업 내용을 원격 저장소에 업로드. 혹은 원격 저장소에 있는 다른 개발자의 작업 내용 또한 취득가능.

- 협업을 할시에는 원격 저장소에 있는 대표 프로젝트 파일을 모든 개발자가 개인의 로컬에 가져온 뒤 각자 맡은 기능 개발을 진행. 마찬가지로 작업이 끝나면 혹은 작업 내용을 공유할 때 원격 저장소에서 각자의 코드들을 업로드.

## 내 컴퓨터에 로컬 저장소를 만드는 두 가지 방법.
### 1. 첫번째 방법은 저장소를 새로 만들어서 사용.

> git init
>
> Start a new git repository

### 2. 다른 하나는 원격 저장소를 복제하는 방법.
- GitHub(혹은 GitLab, Bitbucket 등)를 이용 원하는 프로젝트를 Fork 및 Clone으로 내 로컬로 가져올 수 있음.

> 원격 저장소를 복제하면 내 컴퓨터에 해당 저장소의 로컬 버전이 생성되어 원래 코드베이스에 영향을 주지 않고 내 컴퓨터에서 개발을 진행가능.

![git local_remote](./../../images/lecture/git_pull.png)

- 원격 저장소를 복제하는 방법은 추가로 개발한 내용을 원격 저장소에 업로드할 수 있고 반대로 원격 저장소 즉, 원본에 내용이 추가 및 삭제로 변경된다면 원본에 해당하는 내용을 가져올 수 있어 효율적으로 개발을 진행할 수 있고 이는 협업에서도 매우 큰 장점으로 작용합니다.

### git push git pull

![git process](./../../images/lecture/git_image.png)

- git clone '저장소url' : 해당 url의 원격저장소를 clone하여 local 환경에 추가.
- git remote add '저장소별칭 저장소url' : 로컬 저장소와 원격 저장소를 연결합니다.
- git remote -v : 원격 저장소와의 연결 상태를 확인합니다. 연결된 저장소들의 별칭과 url을 확인.
- git pull '원격저장소별칭 로컬브랜치' : 원격저장소를 로컬 브랜치로 가져와 병합.
- git push '원격저장소별칭 로컬브랜치' : 지정한 로컬 브랜치를 원격 저장소로 push.

> working directory 혹은 working tree는 말 그대로 개발을 진행하는 폴더라는 개념입니다.

- git의 커밋 작업은 작업 저장소(working directory)에 있는 변경 내용을 저장소에 바로 기록하지 않음.
- staging area 혹은 Index라는 가상의 공간에 기록하고자 하는 변경사항을 git add 명령어를 통해 추가해야만 가능. 이러한 작업을 스테이징-stage라고 표현.
- 가상의 공간에 추가해준 변경 사항들만이 commit을 통해 추가가 가능.

> 반대로 원하지 않는 변경 사항들은 제외하고 commit 가능.

- git status : 저장소의 상태 확인.
- git add <파일> : 해당 파일을 staging area에 추가.
- git add . 을 사용하면 수정한 모든 file 을 추가.
- git commit -m '커밋 메시지' : staging area에서 local repo로 최종적으로 짧은 메시지를 포함해 저장.
- 커밋(commit)을 하게 되면 이전 커밋 상태부터 현재 상태까지의 변경 이력이 기론된 커밋이력이 생성.
- 커밋은 시간순으로 차례대로 저장되기 때문에 과거 변경 이력과 내용을 파악가능.
- 영문과 숫자로 이루어진 40자리의 해당 고유의 이름으로 각 커밋을 구분.

```
git config --global user.name "m2mkwt"
git config --global user.email "wontae_k@m2mglobal.co.kr"

//로컬 깃 저장소 생성(.git 폴더 생성)
$ git init

//Working directory -> Staging Area
$ git add [directory]
$ git add .

//Staging Area -> repository(.git)
$ git commit -m "commit message"

//원격저장소와 연결
$ git remote add origin [원격저장소 주소]
$ git remote add origin https://github.com/m2mkwt/spring-mvc-demo.git

//브랜치 명 바꾸기
$ git branch -M [branch name(main)]
$ git branch -m [현재 branch name] [바꾸고싶은 branch name]

//(선택) README.md가 있다면 : push 보다 pull 먼저
$ git pull origin [branch name(main)]

//로컬 레포지토리 -> 원격 레포지토리
$ git push -u origin [branch name(main)]

//파일 수정 및 추가 이후 : 다음번 commit & push
$ git pull origin [branch name] (선택:다른 장소에서 작업한게 없으면 안해도 됨)
$ git add [directory]
$ git commit -m "commit message"
$ git push -u origin [branch name]
```
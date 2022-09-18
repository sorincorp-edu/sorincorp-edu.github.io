---
layout: single
title:  "[GIT] - GIT 교육자료 1"
excerpt: "GIT 저장소생성 및 동작개념 설명"

categories:
  - web-4
tags:
  - [GIT]

toc: false
toc_sticky: false
 
date: 2022-09-18
last_modified_at: 2022-09-18
---
# Git 저장소 생성

## 1. 실습용 git 폴더 만들기
- git bash 실행
- GitRepoLec01 라는 이름의 폴더 생성, C:\GitRepoLec01 경로에 생성
- 해당 폴더 이동 후 ls -alt

## 2. git init : 저장소 생성하기
```
  git init
```
- 빈 git 저장소가 초기화되었다는 문구가 출력(Initialized empty Git repository) 
- ls -alt 커맨드로 어떤 파일이 만들어졌는지 확인

## 3. git config : 사용자 설정하기
```
  git config user.name "kwt"

  git config user.email "kwt@gmail.com"

  git config --global core.autocrlf true

  git config --list

  git config --get [설정항목] : 일부 설정항목만 출력(ex : git config --get user.name)

  git help [커맨드 이름] : 도움말
```

# git 동작개념

### 1. git의 세가지 작업영역

파일 변경이력을 관리하기 위해 git의 저장소는 다음 세가지의 작업영역을 가지고 있다.

![git의 세가지 작업영역](./../../images/sr_web/git_01.02.01.jpg)

- Working directory : 이력관리 대상(tracked) 파일들이 위치하는 영역
  - 지정된 디엑토리에서 .git 폴더를 제외한 공간
  - 작업된 파일이나 코드가 저장되는 공간

- Staging area : 이력을 기록할, 다시 말해 commit할 대상 파일들이 위치하는 영역
  - .git 폴더 하위에 파일형태로 존재(index)

- Repository : 이력이 기록된(committed) 파일들이 위치하는 영역
  - .git 폴더에 이력관리를 위한 모든 정보가 저장, 관리됨

  > 이력 관리는 두 단계를 거치게 된다. 
  > 먼저 working directory에 파일들을 이력을 기록하기 위해(commit), 대상 파일들을 선정하여 
  > Staging area로 이동시킨다.(git add 명령 사용) 이후 실제적인 git commit 명령을 통해 
  > Stagine area에 있는 파일들만 이력이 기록, 저장된다.

### 2. git이 관리하는 3가지 파일상태

![git파일상태](./../../images/sr_web/git_01.02.04.jpg)

git은 파일의 상태를 다음의 3가지로 구분하여 관리한다.

- Modified : 관리대상 파일이 수정되고 commit이 되지 않은 상태
- Staged : 수정된 파일이 Staging area에 있는 상태
- Committed : 파일 변경사항 기록이 완료된 상태

> 새로운 파일이 Working directory에 추가되면 그 파일은 기존 이력관리(추적, tracking) 대상에 
> 없던 것이기 때문에 Untracked 상태가 된다. 
> 이 파일을 git add 명령으로 Staging area로 이동시키면 Staged 상태가 된다. 
> Staged 상태인 파일을 대상으로 git commit 명령을 사용하면, 비로소 파일은 이력이 기록되는 
> Committed 상태가 된다. 
> 이 파일은 관리 대상에 추가되었으므로 Tracked, 그리고 Unmodified 상태가 된다. 
> 만약 이 파일이 수정되면 Modifed 상태가 되고, 변경사항을 기록하려면 앞에서와 같이 
> Staged, Committed 상태를 거치게 된다.

### 참고 : Staging area가 필요한 이유?
git에는 이력의 기록, 즉 commit을 위해 staging 과정을 거치게 된다.

- 일부 파일만 commit
수정된 전체 파일들중 일부만 선별적으로 commit해야하는 상황이 발생. 이 때 원하는 파일만 선별하기위에 Staging area가 필요.

- 충돌을 수정할 때
둘 이상의 commit 이력을 병합(merge)하는 상황이 발생할 수 있고 두 파일간 자동병합을 할 수 없는 충돌상태가 발생 가능. 충돌이 발생한 파일이 한개이면 문제가 없지만 수없이 많은 파일에서 충돌이 발생한다면 파일별 충돌을 해결할 때마다 중간에 commit을 해두는 것이 안정적.

- commit을 수정할 때
과거에 기록한 commit 이력을 수정하고자 할 때 파일의 상태를 Staged 상태로 내리고 추가적으로 변경할 사항만 반영하고 commit을 하면 효율적.

### Git의 관리에서 특정 파일/폴더를 배제해야 할 경우
- 포함할 필요가 없을 때
  자동으로 생성 또는 다운로드되는 파일들 (빌드 결과물, 라이브러리)

- 포함하지 말아야 할 때
  보안상 민감한 정보를 담은 파일

- .gitignore 파일을 사용해서 배제할 요소들을 지정.

- .gitignore 형식
  https://git-scm.com/docs/gitignore 참조


>  # 이렇게 #를 사용해서 주석
>
>  # 모든 file.c
>  file.c
>
>  # 최상위 폴더의 file.c
>  /file.c
>
>  # 모든 .c 확장자 파일
>  *.c
>
>  # .c 확장자지만 무시하지 않을 파일
>  !not_ignore_this.c
>
>  # logs란 이름의 파일 또는 폴더와 그 내용들
>  logs
>
>  # logs란 이름의 폴더와 그 내용들
>  logs/
>
>  # logs 폴더 바로 안의 debug.log와 .c 파일들
>  logs/debug.log
>  logs/*.c
>
>  # logs 폴더 바로 안, 또는 그 안의 다른 폴더(들) 안의 debug.log
>  logs/**/debug.log

### 사용 커멘드
- git status : git이 인식하고 있는 상태정보 출력
- git add [파일명 또는 디렉토리명] : 수정사항이 있는 특정파일 또는 디렉토리 내 파일 전체를 Staging area로 올리기
- git add . : Working directory 내에 수정사항이 있는 모든 파일들을 Staging area에 올리기
- git reset [파일명] : Staging area에 올렸던 파일 내리기
- git commit : 이력 저장(commit)
- git commit -m [메시지] : vim을 사용하지 않고 인라인으로 메시지를 추가하여 commit
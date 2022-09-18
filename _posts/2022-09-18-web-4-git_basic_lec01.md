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

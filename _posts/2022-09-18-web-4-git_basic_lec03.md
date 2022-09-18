---
layout: single
title:  "[GIT] - GIT 교육자료 3"
excerpt: "원격저장소 연동 및 기본 명령어"

categories:
  - web-4
tags:
  - [GIT]

toc: false
toc_sticky: false
 
date: 2022-09-18
last_modified_at: 2022-09-18
---
# 원격저장소 연동 및 기본 명령어
- 로컬 저장소와 원격저장소를 연계하여 사용. 
- 원격 저장소와 연동하여 git이 지향하는 분산버전관리 실습.

### 원격저장소 사용이유
- 안전성 : 로컬 저장소가 손상되었을 때 백업 저장소 역할
- 협업 : 원격 저장소를 중심으로 다수의 개발자가 협업 가능

### 원격저장소 형태
- On premise 형태 개별 서버
- 인터넷을 통해서 제공되는 호스팅 서비스.

## 1. 원격 저장소 생성
-  https://github.com/sorincorp-edu/GitRepoLec01.git

## 2. 저장소 연동

### git remote add : 원격 저장소 등록하기
git remote 를 사용 원격 저장소를 관리. 

- git remote add [원격 저장소 이름] [원격 저장소 주소] 
> 원격 저장소 등록.

```
$ git remote add origin https://github.com/sorincorp-edu/GitRepoLec01.git
```

- 원격 저장소 리스트를 확인하기 위해 옵션없이 git remote 사용.

```
$ git remote
origin
```

- -v 옵션을 사용 저장소의 url도 함께 표시.

```
$ git remote -v
origin  https://github.com/sguys99/SimpleTest.git (fetch)
origin  https://github.com/sguys99/SimpleTest.git (push)
```
> 등록한 저장소 이름 origin이 출력된다.


> 원격저장소 이름으로 사용된 origin은 main과 마찬가지로 
> git 공식 명칭은 아니지만 원격 저장소의 이름으로 사용되는 이름.

### git push -u : upstream 설정 및 파일 저장

![git remote](./../../images/sr_web/git_remote.jfif)

로컬 저장소의 파일을 원격 저장소로 밀어 넣는(push) git push 명령에 옵션(-u, --set-upstream-to) 명령을 사용하여 upstream 설정과 파일을 원격 저장소로 밀어 넣는 동작을 진행.

- git push -u [원격저장소의 브랜치 이름] [로컬저장소의 브랜치 이름]

```
$ git push -u origin main
```

- 연결 상태 확인.
  git remote show origin

- github 원격저장소에 접근하여 파일 업로드 확인.
- 로컬 저장소에서 로그 확인.
  git log --oneline

  - 최상단 commit의 참조 부분에 origin/main 추가. 
  - origin/main 는 로컬 저장소의 main 브랜치와 대응되는 브랜치. 
  - 로컬 저장소와 원격 저장소의 상태가 같기 때문에 동일한 지점을 참조

> upstream을 최초로 설정하면 삭제하지 않는 한 계속 유지된다. 
> 따라서 이후에 push를 할 때는 추가 옵션 없이 git push 명령만 입력.

- git remote push url 변경
  git remote set-url --push origin <원격지 저장소 주소>

- git remote push, fetch url 변경
  git remote set-url origin <원격지 저장소 주소>



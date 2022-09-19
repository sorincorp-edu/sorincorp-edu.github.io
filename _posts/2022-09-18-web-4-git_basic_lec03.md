---
layout: single
title:  "[GIT] - GIT 교육자료 3"
excerpt: "원격저장소 연동 및 기본 명령어(tag, revert)"

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
  - git remote show origin

- github 원격저장소에 접근하여 파일 업로드 확인.
- 로컬 저장소에서 로그 확인.
  - git log --oneline

  - 최상단 commit의 참조 부분에 origin/main 추가. 
  - origin/main 는 로컬 저장소의 main 브랜치와 대응되는 브랜치. 
  - 로컬 저장소와 원격 저장소의 상태가 같기 때문에 동일한 지점을 참조

> upstream을 최초로 설정하면 삭제하지 않는 한 계속 유지된다. 
> 따라서 이후에 push를 할 때는 추가 옵션 없이 git push 명령만 입력.

- git remote push url 변경
  - git remote set-url --push origin <원격지 저장소 주소>

- git remote push, fetch url 변경
  - git remote set-url origin <원격지 저장소 주소>

## git tag : 버전정보 기록 및 관리

- git에서는 commit ID외 특정 commit을 참조하기 쉽도록 직관적인 이름을 붙일 수있는 tag 기능을 제공.
- tag에 배포 버전을 기록하여 관리 가능.

### tag의 종류
- Lightweight tag : tag 이름만 기록
- Annotated tag : tag 이름 외에 설명(메시지), 서명, 작성자 정보, 날짜 등의 정보 포함

![git tag](./../../images/sr_web/git_03.03.01.jpg)

> Lightweight tag는 특정 commit을 참조하는 포인터와 같은 기능만 가진다. 반면 Annotated tag는 
> 참조 외에 다양한 내용을 포함하므로 git 내부 데이터베이스에 정보 저장.

> **참고 : 어떤 tag를 써야할까?**
> 임시로 사용하거나 정보를 기록할 필요가 없을 때는 Lightweight tag 를 그 외의 일반적인 경우에는 
> Annotated tag를 사용할 것을 추천한다.

- git tag : 로컬 저장소의 모든 tag를 조회
- git tag [tag명] : 현재 commit에 tag를 생성 (Lightweight tag)
- git tag [tag명] [commit ID] : 해당 commit에 tag를 생성 (Lightweight tag)
- git tag -a [tag명] –m “[tag message]” [commit ID] : 메시지를 추가하여 tag 생성 (Annotated tag)
- git tag -am [tag명] “[tag message]” : 현재 commit에 메시지를 추가하여 tag 생성 (Annotated tag)
- git show [tag명] : 해당 tag가 부착된 commit의 상세정보 확인
- git push --tags : 생성된 전체 tag를 원격 저장소에 push ( = git push origin --tags)
- git push [tag명] : 해당 tag를 원격 저장소에 push ( = git push origin “[tag명]”)
- git tag –d [tag명] : 해당 tag 삭제
- git push –d [tag명] : 원격 저장소의 해당 tag 삭제


## git revert : 원격 저장소까지 업로드된 commit을 취소
git revert란 과거 commit으로 파일 상태를 자동복구하고 새로운 commit을 추가하는 명령. 
(git은 되돌리기 과정도 기록해야할 부분으로 간주한다.)

- git revert [commit hash] : 해당 commit을 되돌리기
- git revert --no-edit [commit hash] : revert commit messege 수정하지 않고 default 사용

![git revert](./../../images/sr_web/git_03.04.08.jpg)

> **참고 : 여러 구간을 한번에 되돌리려면?**
> revert 명령 시 구간을 명시해주면 된다.

- git revert [commit hash1]..[commit hash2] : 해당 구간만큼 commit 되돌리기. commit ID1은 해당되지 않음

> commit hash1은 revert 대상에 포함되지 않음에 유의.
> 명령 실행 후 로그를 확인해보면 revert한 commit 수만 큼 commit이 새로 생성되어 있을 것이다.

> **참고 : git reset을 사용해도 되지 않을까?**
> push까지 완료한 상태에서 commit을 되돌리려면 git revert로 새로운 commit을 생성하여 
> 되돌리는 방식을 사용해야한다. (push를 하지 않았다면 reset을 사용해도 된다.)

![git reset](./../../images/sr_web/git_03.04.09.jpg)

> 로컬 브랜치는 reset으로 이전 commit으로 복귀되어 로컬에서 최신으로 참조하는 commit은 
> 원격에서 참조하는 commit보다 이전의 것. 
> git 내부적으로 commit이 뒤진 것이 최신 상태를 덮어쓰지 못하도록 막아두고 있어 
> 에러 메시지가 출력되면서 push가 진행되지 않음.

![git revert](./../../images/sr_web/git_03.04.10.jpg)

**push까지 완료한 상태에서 commit을 되돌리려면 git revert로 새로운 commit을 생성하여 되돌리는 방식을 사용해야한다. (push를 하지 않았다면 reset을 사용해도 된다.)**


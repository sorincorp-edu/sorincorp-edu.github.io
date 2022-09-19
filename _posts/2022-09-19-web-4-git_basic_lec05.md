---
layout: single
title:  "[GIT] - GIT 교육자료 5"
excerpt: "Branch"

categories:
  - web-4
tags:
  - [GIT]

toc: false
toc_sticky: false
 
date: 2022-09-19
last_modified_at: 2022-09-19
---
# Branch
- 브랜치(Branch) : 저장소(repository) 내의 존재하는 독립적인 작업관리 영역. 
- 저장소 안에서 브랜치는 여러 개가 생성가능하며 각 브랜치는 다른 브랜치의 영향을 받지 않음. 
- 브랜치 별 각각 다른 작업을 동시에 진행 가능. 
- 두 브랜치의 내용을 병합(merge)하여 한 브랜치에 정리 가능.

![git branch](./../../images/lecture/git_05.00.01..jpg)

## git branch, checkout : 브랜치 생성과 전환
### 1. git branch : 브랜치 생성, 관리, 삭제

- git branch [브랜치명]

- test1, test2 브랜치를 생성
  ```
    $ git branch test1
    $ git branch test2
  ```

 - git branch : 생성한 브랜치를 확인
  ```
    $ git branch
    * master
      test1
      test2
  ```

- git branch -m [기존 브랜치명] [변경할 브랜치명] : 브랜치이름 변경
- git branch –d [브랜치명] : 해당 브랜치 삭제

### 2. git checkout : 브랜치 전환
- git checkout [브랜치명] : 해당 브랜치로 전환
- git checkout –b [브랜치명] : 브랜치 생성과 동시에 전환

## merge : 브랜치병합
- git merge [브랜치명] : 현 브랜치에 해당 브랜치의 내용 병합

### merge의 종류
- Fast-foward merge 

  ![Fast-foward merge ](./../../images/lecture/git_05.03.01.jpg)

  master 브랜치에서 dev1이 분기해 나가는 지점(commit), 즉 두 브랜치가 공통으로 가지고 있는 commit을 base라고 한다. 그런데 master와 dev1이 각각 참조하는 commit은 동일 선상에 위치하고 있다. 이 때 두 브랜치는 Fast-foward 상태에 있다고 한다.

 - 3-way merge
 
  ![Fast-foward merge ](./../../images/lecture/git_05.03.04.jpg)

  두 브랜치가 base에서 분리된 commit을 참조할 때 git merge 명령을 실행하면 새로운 commit이 생성된다. 이와 같은 merge를 3-way merge 라고 한다. 3-way로 불리는 이유는 내용을 병합할 때, base와 각 브랜치 2개가 참조하는 commit을 기준으로 병합을 진행하기 때문이다

### merge 옵션
- git merge --ff [브랜치명] : fast-forward 관계에 있으면 commit을 생성하지 않고 현재 브랜치의 참조 값 만 변경(default)
- git merge --no-ff [브랜치명] : fast-forward 관계에 있어도 merged commit 생성
- git merge --squash [브랜치명] : fast-forward 관계에 있어도 merged commit 생성, merging 브랜치 정보 생략

> **참고 : --ff, --no-ff, --squash 중에 무엇을 써야하나?**
> Vincent Driessen이 작성한 블로그 포스트인 A successful Git branching model에 
> 따르면 배포용 버전을 기록할 브랜치(여기서는 master)에서 merge를 할 때 
> --ff 보다는 --no-ff 를 사용할 것을 권장한다. 
> 그렇다면 --no-ff와 --squash 중에 무엇을 쓰는 것이 좋을 까? 구성원간 협의하여 
> 결정하면 된다. merging 이력을 기록하고 싶다면 --no-ff을, 
> 브랜치를 깔끔하게 정리하고 싶다면 --squash를 사용하는 것이 효과적일 것이다.

## git rebase : 브랜치 재배치
- git rebase [브랜치명] : 현재 브랜치가 해당 브랜치(브랜치명)에부터 분기하도록 재배치
- git rebase --continue : 충돌 수정 후 재배치 진행(commit 대신)
- git rebase --abort : rebase 취소

> **참고 : merge, rebase 무엇을 써야하나?**
> 관리자의 선호도에 따라서 달라진다. rebase는 새로운 commit을 만들지 않는다. 
> 따라서 rebase 한 흔적이 남지 않는다. rebase를 사용하면 merge만을 사용할 때 보다 
> commit 이력을 간결하게 정리할 수 있다.
> 기록을 명확하게 남기고자 한다면 merge, 간결하게 정리된 것을 원한다면 rebase를 사용하면 좋다.


## 신규 브랜치 push하기
- git push -u (--set-upstream-to) [원격 저장소 이름] [로컬 브랜치 이름] : 로컬 저장소의 브랜치가 원격 저장소를 추적하도록 설정하고 파일들을 원격 저장소로 push
- git push [원격 저장소 이름] [로컬 브랜치 이름] : 로컬 저장소의 변경사항을 원격 저장소로 업로드
- git push : upstream(-u) 설정 후 인자 생략 가능

```
  git checkout -b newbranch
  git commit -am "commit from new branch"
  git log --oneline --graph
  git push

  원격 저장소에 브랜치가 구성이 되어있지 않다는 메시지가 출력된다. 
  upstream을 설정하고 push를 하기 위해 다음 명령을 입력하라고 설명

  git push --set-upstream origin newbranch
```

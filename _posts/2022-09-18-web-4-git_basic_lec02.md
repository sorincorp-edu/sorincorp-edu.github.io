---
layout: single
title:  "[GIT] - GIT 교육자료 2"
excerpt: "GIT 기본 명령어"

categories:
  - web-4
tags:
  - [GIT]

toc: false
toc_sticky: false
 
date: 2022-09-18
last_modified_at: 2022-09-18
---
# Git 기본명령어

## 1. add, commit
파일 상태를 기록

- git status : 저장소의 상태정보 출력
- git add [파일이름] : 해당 파일을 staging area에 올리기
- git add [디렉토리 명] : 해당 디렉토리 내에 수정된 모든 파일들을 staging area에 올리기
- git add . : working directory 내에 수정된 모든 파일들을 staging area에 올리기
- git commit : 이력 저장(commit)
- git commit -m "[메시지]" : vim을 사용하지 않고 인라인으로 메시지를 추가하여 commit
- git commit -am "[메시지]" : add와 commit을 일괄적으로 진행. 단, 기존에 add로 staging area에 한번 올려서 tracked된 파일에만 사용가능. untracked 파일들에 대해서는 git add [파일명 또는 경로명]을 사용해야 함.

## 2. status, log, show 
파일의 상태, commit의 상세 정보, commit 이력(history) 등을 확인

- git status -s : 파일 상태정보를 간략하게 표시
- git log : 저장소의 commit이력을 출력
- git log --pretty=oneline : 각 commit을 한줄로 출력(--pretty 옵션 사용)
- git log --oneline : 각 commit을 한줄로 출력
- git log --decorate=full : 브랜치나 태그정보를 상세히 출력
- git log --graph : 그래프 형태로 출력
- git show : 가장 최근의 commit 정보 출력
- git show [commit hash] : 해당 commit의 정보 출력
- git show HEAD : HEAD가 참조하는 commit의 정보 출력
- git show HEAD^^^ : HEAD를 기준으로 3단계 이전의 commit정보 출력
- git show HEAD~[n] : HEAD를 기준으로 n단계 이전의 commit정보 출력

## 3. diff
파일의 수정 내용을 비교

- git diff : 최근 commit과 변경사항이 발생한(Unstaged) 파일들의 내용비교
- git diff --staged : 최근 commit과 Staging area의 파일들 간의 변경사항 출력
- git diff [commit hash1] [commit hash2] : 두 commit의 파일들 간의 변경사항 출력

## 4. reset, amend
git add 나 git commit 명령을 취소

![git reset](./../../images/sr_web/git_02.04.01.jpg)

- git reset : Staging area의 파일 전체를 unstaged 상태로 되돌리기
- git reset [파일명] : 해당 파일을 unstaged 상태로 되돌리기

![git commit --amend](./../../images/sr_web/git_02.04.07.jpg)

- git commit --amend : 최근 commit을 수정하기
- git commit --amend -m "[commit 메시지]" : 해당 메시지로 commit 수정하기

## 5. checkout
과거의 파일 상태, 이력으로 복귀(같은 개념으로 branch 이동에 쓰임)

![git checkout](./../../images/sr_web/git_02.05.01.jpg)

- git checkout [commit hash] : 해당 commit으로 파일상태 변경
- git checkout - : HEAD가 이전에 참조했던 commit으로 상태변경
- git checkout master : HEAD가 master를 참조
- git checkout HEAD~n : HEAD를 기준으로 n단계 이전 commit으로 상태변경

## 6. reset

![git reset](./../../images/sr_web/git_02.06.05.jpg)

| Working dir | Staging area | Repository |
| ----------- | ------------ | ---------- |
| hard | 변경 | 변경 | 변경 |
| mixed | 유지 | 변경 | 변경 |
| soft | 유지 | 유지 | 변경 |

- git reset [commit hash] : 해당 commit으로 브랜치의 참조를 변경
- git reset –-hard [commit hash] : working directory, staging area, commit 모두 reset
- git reset –-mixed [commit hash] : working directory 유지, staging area, commit reset , default option
- git reset –-soft [commit hash] : working directory, staging area 유지, commit reset
- git reset HEAD^ : HEAD를 기준으로 직전의 commit으로 reset
- git reset HEAD~[정수] : HEAD를 기준으로 정수 값 단계 전 commit으로 reset

### 참고 : reset으로 commit이 삭제된 것일까?
reset을 하더라도 이후에 작성한 commit이 삭제되는 것은 아니다. 앞에서 HEAD는 브랜치(master)를 가리키고(참조하고) 있는 상태였다. 그리고 브랜치는 항상 최신 commit을 참조한다고 했다. 그런데 reset을 통해 브랜치가 참조하는(최신으로 인식되는) commit이 변경되어서 이후의 이력이 검색되지 않는 것이다.
만약 최신 commit hash를 기억한다면 다음 형태의 명령으로 복귀할 수 있다.

- git reset --hard [최근 commit의 hash]

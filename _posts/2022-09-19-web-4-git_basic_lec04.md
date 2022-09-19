---
layout: single
title:  "[GIT] - GIT 교육자료 4"
excerpt: "github를 이용한 협업"

categories:
  - web-4
tags:
  - [GIT]

toc: false
toc_sticky: false
 
date: 2022-09-19
last_modified_at: 2022-09-19
---
# github로 협업하기

## git clone : 원격저장소의 복제
- git clone [원격 저장소 주소] : 원격 저장소의 내용을 복제.
- .git 폴더도 함께 복사되어 저장소로 인식.
- git remote show origin 을 사용 push, pull 가능 상태 확인

## push, pull : 원격저장소에 반영 및 원격저장소 변경사항을 로컬에 반영
- git pull origin [branch name(main)]
> push 보다 pull 먼저 (원격저장소에 반영 전 원격저장소의 변경사항을 먼저 가져옴)

- git push -u origin [branch name(main)]
> 로컬 레포지토리 -> 원격 레포지토리

**파일 수정 및 추가 이후 : 다음번 commit & push**
- git pull origin [branch name] (선택:다른 장소에서 작업한게 없으면 안해도 됨)
- git add [directory]
- git commit -m "commit message"
- git push -u origin [branch name]

## 원격저장소 충돌해결
- git pull은 원격 저장소에서 정보를 가져오는 기능과(fetch) 이 정보를 로컬 저장소의 파일 내용과 병합하는 기능(merge)를 한번에 수행.(fetch + merge) 
- merging이 자동으로 이루어지지 않고 충돌(confilict)이 발생하는 경우 사용자가 개입하여 수동으로 코드 정리를 하고 commit을 진행.

- git diff origin/main main : 원격 저장소의 main와 로컬 저장소의 main 브랜치의 참조 commit의 차이 비교
- git merge --abort : merging 작업 취소

## fetch, merge : fetch로 작업한 내용 확인 후, merge 여부를 순차적 결정
- git fetch : 원격 저장소의 내용을 로컬 저장소로 가져오기
- git diff origin/main main : 원격 저장소의 main과 로컬 저장소의 main 브랜치의 참조 commit의 차이 비교
- git merge origin/main : 원격 저장소의 main 브랜치의 내용을 현재 로컬 브랜치에 병합

## blame : 코드 라인 별 작성 정보를 확인
- git log : 전체 commit 히스토리를 확인.
- git show : 특정 commit을 상세 내역을 확인.
- git blame : 특정 파일의 작성 내역을 line 단위로 확인.

- git blame [파일경로] : 파일의 작성자 정보 확인
- git blame [commit hash] [파일경로] : 해당 commit의 파일 작성자 정보 확인
- git blame -L [시작 line], [종료 line] [파일경로] : 특정 구간의 작성자 정보만 출력
- git blame -e [파일경로] : 작성자 이름 대신 이메일 정보 표시
- git blame -s [파일경로] : 이름, 날짜 정보를 생략하교 hash만 표시

## git stash : 작업 내용을 별도의 공간에 임시 저장, 추출

![git stash](./../../images/lecture/git_04.06.01.jpg)

- 작업 중 타인의 내용을 pull하기 위해 임시 저장해야 하는 상황에 사용

![git stash](./../../images/lecture/git_04.06.04.jpg)

- git stash : 인덱스 영역에 트래킹 되는 파일을 임시영역에 저장하고, modified부분 Working directiory에서 제거(기본 명칭 WIP로 저장됨)
- git stash –u : 새롭게 추가된 파일(untracked)도 함께 임시영역에 저장
- git stash save [저장명칭] : 저장명칭을 주어 저장
- git stash –m “[메시지]” : 메시지를 기록하여 저장
- git stash list : stash 기록 확인
- git stash apply ; 가장 최근의 작업내용 불러오기
- git stash apply [stash명] : stash명에 해당하는 저장내용 반영
- git stash drop : 가장 최근의 stash 제거
- git stash drop [stash명] : 해당 이름의 stash 제거


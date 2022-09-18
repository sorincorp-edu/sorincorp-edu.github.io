---
layout: single
title:  "[WEB] - GIT 관련 VSCode 플러그인"
excerpt: "git 사용사 유용한 VScode 플러그인 정리"

categories:
  - web-4
tags:
  - [GIT, VScode]

toc: false
toc_sticky: false
 
date: 2022-09-07
last_modified_at: 2022-09-07
---
# VScode Git Extention

## GitLens
레포지토리 내부 파일을 수정할 때 왠만한 내용은 다 오버레이로 보여주게 해주는 익스텐션.
- 코드 작성자를 시각화하고 Git 저장소를 완벽하게 탐색하고 강력한 비교 명령을 지원한다.
- 사실상 VSCode 내에서 GIT 버젼 관리와 코딩을 동시에 수행하는데 가능

## Git Graph
GUI 기반의 Git 도구 사용을 가능하게 함 
- 단순히 그래프만 보기 편한 것뿐만 아니라 번거로운 Git 명령어들도 GUI로 편하게 사용할 수 있다.
- 커밋 히스토리에서 원하는 내역에 우클릭을 하면 Reset, Revert, Cherry Pick 등의 Git 명령어들을 GUI로 쉽게 이용할 수 있다

## Git History
git log 보기, 파일 히스토리, 브랜치와 커밋을 비교 할 수 있는 확장 익스텐션.

- 그래프 및 세부 정보와 함께 git log 를 보고 검색
- 파일의 이전 사본을 볼수있다
- 히스토리 보기 및 검색
  - 하나 또는 모든 브랜치의 히소트로 보기
  - 파일의 히소트로 보기
  - 파일안의 행(line) 히스토리 보기
  - 작성자의 히소트로 보기

- 비교:
  - 브랜치 비교
  - 커밋 비교
  - 커밋간의 파일 비교


## Diff Viewer
diff 파일을 보다 가독성있게 변환해주는 확장팩.

## GitHub Repositories
몇번의 클릭만으로 깃헙에 올라간 프로젝트를 바로 VSCode 로드할수 있는 익스텐션
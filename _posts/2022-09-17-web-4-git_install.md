---
layout: single
title:  "[GIT] - GIT 설치"
excerpt: "GIT 설치 (Windows, Mac)"

categories:
  - web-4
tags:
  - [GIT]

toc: false
toc_sticky: false
 
date: 2022-09-17
last_modified_at: 2022-09-17
---
# Git 설치
## 1. Windows Git 설치
- https://git-scm.com/ 로 이동해서 Git을 다운로드.
- 설치과정에서 Git Bash를 포함
### Git Bash
- Git 사용에 적합한 터미널
- 리눅스/맥(유닉스)에서 사용되는 CLI 명령어들을 윈도우에서 사용 가능 - 타 프로그래밍에도 유용
- 기본 설정된 그대로 설치를 진행.
- 설치 후 Git Bash에서 아래 명령어로 테스트.
```
  git --version
  git config --global core.autocrlf true
```
  - 협업시 윈도우와 맥에서 엔터 방식 차이로 인한 오류를 방지합니다.

## 2. SourceTree 설치
- https://www.sourcetreeapp.com/ 
- Git Bash는 커맨드 창에 명령어를 입력하는 방식, 즉 CLI(Command-Line Interface) 기반으로 초보자가 사용함에 어려움.
- CLI에 익숙하지 않은 사용자가 쉽게 git을 사용할 수 있도록 돕는 Git GUI 프로그램.
- 상용 Git GUI 프로그램 : Github desktop, TortoiseGit, GitKraken 등 (https://git-scm.com/downloads/guis 참조)
- 설치시 BitBucket 계정 관련은 건너뛰기.

## 3. Github 계정생성
- https://github.com/
- Git 호스팅 서비스를 제공하는 웹사이트

## 4. VS Code 설치
- https://code.visualstudio.com/
- Ctrl + `로 터미널 열기
  - 프로그래밍 중 바로 Git 명령어 사용

## 5. VS Code의 기본 터미널을 Git Bash로 설정
- Git 뿐 아니라 다른 프로그래밍 작업에 있어서도 유용
- VS Code에서 Ctrl + Shift + P
- Select Default Profile 검색하여 선택 - Git Bash 선택
- 터미널에서 +로 새 창을 열어서 기본으로 Git Bash가 설정된 것 확인

> Git 등 프로그래밍 관련 소프트웨어들은 VS Code 뿐 아니라 기타 연계할 
> 프로그램들에서도 C 드라이브에 설치된 것으로 간주되므로, C 드라이브에 설치해야 
> 자잘한 어려움을 겪지 않을 수 있습니다.

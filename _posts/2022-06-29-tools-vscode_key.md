---
layout: single
title:  "[TOOLS] - VSCode 단축키"
excerpt: "VSCode 단축키"

categories:
  - Tools
tags:
  - [Tools, eclipse]

toc: false
toc_sticky: false
 
date: 2022-06-29
last_modified_at: 2022-06-29
---
#  VS Code 단축키
## 행 삽입
- Ctrl + Enter - 아래에 행 삽입
- Ctrl + Shift + Enter - 위에 행 삽입

> 커서가 중간에 있더라도 Ctrl+Enter를 사용하면 다음 줄에 행이 삽입된다.
> 텍스트 고치고 다음 줄로 넘어갈 때 아주 유용!

## 행 삭제
- Ctrl + X

> 일일이 지울 필요 없이 간편하게 행을 삭제할 수 있다.

## 행 복사
- Alt + Shift + 방향키(up/down)

> 복사를 원하는 행을 기준으로 위 / 아래로 복사 가능하다.

## 행 위치 바꾸기
- Alt + 방향키(up/down)

>   <div>good night</div>
>   <div>good morning</div>
>
> good morning을 위로 올리고 싶다면 Alt + 방향키(up)

## 들여쓰기 / 내어쓰기
- Tab - 들여쓰기
- Shift + Tab - 내어쓰기


### 들여쓰기(탭) 간격 설정
- ctrl + shift + p 누르고 Indent Using Spaces 또는 Indent Using Tabs 검색.
- 그리고 들여쓰기 간격 숫자 조정


## 동일한 텍스트 선택
- Ctrl + D - 순차적으로 하나씩 선택
- Ctrl + Shift + L - 한꺼번에 모두 선택
>    <div>first</div>
>    <div>second</div>
>    <div>third</div>
> 만약 first를 감싸는 div태그를 h1태그로 바꿔야 한다면 → Ctrl + D
> 
> 모든 div태그를 li로 바꿔야 한다면 → Ctrl + Shift + L
>

## 텍스트 검색
- Ctrl + F - 검색
- Ctrl + H - 검색 & 바꾸기(일치하는 텍스트 바꾸기)
  > 대문자 구별
  > 단어완전일치
  > 정규식
  > 하나씩 바꾸기
  > 모두 바꾸기

## Window 관련
- Ctrl + Pageup / Pagedown : 열어놓은 탭 왔다갔다 하기
- Ctrl + `(백틱) : 터미널 열기/닫기
- Ctrl + B : 왼쪽 탐색기 창 끄기/켜기
- Ctrl + p : 메뉴에서 찾지말고, 파일 검색해서 빠르게 파일 열기

### 코딩하는데 편한 단축키
- Shirft + Alt + F / 전체 선책후 Ctrl + K + F : 자동 정렬
  > 단축키를 누르면 자동 들여쓰기 및 스타일 포맷을 한 번에 맞출 수 있습니다

- Ctrl + G : 해당 라인으로 이동하기
- Ctrl + L : 코드 한 라인 블록으로 묶기
- F12 / Ctrl + 클릭 : 해당 함수 정의문으로 바로 이동
- Ctrl + Shift + R : 코드를 함수나 변수로 감싸주는 기능 (리팩토링)
- Alt + Click : 멀티 커서
- Ctrl + Alt + (↑, ↓) : 길다란 커서
- Shift + Alt + 마우스 드래그 : 자유 영역 지정
- 드래그 + ( : 문자를 자동으로 괄호로 묶어준다.
- Alt + Shift + a : 블록 주석 묶기
> 주석으로 묶을 코드 부분을 드래그하고 단축키를 누르면 주석 처리 된다.

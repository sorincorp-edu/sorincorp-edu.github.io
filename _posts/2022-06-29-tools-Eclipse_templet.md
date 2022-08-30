---
layout: single
title:  "[TOOLS] - Eclipse 단축키, 템플릿 사용법"
excerpt: "Eclipse 단축키, 템플릿 사용법 설명"

categories:
  - tools
tags:
  - [tools, eclipse]

toc: false
toc_sticky: false
 
date: 2022-06-29
last_modified_at: 2022-06-29
---
#  이클립스 자주 사용하는 단축키 
## 주석
- Ctrl + Shift + / : 블록을 주석으로 처리 (/* */)
- Ctrl + Shift + \ : 블록 주석을 해제
- Ctrl + / : 한줄 or 블록 주석 처리 / 해제 (//)

## 검색
- Ctrl + F : 키워드 검색 (해당 소스에서만)
- Ctrl + H : 키워드 검색 (프로젝트 전체에서)
- Ctrl + Shift + R : 전체 리소스에서 파일 찾기
- Ctrl + Shift + T : Jar 포함 클래스 찾기
- Ctrl + Alt + H : 특정 클래스 호출 위치 찾기
- Ctrl + K : 찾을 문자열을 블럭으로 지정하고 검색
- Ctrl + Shift + K : 밑에서 문자열 검색

## 위치 이동
- Ctrl + 특정 클래스 마우스 왼쪽 클릭(F3) : 특정 클래스로 이동
- Ctrl + O : 소스의 메소드 리스트 확인
- Ctrl + L : 지정한 소스 줄로 이동
- Alt + 방향키(←) : 이전 작업 위치로 이동
- Alt + 방향키(→) : 다음 작업 위치로 이동
- F4 : 클래스명을 선택하고 F4를 누르면 해당 클래스의 상속 계층 확인

## 소스 편집
- Ctrl + Z : 소스 수정 취소
- Ctrl + Y : 소스 수정 취소의 취소
- Ctrl + S : 소스코드 저장 (현재 파일만)
- Ctrl + Shift + S : 모든 소스코드 저장
- Ctrl + Shift +X : 대문자로 변환
- Ctrl + Shift + Y : 소문자로 변환
- Ctrl + Space : 입력 중에 완성 기능 호출 
- Ctrl + D : 한 줄 삭제
- Ctrl + Shift + F : 소스 정렬
- Ctrl + I : 들여쓰기 자동 수정
- Ctrl + Shift + Space : 메소드 파라미터 목록
- Ctrl + Shift + O : 자동 import, 안쓰는 import 삭제
- Ctrl + Alt + Up(Down) : 한 줄(블럭) 복사
- Ctrl + , 또는 Ctrl + . : 다음 annotation(에러, 워닝, 북마크) 점프
- Ctrl + T : 상속 계층 팝업 창
- Ctrl + F6 : 창 전환
- Alt + 방향키(↑,↓) :  위(아래) 줄과 바꾸기
- Alt + Shift + R : 같은 변수명 네이밍 전체 변경
- F3 : 선언된 변수나  메소드 정의로 이동
- F2 : 컴파일 에러 줄에 커서를 놓고 이 키를 누르면 에러 힌트 제공

## 실행
- F11 : 소스 실행 (에러가 났을 때 디버깅 함)
- Ctrl + F11 : 소스 실행 (에러가 났을 때 디버깅 하지않음)

## 블록 설정
- Shift + End : 현재 커서부터 끝까지 블록 설정
- Shift + Home : 현재 커서부터 처음까지 블록 설정
- Ctrl + A : 전체 블록 설정
- Alt + Shift + 방향키(←,↑,→,↓) : 이미 선택되어 있는 블록을 방향키로 늘림
- Alt + Shift + Z : 구문 블록을 감싸는 메뉴 제공

## 템플릿 사용
- sysout 입력 후 Ctrl + Space :  System.out.println(); 자동 입력됨
- try 입력 후 Ctrl + Space : try-catch 문이 자동 완성
- for 입력 후 Ctrl + Space : for 문 자동 완성
- switch 입력 후 Ctrl + Space : switch 문 자동완성

**Windows > Preferences > JAVA > Editor > Templates에 추가 가능**

![Eclipse 템플릿1](./../../images/sr_web/eclipseTemplet01.png)

같은 방식으로 java이외의 다른언어도 Code template를 설정할 수 있다

![Eclipse 템플릿2](./../../images/sr_web/eclipseTemplet02.png)

New 버튼을 클릭하여 나만의 Code template를 추가해보자

![Eclipse 템플릿3](./../../images/sr_web/eclipseTemplet03.png)
- Name : 사용하고자 하는 줄임코드
- Description : 어떠한 내용인지 알아보기 위한 내용 설명
- Context : 사용언어
- Automatically Insert : 자동입력 사용여부
- Pattern : 자동으로 입력하고자 하는 코드의 전체내용

## 기타
- Ctrl + 마우스커서(혹은 F3) : 클래스나 메소드 혹은 멤버 상세 검색
- Ctrl + N : 새 파일/프로젝트 생성
- Ctrl + 1 : 빠른 교정 구문에 맞게 소스 교정 지원
- Ctrl + 0 : 클래스 구조 트리
- Ctrl + Shift + Space : 메소드 괄호에 커서를 놓고 이 키를 누르면 파라미터 힌트 보여줌
- Ctrl + W : 파일 닫기
- Ctrl + Shift + F4 : 열린 파일을 모두 닫음
- Ctrl + M : 전체 화면 전환
- Ctrl + PageUp , Ctrl + PageDown : Edit 창 이동
- Ctrl + Shift + Down : 클래스 내에서 다음 멤버로 이동
- Ctrl + Shift + M : 해당 객체에 커서롤 놓고 키를 누르면 Import 구문 자동 생성
- Ctrl + Shift + G : 해당 메서드/필드 쓰이는 곳 표시
- Ctrl + Alt + 방향키(↓) : 한 줄 복사 후 그 아래에 붙여넣음
- Ctrl + Shift + B : 커서 줄에 중단점 설정
- Alt + Shift + R : 이름 변경 (소스 내에서 영향받는 참조 정보까지 변경)
- Alt + Shift + S :  소스 메뉴 출력(Import 추가 , Comment 추가 , Generator 메뉴)
- Alt + Shift + J :  해당 메서드/클래스에 대한 주석 템플릿 생성
- F1 : 도움말(Help)
- F2 : 파일 이름 변경
- F11 : 디버깅 시작
- F8 : 디버깅 계속
- F6 : 한 줄씩 디버깅 
- F5 : 한 줄씩 디버깅할 때 함수인 경우 함수 내부까지 디버깅
- F12 : Editor 창으로 이동 
 
## 모든 단축키 정보
- Ctrl + Shift + L : 이클립스 모든 단축키 안내
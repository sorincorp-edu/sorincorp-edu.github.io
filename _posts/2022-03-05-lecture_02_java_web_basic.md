---
layout: single
title:  "[Lecture] - JAVA 및 Servlet, Spring, Spring Boot 정리"
excerpt: "JAVA 및 서블릿, Spring 버젼별 스택정리"

categories:
  - Lecture
tags:
  - [Lecture, Java, Servlet]

toc: true
toc_sticky: true
 
date: 2022-03-05
last_modified_at: 2022-03-05
---

## JDK 간 버전별 차이점
### Java 8 (2014)
- 오라클 인수 후 첫번째 버전
- 2개 버전으로 나뉨(Oracle JDK, OpenJDK)
- Lambda, new Date and Time API(LocalDateTime, …)
- interface default method
- Optional
- PermGen Area 제거

### Java 9 (2017)
- 모듈시스템 등장(jigsaw)

### Java 10 (2018.03)
- var 키워드
- 병렬 처리 가비지 컬렉션 도입으로 인한 성능 향상
- JVM 힙 영역을 시스템 메모리가 아닌 다른 종류의 메모리에도 할당 가능

### Java 11 (2018.09)
- Oracle JDK와 OpenJDK 통합
- Oracle JDK가 구독형 유료 모델로 전환
- 서드파티 JDK 로의 이전 필요
- lambda 지역변수 사용법 변경
   (var x, var y) -> x.process(y) => (x, y) -> x.process(y)

### Java 12 (2019.03)
- switch문 확장

### Java 13 (2019.09)
- switch문 개선을 위한 yield 예약어 추가

### Java 14 (2020.03)
- instanceof 패턴 매칭 (preview)
- record (data object) 선언 기능 추가 (preview)

### Java 15 (2020.09)
- EdDSA 암호화 알고리즘 추가
- 패턴 매칭 (2차 preview, 상단 Java 14 참조)
- 스케일링 가능한 낮은 지연의 가비지 컬렉터 추가(ZGC)
- Solaris 및 SPARC 플랫폼 지원 제거
- 외부 메모리 접근 API (인큐베이팅)
- 레코드 (2차 preview, 상단 Java 14 참조)
- 클래스 봉인 (preview)

## 서블릿 버젼별 사양정리

|:---:|:---:|:---:|:---:|:---:|
|버전|발표일|Java|Tomcat|주요내용|
|:---:|:---:|:---:|:---:|:---|
|6.0|2021/10|JakartaEE 10(8이후)|-|사용되지 않는 기능 삭제 및 요청된 확장 기능 구현|
|4.0|2017/09|8이후|9.0.X|HTTP/2 지원|
|5.0|2020/10|JakartaEE 9(8이후)|10.0.X|API가 패키지 javax.servlet에서 jakarta.servlet로 이동|
|3.1|2013/05|7이후|8.5.X|논블록킹 처리용 I/O API 추가, WebSocket 대응, 클라우드 지원|
|3.0|2009/12|6이후|7.0.X|동적 설정(web.xml 대신 어노테이션 사용), 비동기 Servlet, 멀티파트 파일업로드|
|2.5|2005/09|5이후|6.0.X|자바SE 5	JavaSE 5가 필수, annotation 지원|
|2.4|2003/11|J2EE 1.4|5.5.X|J2SE 1.3	web.xml에 XML 스키마 사용|

## Spring - JDK 간 버전 호환

|:---:|:---:|
|스프링 버전|지원JDK|
|:---:|:---:|
|Spring Framework 6.0.x | JDK 17-21 (expected) |
|Spring Framework 5.3.x | JDK 8 - 19 (expected) |
|Spring Framework 5.2.x | JDK 8 - 15 |
|Spring Framework 5.1.x | JDK 8 - 12 |
|Spring Framework 5.0.x | JDK 8 - 10 |
|Spring Framework 4.3.x | JDK 6 -  8 (its official EOL(end-of-life)) |
 
## Spring Boot - JDK 간 버전 호환

|:---:|:---:|
|스프링부트 버전|지원JDK|
|:---:|:---:|
|Spring Boot 2.3↑ | Java 9 and above|
|Spring Boot 2.1↓ | Java 8 - 11|


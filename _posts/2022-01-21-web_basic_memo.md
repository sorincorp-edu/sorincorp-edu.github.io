---
layout: single
title:  "[WEB.] - Web관련 기타 잡동사니"
excerpt: "서블릿 버젼별 사양"

categories:
  - ETC
tags:
  - [Servlet]

toc: true
toc_sticky: true
 
date: 2022-01-21
last_modified_at: 2022-01-21
---

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

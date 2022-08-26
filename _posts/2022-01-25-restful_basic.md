---
layout: single
title:  "[REST] - RESTful 기본 및 보안정리"
excerpt: "RESTful의 설계시 기본"

categories:
  - Design
tags:
  - [Design, RESTful, HATEOAS]

toc: true
toc_sticky: true
 
date: 2022-01-25
last_modified_at: 2022-01-25
---

# RESTful 기본

## 1. Restful API
 * REpresentational State Transfer 의 약자, 소프트웨어 프로그램 아키텍처의 한 형식
 * 자원을 이름 (자원의 표현) 으로 구분하여 해당 자원의 상태 (정보)를 주고 받는 모든 것을 의미.
 * 월드 와이드 웹 (WWW) 과 같은 분산 하이퍼미디어 시스템을 위한 소프트웨어 개발 아키텍처의 한 형식
 * 웹의 기존 기술과 HTTP 프로토콜을 그대로 활용하기 때문에 웹의 장점을 최대한 활용할 수 있는 아키텍처 스타일.
 * 서버-클라이언트 아키텍쳐에 한하여 동작, HTTP와 같은 상태를 저장하지 않는 통신 프로토콜을 사용하도록 고안된 모델.
 * URI (Uniform Resource Identifier)를 사용하여 접근

## 2. REST의 구체적인 개념
 * HTTP URI를 통해 자원을 명시하고, HTTP Method (POST, GET, PUT, DELETE)를 통해 해당 자원에 대한 CRUD operation을 적용하는 것을 의미.
 * 자원 기반의 구조 (ROA: Resource Oriented Architecture) 설계의 중심에 Resoure가 있고 HTTP Method를 통해 Resource를 처리하도록 설계된 아키텍쳐
 * JSON+HTTP 를 쓰면 REST인가?
   - REST에 대한 잘못된 이해중의 하나가, HTTP + JSON만 쓰면 REST라고 부르는 경우인데, REST 아키텍쳐를 제대로 사용하는 것은, 리소스를 제대로 정의하고 이에대한 CRUD를 HTTP 메서드인 POST/PUT/GET/DELETE에 대해서 맞춰 사용하며, 에러코드에 대해서 HTTP Response code를 사용하는 등, REST에 대한 속성을 제대로 이해하고 디자인해야 제대로된 REST 스타일이라고 볼 수 있다.

## 3. Rest 아키텍처 6원칙
* Uniform Interface(유니폼 인터페이스)
  - URI로 지정한 리소스에 대한 조작을 통일되고 한정적인 인터페이스로 수행하는 아키텍쳐 스타일
  - 특정 언어나 기술에 종속되지 않음

* Stateless (무상태성)
  - 작업을 위한 상태정보를 따로 저장하고 관리하지 않음
  - API 서버에서 어떤 작업을 하기 위해 상태정보(세션/쿠키정보 등)를 기억할 필요가 없고 들어온 요청에 대해 처리만 해주면 되기 때문에 구현이 쉽고 단순

* Cacheable (캐시 가능)
  - HTTP 기존 웹표준 그대로 사용하여 웹에서 사용하는 기존 인프라 그대로 활용 가능, HTTP가 가진 캐싱 기능 적용 가능

* Self-descriptiveness (자체 표현 구조)
  - JSON을 이용한 메시지 포멧을 이용하여 직관적으로 이해할 수 있고 REST API 메시지만으로 그 요청이 어떤 행위를 하는지 파악가능.

* Client-Server 구조
  - REST 서버는 API 제공, 클라이언트는 사용자 인증이나 컨텍스트(세션, 로그인 정보)등을 직접 관리하는 구조
  - REST Server: API를 제공하고 비지니스 로직 처리 및 저장을 책임.
   REST 서버는 다중 계층으로 구성가능. 
   (보안, 로드 밸런싱, 암호화 계층을 추가해) 구조상의 유연성확보
  - Client: 사용자 인증이나 context (세션, 로그인 정보) 등을 직접 관리하고 책임.

* 계층화 (Layered System)
  - 클라이언트와 서버가 분리되어 있기 때문에 중간에 프록시 서버, 암호화 계층 등 중간매체를 사용할 수 있어 높은 자유도
 
## 4. RESTful API 디자인
* 리소스와 행위 를 명시적이고 직관적으로 분리
* 리소스는 URI로 표현, 리소스 명은 명사로 표현.
* 행위는 분명한 목적에 따라 적절한 HTTP Method로 표현할 것
  - GET(조회), POST(생성), PUT(기존 entity 전체 수정), DELETE(삭제), PATCH(기존 entity 일부 수정)
* Message는 Header와 Body를 명확하게 분리해서 사용
  - body : Entity에 대한 내용
  - header : 애플리케이션 서버가 행동할 판단의 근거가 되는 컨트롤 정보
        API 버전 정보, 응답받고자 하는 MIME 타입 등
        header와 body는 http header 와 http body로 나눌 수도 있고, http body에 들어가는 json 구조로 분리할 수도 있다.
* API 버전을 관리

## 5. REST API 중심 규칙
* 1) URI는 정보의 자원을 표현해야 한다. (리소스명은 동사보다는 명사를 사용)

    GET /members/delete/1

    위와 같은 방식은 REST를 제대로 적용하지 않은 URI입니다. URI는 자원을 표현하는데 중점을 두어야 합니다. delete와 같은 행위에 대한 표현이 들어가서는 안됩니다.

* 2) 자원에 대한 행위는 HTTP Method(GET, POST, PUT, DELETE 등)로 표현
    위의 잘못 된 URI를 HTTP Method를 통해 수정해 보면

    DELETE /members/1

    으로 수정가능, 회원정보를 가져올 때는 GET, 회원 추가 시의 행위를 표현하고자 할 때는 POST METHOD를 사용하여 표현합니다.

  - 회원정보를 가져오는 URI
    GET /members/show/1     (x)
    GET /members/1          (o)

  - 회원을 추가할 때
    GET /members/insert/2 (x)  - GET 메서드는 리소스 생성에 맞지 않습니다.
    POST /members/2       (o)

## 6. URI 설계 시 주의할 점
* 1) 슬래시 구분자(/)는 계층 관계를 나타내는 데 사용
    http://restapi.example.com/houses/apartments
    http://restapi.example.com/animals/mammals/whales

* 2) URI 마지막 문자로 슬래시(/)를 포함하지 않는다.
    URI에 포함되는 모든 글자는 리소스의 유일한 식별자로 사용되어야 하며 URI가 다르다는 것은 리소스가 다르다는 것이고, 역으로 리소스가 다르면 URI도 달라져야 합니다. REST API는 분명한 URI를 만들어 통신을 해야 하기 때문에 혼동을 주지 않도록 URI 경로의 마지막에는 슬래시(/)를 사용하지 않습니다.

    http://restapi.example.com/houses/apartments/ (X)
    http://restapi.example.com/houses/apartments  (0)

* 3) 하이픈(-)은 URI 가독성을 높이는데 사용
    URI를 쉽게 읽고 해석하기 위해, 불가피하게 긴 URI경로를 사용하게 된다면 하이픈을 사용해 가독성을 높일 수 있습니다.

* 4) 밑줄(_)은 URI에 사용하지 않는다.
    글꼴에 따라 다르긴 하지만 밑줄은 보기 어렵거나 밑줄 때문에 문자가 가려지기도 합니다. 이런 문제를 피하기 위해 밑줄 대신 하이픈(-)을 사용하는 것이 좋습니다.(가독성)

* 5) URI 경로에는 소문자가 적합하다.
    URI 경로에 대문자 사용은 피하도록 해야 합니다. 대소문자에 따라 다른 리소스로 인식하게 되기 때문입니다. RFC 3986(URI 문법 형식)은 URI 스키마와 호스트를 제외하고는 대소문자를 구별하도록 규정하기 때문이지요.

    RFC 3986 is the URI (Unified Resource Identifier) Syntax document

* 6) 파일 확장자는 URI에 포함시키지 않는다.
    http://restapi.example.com/members/soccer/345/photo.jpg (X)

    REST API에서는 메시지 바디 내용의 포맷을 나타내기 위한 파일 확장자를 URI 안에 포함시키지 않습니다. Accept header를 사용하도록 합시다.

    GET / members/soccer/345/photo HTTP/1.1 Host: restapi.example.com Accept: image/jpg

## 7. 리소스 간의 관계를 표현하는 방법
* REST 리소스 간에는 연관 관계가 있을 수 있고, 이런 경우 다음과 같은 표현방법으로 사용합니다.

    /리소스명/리소스 ID/관계가 있는 다른 리소스명

    ex) GET : /users/{userid}/devices (일반적으로 소유 ‘has’의 관계를 표현할 때)
      만약에 관계명이 복잡하다면 이를 서브 리소스에 명시적으로 표현하는 방법이 있습니다. 예를 들어 사용자가 ‘좋아하는’ 디바이스 목록을 표현해야 할 경우 다음과 같은 형태로 사용될 수 있습니다.

    GET : /users/{userid}/likes/devices (관계명이 애매하거나 구체적 표현이 필요할 때)

## 8. 자원을 표현하는 Colllection과 Document
* DOCUMENT는 한 객체, 컬렉션은 객체들의 집합. 
* 모두 리소스라고 표현할 수 있으며 URI에 표현
  - http:// restapi.example.com/sports/soccer
  - sports라는 컬렉션과 soccer라는 도큐먼트로 표현

  - http:// restapi.example.com/sports/soccer/players/13
  - sports, players 컬렉션과 soccer, 13(13번인 선수)를 의미하는 도큐먼트
  - 컬렉션은 복수로 사용

## 9. HTTP 응답 상태 코드
* 리소스에 대한 응답을 잘 내어주는 것까지 포함, 응답의 상태코드 값을 명확히 반환필요
* 200	클라이언트의 요청을 정상적으로 수행함
* 201	클라이언트가 어떠한 리소스 생성을 요청, 해당 리소스가 성공적으로 생성됨(POST를 통한 리소스 생성 작업 시)
* 301	클라이언트가 요청한 리소스에 대한 URI가 변경 되었을 때 사용하는 응답 코드
(응답 시 Location header에 변경된 URI를 적어 줘야 합니다.)
* 400	클라이언트의 요청이 부적절 할 경우 사용하는 응답 코드
* 401	클라이언트가 인증되지 않은 상태에서 보호된 리소스를 요청했을 때 사용하는 응답 코드
(로그인 하지 않은 유저가 로그인 했을 때, 요청 가능한 리소스를 요청했을 때)
* 403	유저 인증상태와 관계 없이 응답하고 싶지 않은 리소스를 클라이언트가 요청했을 때 사용하는 응답 코드
(403 보다는 400이나 404를 사용할 것을 권고. 403 자체가 리소스가 존재한다는 뜻이기 때문에)
* 405	클라이언트가 요청한 리소스에서는 사용 불가능한 Method를 이용했을 경우 사용하는 응답 코드
* 500	서버에 문제가 있을 경우 사용하는 응답 코드

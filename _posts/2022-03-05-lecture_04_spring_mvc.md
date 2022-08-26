---
layout: single
title:  "[Lecture] - Spring MVC, Dispatcher Servlet"
excerpt: "Spring MVC 기본과 Dispatcher Servlet"

categories:
  - Lecture
tags:
  - [Lecture, Java, Servlet]

toc: true
toc_sticky: true
 
date: 2022-03-05
last_modified_at: 2022-03-05
---
# Spring
## Spring MVC

![Spring MVC 개념1](./../../images/lecture/spring_mvc01.png)

1. 핸들러 조회 : 핸들러 매핑을 통해 요청 URL에 매핑된 핸들러(컨트롤러)를 조회한다.
2. 핸들러 어댑터 조회 : 핸들러를 실행할 수 있는 핸들러 어댑터를 조회한다.
3. 핸들러 어댑터 실행 : 핸들러 어댑터를 실행한다.
4. 핸들러 실행 : 핸들러 어댑터가 실제 핸들러를 실행한다.
5. ModelAndView 반환 : 핸들러 어댑터는 핸들러가 반환하는 정보를 ModelAndView로 변환해서
반환한다.
6. viewResolver 호출 : 뷰 리졸버를 찾고 실행한다.
 - JSP의 경우: InternalResourceViewResolver 가 자동 등록되고, 사용된다.
7. View반환 :뷰 리졸버는 뷰의 논리이름을 물리이름으로 바꾸고, 렌더링 역할을 담당하는 뷰 객체를 반환한다.
 - JSP의 경우 InternalResourceView(JstlView) 를 반환하는데, 내부에 forward() 로직이 있다.
8. 뷰 렌더링 : 뷰를 통해서 뷰를 렌더링한다.

## Dispatcher Servlet

![Dispatcher Servlet 개념1](./../../images/lecture/dispatcher_servlet_01.jpg)

![Dispatcher Servlet 개념2](./../../images/lecture/dispatcher_servlet_02.png)

### Dispatcher Servlet 역할
1. 클라이언트의 요청을 디스패처 서블릿이 받음
2. 요청 정보를 통해 요청을 위임할 핸들러(컨트롤러)를 찾음
3. 요청을 컨트롤러로 위임 처리할 핸들러 어댑터를 찾음
4. 핸들러 어댑터가 핸들러(컨트롤러)로 요청을 위임함
5. 비지니스 로직이 처리됨
6. 컨트롤러가 ResponseEntity를 반환함
7. HandlerAdpater가 반환받은 ResponseEntity를 통해 Response 처리를 진행함
8. 서버의 응답을 클라이언트로 반환함

- 디스패처 서블릿은 어느 컨트롤러가 해당 요청을 처리할 수 있는지를 식별해야 하는데, 디스패처 서블릿은 모든 컨트롤러를 파싱하여 HashMap으로 (요청 정보, 요청을 처리할 대상)을 관리 (요청을 처리할 대상은 요청을 처리할 컨트롤러와 요청에 매핑되는 메소드)

- 요청이 들어오면 요청 정보 객체를 만들어 Map에서 요청을 처리하는 컨트롤러 및 메소드를 찾습니다. 그리고 디스패처 서블릿에서 컨트롤러로 요청을 위임할 Adapter(RequestMappingHandlerAdapter)를 찾은 후에 해당 adapter를 통해 컨트롤러로 요청을 위임합니다. 이때 요청을 처리할 대상 정보에 컨트롤러의 메소드가 있으므로 Reflection으로 컨트롤러의 메소드를 호출

- 컨트롤러가 ResponseEntity를 반환하면 MessageConverter 등을 통해 응답 처리를 진행한 후에 결과를 클라이언트에게 반환

### layer 분리
#### layer를 왜 분리할까? layer를 분리한다는 것에는 어떤 의미가 있는가?
- 다른 layer의 모듈을 부품을 갈아끼우듯 변경할 수 있다. 각 layer가 자신의 세부사항을 몰라도 상관
없도록, 잘 추상화해서 제공하고 있었다면 가능하다.
- 컴포넌트 간의 의존 계층 관계를 깔끔하게 유지할 수 있다.
- 각 layer를 넘나들면서 스파게티처럼 꼬여 있는 관계가 아니라, 위에서 아래로 떨어지는 간단한 구조 혹은 복잡한 참조는 같은 계층 내에서 끝내는 등 상대적으로 깔끔한 구조로 만들 수 있다.
- layer들을 잘 분리하기 위한 개념으로, MVC 같은 디자인 패턴이 존재한다.

#### MVC란?
- Model, View, Controller 세 가지 요소 간의 관계를 이용해 Presentation layer와 Business layer를
분리하는 패턴
- MVC 패턴은, Presentation layer <> 나머지를 어떻게 잘 분리할 것이냐에 대한 패턴
- presentation 분리가 주 목적이므로, Business layer 뒤쪽이 어떻게 구성되는지와는 관련이 없다.
- Business layer가 Service sublayer를 별도로 두던, 어쩌든, MVC와는 별 상관이 없다

#### 보편적으로 많이 사용하는 layer 구분
- Web(Presentation) layer
- Service layer
- Repository layer(Persistence layer)

![Spring Layer 개념](./../../images/lecture/spring_layer01.png)

#### Presentation layer
- UI와 표현과 관련된 코드가 위치한 layer
- view가 jsp 인지, react 인지, app 인지, native GUI인지, CLI 인지는 여기서 결정한다. (다음 layer로 view에 따라 달라지는 specific한 내용을 전달하지 않는다.)
- UI 변경 될 때 같이 변경되어야만 하는 대상은 대체로 presentation layer에 속할 확률이 크다.
- Spring MVC Architecture에서는 View + Controller 로 정의할 수 있다.

> Controller가 Presentation layer라는 이유
> 1. Presentation은 Controller와 View 두 가지로 분리할 수 있다고 말하고 있다.
> 2. 때때로 View에서 수행하지 못하는 Presentation 로직을 처리하기 위해서라도 Controller는 Presentation layer에 있는 것이 맞다고 봄.
> 3. 애초에 MVC 자체가 Presentation code와 나머지 code를 어떻게 분리할것이냐에 대한 패턴이기도 함.
> 4. UI를 Native GUI로 변경하거나, 앱으로 변경한다고 가정했을 때 Controller가 아예 제거되거나, 변경이 발생해야 함.
> 5. 그리고 UI가 jsp라고 생각해보면, 어떤 jsp page에 결과를 전달할 것인지 선택하는 역할도 맡고 있다.

#### Service layer
- Domain Model을 묶어서 이 소프트웨어에서 사용 가능한 핵심 작업 집합을 설정하는 계층
   - 이 소프트웨어가 수행해야 하는 작업은 무엇인가?
   - 이 소프트웨어에 내릴 수 있는 명령은 무엇인가?
- 보통 도메인 모델의 비즈니스 로직 하나를 호출하는 것 만으로는 복잡한 작업을 처리할 수 없음.
- [도메인 모델 여러개를 불러와 요청을 가공하고, 비즈니스 로직을 호출하고, 응답을 조정해서 또 다른 비즈니스 로직을 호출] 이런 작업을 해주는 상위 layer가 있어야 함.
- 여러 비즈니스 로직들을 의미있는 수준으로 묶어 제공하는게 Service layer의 역할
- FE, Gateway 등 다양한 엔드포인트로부터 작업 요청을 받는 상황을 가정해 보면. 각 엔드포인트의 종류와 목적이 다르더라도, 공통적으로 사용하는 작업이 있다면 service layer에서 처리하는 것이 적절할 수 있음. (본질적으로 그 작업이 service에 들어가는게 맞느냐를 먼저 따져야 하지만, 이게 모호한 경우가 있다.)
- 결국 가장 핵심에 가까운 API를 제공하는 계층이 Service layer라고 볼 수 있음.
- Controller가 그래보이겠지만, 이건 UI layer에 가깝다.
   - 요청이 UI를 통해 들어온거라면 Controller를 거치겠지만, 다른 경로로 들어왔다면? 내부 API 호출이라면? Controller를 거치지 않거나 다른 layer를 통해서 Service layer에 접근할 수도 있기 때문에...

### presentation layer에 들어갈 대상과 service layer에 들어갈 대상을 구분하는 기준?
- FE, Gateway 등 다양한 엔드포인트로부터 작업 요청을 받는 상황에서 각 엔드포인트의 종류와 목적이 다르더라도, 공통적으로 사용하는 작업이 있다면 service layer에서 처리하는 것이 적절, 즉 UI에 종속적인 로직인지, 아니면 그 소프트웨어의 핵심 api 로직인지 여부.
- Service 에 cache적용 시 어떻게 나누는게 Performance 향상에 좋을지 고려.
- Commit, rollback은 Service 단위이므로 Transaction 을 어떻게 분리할지 고려


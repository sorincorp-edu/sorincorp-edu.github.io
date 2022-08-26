---
layout: single
title:  "[REST] - Spring HATEOAS을 이용한 RESTful 서비스 작성"
excerpt: "Spring HATEOAS, HAL JSON"

categories:
  - Design
tags:
  - [RESTful, HATEOAS, HAL JSON]

toc: true
toc_sticky: true
 
date: 2022-01-25
last_modified_at: 2022-01-25
---

# HATEOAS, HAL JSON
## 1. REST API의 제약조건 - Uniform Interface
* Uniform Interface은 URL로 지정된 리소스에 대한 조작을 통일하고 한정된 인터페이스로 수행하는 아키텍쳐 스타일.
* Uniform Interface의 4가지 제약 조건
  - Resource-Based
  - Manipluation Of Resources Through Representations
  - Self-Descriptive Message
  - Hypermedia As The Engine of Application State

* URI로 지정한 리소스를 Http Method를 통해서 표현하고 구성(1+2)
  - https://my-server.com/page?user=guest/menu=login
    => REST API :
        HTTP Method : get
        https://my-server.com/user/login

## 2. HATEOAS
* Hypermedia as the engine of application state의 약어 
* 하이퍼미디어의 특징을 이용하여 HTTP Response에 다음 Action이나 관계되는 리소스에 대한 HTTP Link를 함께 리턴.
  - ex1) 페이징 처리의 경우, 리턴시, 전후페이지에 대한 링크를 제공

```json
    {  
        [  
            {  
                "id":"user1",
                "name":"terry"
            },
            {  
                "id":"user2",
                "name":"carry"
            }
        ],
        "links":[  
            {  
                "rel":"pre_page",
                "href":"http://xxx/users?offset=6&limit=5"
            },
            {  
                "rel":"next_page",
                "href":"http://xxx/users?offset=11&limit=5"
            }
        ]
    }
```

  - ex2) 연관된 리소스에 대한 디테일한 링크를 표시.

```json  
    {  
        "id":"terry",
        "links":[  
            {  
                "rel":"friends",
                "href":"http://xxx/users/terry/friends"
            }
        ]
    }
```

* Hypermedia (링크)를 통해서 애플리케이션의 상태 전이가 가능해야 한다.
* Hypermedia (링크)에 자기 자신에 대해한 정보가 담겨야 한다.
  - ex) 게시 글을 조회하는 URI
        GET https://my-server.com/article

  - 해당 글을 조회한 사용자는 다음 행동?
    > 다음 게시물 조회
    > 게시물을 내 피드에 저장
    > 댓글 달기

  - 이런 행동들이 바로 상태전이가 가능한 것들인데, 이 것들을 응답본문에 포함


* Hypermedia 를 이용 변경된 응답메시지

```json
    {
    "data": {
        "id": 1000,
        "name": "게시글 1",
        "content": "HAL JSON을 이용한 예시 JSON",
        "self": "http://localhost:8080/api/article/1000", // 현재 api 주소
        "profile": "http://localhost:8080/docs#query-article", // 해당 api의 문서
        "next": "http://localhost:8080/api/article/1001", // 다음 article을 조회하는 URI
        "comment": "http://localhost:8080/api/article/comment", // article의 댓글 달기
        "save": "http://localhost:8080/api/feed/article/1000", // article을 내 피드로 저장
    },
    }
```

* Uniform Interface 제약 조건을 만족 시키는 REST API
  - API 버전을 명세하지 않아도 됨.
  - 링크 정보를 동적으로 변경가능.
  - 링크를 통해서 상태 전이가 쉽게 가능.
  - 위와 같은 방식으로 데이터를 담아 클라이언트에게 보낸다면 클라이언트는 해당 링크를 참조하는 방식으로, JPA에서 객체 그래프 탐색을 하는 것 처럼 API 그래프 탐색이 가능해짐.
  - 그럼 링크에 대한 정보가 바뀌더라도 클라이언트에선 일일이 대응하지 않아도 됨.

## 3. HAL JSON
* Hypertext Application Language 으로 JSON, XMl 코드 내의 외부 리소스에 대한 링크를 추가하기 위한 특별한 데이터 타입.
### 3.1. 정의
* JSON, XML 코드 내의 외부 리소스에 대한 링크와 같은 하이퍼 미디어를 정의하기 위한 규칙
* 프로젝트 구성 방식에 대한 요구 사항을 부과 할 필요가 없기 때문에 여러 도메인에 쉽게 적용 가능
* HAL을 사용하는 모든 API에 쉽게 통합할 수 있는 범용 라이브러리를 만들 수 있음

### 3.2. 특성
* 리소스와 링크라는 두 가지 개념을 기반으로 요소를 표현
  - 리소스 : URI 링크, 임베디드 리소스, 표준 데이터, 비 URI 링크 등
  - 링크 : 대상 URI, 링크 이름(rel), optional properties 등

* HAL이 갖는 미디어 타입
  - application/hal+json
  - application/hal+xml

### 3.3. 장점
* API 자체에서 API 문서를 쉽게 찾을 수 있음(Self-Descriptive Message) 

### 3.4. HAL 타입의 이용
* 리소스와 링크
  - 리소스 : 일반적인 data 필드에 해당.
  - 링크 : 하이퍼미디어로 보통 _self 필드가 링크 필드.

```json
    {
        "data": { // HAL JSON의 리소스 필드
            "id": 1000,
            "name": "게시글 1",
            "content": "HAL JSON을 이용한 예시 JSON"
        },
        "_links": { // HAL JSON의 링크 필드
            "self": {
            "href": "http://localhost:8080/api/article/1000" // 현재 api 주소
            },
            "profile": {
            "href": "http://localhost:8080/docs#query-article" // 해당 api의 문서
            },
            "next": {
            "href": "http://localhost:8080/api/article/1001" // article 의 다음 api 주소
            },
            "prev": {
            "href": "http://localhost:8080/api/article/999" // article의 이전 api 주소
            }
        }
    }
``` 

## 4. Spring HATEOAS
* HATEOAS 의 원칙에 따라 REST 표현을 쉽게 작성하는 데 사용할 수있는 API 라이브러리.
* 각 응답과 함께 다음 잠재적인 단계에 대한 관련정보(샹태전이)를 반환

### 4-1 준비
* Spring HATEOAS 종속성을 추가

```xml
    <dependency>
        <groupId>org.springframework.hateoas</groupId>
        <artifactId>spring-hateoas</artifactId>
        <version>0.19.0.RELEASE</version>
    </dependency>
```

* Spring HATEOAS를 지원하지 않는 리소스 Customer.java

```java
    public class Customer {

        private String customerId;
        private String customerName;
        private String companyName;

    //standard getters and setters
    }
```

* Spring HATEOAS를 지원하지 않는 컨트롤러 클래스

```java
    @RestController
    @RequestMapping(value = "/customers")
    public class CustomerController {
        @Autowired
        private CustomerService customerService;

        @RequestMapping(value = "/{customerId}", method = RequestMethod.GET)
        public Customer getCustomerById(@PathVariable String customerId) {
            return customerService.getCustomerDetail(customerId);
        }
    }
```

* 고객 리소스의 표현.

```json
    {
        "customerId": "10A",
        "customerName": "Jane",
        "customerCompany": "ABC Company"
    }
```

### 4-2 HATEOAS 지원 추가
* @EnableEntityLinks, @EnableHypermediaSupport 와 같은 애노테이션들을 사용 Spring HATEOAS 적용
* Spring HATEOAS 프로젝트에서는 서블릿 컨텍스트를 조회하거나 path 변수를 기본 URI에 연결할 필요가 없음. 
* Spring HATEOAS는 URI를 작성하기위해 이하 3가지 추상화 제공
  메타데이터를 작성하고 이를 자원 표현과 연관시키는 데 사용
  - ResourceSupport
  - Link
  - ControllerLinkBuilder

#### 4-2-1. 리소스에 하이퍼 미디어 지원 추가
* Resource를 작성할 때 ResourceSupport 상속

```java
    public class Customer extends ResourceSupport {
        private String customerId;
        private String customerName;
        private String companyName;

    //standard getters and setters
    }
```

* Customer 리소스는 ResourceSupport 클래스에서 add() 메서드를 상속하도록 확장
* 한 번 링크를 만들면 새 필드를 추가하지 않고도 해당 값을 리소스 표현으로 쉽게 설정가능.

#### 4-2-2. 링크 만들기
* 메타데이터(자원 위치 또는 URI)를 저장하는 Link 객체를 제공.
* 간단한 링크를 수동으로 작성.

    Link link = new Link("http://localhost:8080/spring-security-rest/api/customers/10A");

  - Link 객체는 자원과의 관련성을 식별하는 rel 과 실제 링크 자체인 href__ 속성으로 구성.
  - Customer 리소스에 새 링크가 포함될 때 예제.

```json
    {
        "customerId": "10A",
        "customerName": "Jane",
        "customerCompany": "ABC Company",
        "__links":{
            "self":{
                "href":"http://localhost:8080/spring-security-rest/api/customers/10A"
            }
        }
    }
```

* 응답과 연관된 URI는 self 링크로 규정. self 의미는 리소스가 액세스 할 수있는 표준 위치.

#### 4-2-3. 더 나은 링크 만들기
* ControllerLinkBuilder 를 이용하여 하드코드된 링크를 피함으로써 URI 구축을 단순화.

  - linkTo(CustomerController.class).slash(customer.getCustomerId()).withSelfRel();

* linkTo() 메쏘드 : 컨트롤러 클래스를 검사하여 해당 클래스를 가져와 루트 매핑.
* slash() 메쏘드 : customerId 값을 경로 변수로 추가.
* withSelfMethod() : 관계를 자체 링크로 한정.


### 4-3 관계추가
* 자기 참조 관계 외 보다 복잡한 시스템에는 다른 관계 포함가능.
* 고객이 주문과 관계를 가질 경우.

* 주문 클래스.

```java
    public class Order extends ResourceSupport {
        private String orderId;
        private double price;
        private int quantity;

    //standard getters and setters
    }
```

#### extends ResourceSupport 의 문제
* @JsonUnwrapped로 해결:
   - beanSerializer이 json으로 만들때 자동으로 객체 변수를 참조하여 만드므로 event로 감싸지는데 wrapping을 unwrapping 하여 꺼내줌

* extends Resource<T>로 해결:
   - 이미 @JsonUnwrapped 가 적용되어 있어 코드량을 줄일 수 있음
   - Content type이 application/hal+json 이면 클라이언트들이 _links 필드에 링크정보 포함 예상가능
   - 링크정보를 바탕으로 링크를 Parsing 가능

* CustomerController 컨트롤러는 특정 고객의 모든 주문을 반환하는 메서드로 확장가능.

```java
    @RequestMapping(value = "/{customerId}/orders", method = RequestMethod.GET ,
                    produces = {"application/hal+json"})
    public Resources<Order> getOrdersForCustomer(@PathVariable final String customerId) {
        List<Order> orders = orderService.getAllOrdersForCustomer(customerId);
        for (final Order order : orders) {
            Link selfLink = linkTo(methodOn(CustomerController.class)
            .getOrderById(customerId, order.getOrderId())).withSelfRel();
            order.add(selfLink);
        }

        Link link = linkTo(methodOn(CustomerController.class).getOrdersForCustomer(customerId)).withSelfRel();
        Resources<Order> result = new Resources<Order>(orders, link);
        return result;
    }
```

* 이 메소드는 HAL 리턴 유형을 준수하기 위한 Resources 오브젝트와 주문별 '__self' 링크 및 전체 목록을 반환.
* 고객 주문의 하이퍼링크가 getOrdersForCustomer() 메서드의 매핑에 의존. 
* 이 유형의 링크를 메소드 링크라고 하며 ControllerLinkBuilder 가 이러한 작성을 지원하는 방법을 표시.

### 4-4. 컨트롤러 방법에 대한 링크
* ControllerLinkBuilder 는 Spring MVC 컨트롤러를 지원.
* CustomerController 클래스의 getOrdersForCustomer() 메서드를 기반으로 HATEOAS 하이퍼링크를 만드는 방법

```java
    Link ordersLink = linkTo(methodOn(CustomerController.class)
        .getOrdersForCustomer(customerId)).withRel("allOrders");
```

* methodOn() 은 프록시 컨트롤러에서 대상 메서드를 더미 호출하여 메서드 매핑을 취득하고 customerId를 URI의 경로 변수로 설정.

### 4-5. Spring HATEOAS in Action

 * 셀프 링크와 메소드 링크의 작성을 getAllCustomers() 메소드에 정리.

```java
    @RequestMapping(method = RequestMethod.GET, produces = { "application/hal+json" })
    public Resources<Customer> getAllCustomers() {
        List<Customer> allCustomers = customerService.allCustomers();

        for (Customer customer : allCustomers) {
            String customerId = customer.getCustomerId();
            Link selfLink = linkTo(CustomerController.class).slash(customerId).withSelfRel();
            customer.add(selfLink);
            if (orderService.getAllOrdersForCustomer(customerId).size() > 0) {
                Link ordersLink = linkTo(methodOn(CustomerController.class)
                .getOrdersForCustomer(customerId)).withRel("allOrders");
                customer.add(ordersLink);
            }
        }

        Link link = linkTo(CustomerController.class).withSelfRel();
        Resources<Customer> result = new Resources<Customer>(allCustomers, link);
        return result;
    }
```

* 결과 확인

   - curl http://localhost:8080/spring-security-rest/api/customers

```json
    {
        "__embedded": {
            "customerList":[{
                "customerId": "10A",
                "customerName": "Jane",
                "companyName": "ABC Company",
                "__links": {
                "self": {
                    "href": "http://localhost:8080/spring-security-rest/api/customers/10A"
                },
                "allOrders": {
                    "href": "http://localhost:8080/spring-security-rest/api/customers/10A/orders"
                }
                }
            },{
                "customerId": "20B",
                "customerName": "Bob",
                "companyName": "XYZ Company",
                "__links": {
                "self": {
                    "href": "http://localhost:8080/spring-security-rest/api/customers/20B"
                },
                "allOrders": {
                    "href": "http://localhost:8080/spring-security-rest/api/customers/20B/orders"
                }
                }
            },{
                "customerId": "30C",
                "customerName": "Tim",
                "companyName": "CKV Company",
                "__links": {
                "self": {
                    "href": "http://localhost:8080/spring-security-rest/api/customers/30C"
                }
                }
            }]  },
        "__links": {
            "self": {
            "href": "http://localhost:8080/spring-security-rest/api/customers"
            }
        }
    }
```

* 각 자원 표현 내에서 고객의 모든 주문을 추출하기 위한 self 링크와 allOrders 링크포함. 
* 고객에게 주문이 없으면 주문 링크가 표시되지 않음.
* 링크가 있으면 클라이언트는 이를 따라 고객에 대한 모든 주문정보 취급가능.

   - curl http://localhost:8080/spring-security-rest/api/customers/10A/orders

```json
    {
        "__embedded": {
            "orderList":[{
                "orderId": "001A",
                "price": 150,
                "quantity": 25,
                "__links": {
                "self": {
                    "href": "http://localhost:8080/spring-security-rest/api/customers/10A/001A"
                }
                }
            },{
                "orderId": "002A",
                "price": 250,
                "quantity": 15,
                "__links": {
                "self": {
                    "href": "http://localhost:8080/spring-security-rest/api/customers/10A/002A"
                }
                }
            }]  },
        "__links": {
            "self": {
            "href": "http://localhost:8080/spring-security-rest/api/customers/10A/orders"
            }
        }
    }
```

### 참고 
#### 셀프링크 자동설정
보통 셀프링크의 경우 EventResource 마다 매번 설정을 해줘야 하므로 EventResource에 추가

```java
    package me.freelife.rest.events;

    import org.springframework.hateoas.Link;
    import org.springframework.hateoas.Resource;
    import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

    /**
    * 스프링 HATEOAS를 사용해 이벤트를 이벤트리소스로 변환하여 리소스를 만들어서 밖으로 내보내줌
    */
    public class EventResource extends Resource<Event> {

        public EventResource(Event event, Link... links) {
            super(event, links);
            // add(new Link("http://localhost:8080/api/events" + event.getId()));
            // 셀프 링크 생성 위와 동일한 링크
            add(linkTo(EventController.class).slash(event.getId()).withSelfRel());
        }
    }
```

#### 스프링 HATEOAS 적용 코드 작성

```java
    @Controller
    @RequestMapping(value = "/api/events", produces = MediaTypes.HAL_JSON_UTF8_VALUE)
    public class EventController {

        ...

        @PostMapping
        public ResponseEntity createEvent(@RequestBody @Valid EventDto eventDto, Errors errors) {
            if(errors.hasErrors())
                return ResponseEntity.badRequest().body(errors);

            eventValidator.validate(eventDto, errors);
            if(errors.hasErrors()) {
                return ResponseEntity.badRequest().body(errors);
            }

            //EventDto에 있는 것을 Event 타입의 인스턴스로 만들어 달라
            Event event = modelMapper.map(eventDto, Event.class);            
            //저장하기 전에 유료인지 무료인지 여부 업데이트
            event.update();
            Event newEvent = this.eventRepository.save(event);
            //EventController의 id에 해당하는 링크를 만들고 링크를 URI로 변환
            //API에 events에 어떤 특정한 ID 그 ID가 생성된 이벤트에 Location Header에 들어감
            ControllerLinkBuilder selfLinkBuilder = linkTo(EventController.class).slash(newEvent.getId());
            URI createdUri = selfLinkBuilder.toUri();
            EventResource eventResource = new EventResource(event); //이벤트를 이벤트리소스로 변환
            eventResource.add(linkTo(EventController.class).withRel("query-events"));
            eventResource.add(selfLinkBuilder.withRel("update-event")); // 셀프 링크와 메서드는 같지만 사용하는 메서드만 다름
            // createdUri 헤더를 가지고 201응답을 만듬
            return ResponseEntity.created(createdUri).body(eventResource);
        }
    }
```

### Spring-HATEOAS 버전에 따른 오류

```java
package com.example.restfulwebservice.user;

import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
public class UserController {

    private UserDaoService service;

    //생성자를 통한 의존성 주입
    public UserController(UserDaoService service) {
        this.service = service;
    }

    @GetMapping("/users")
    public List<User> retrieveAllUsers() {

        return service.findAll();
    }

    // 전체 사용자 목록
    @GetMapping("/users2")
    public ResponseEntity<CollectionModel<EntityModel<User>>> retrieveUserList2() {
        List<EntityModel<User>> result = new ArrayList<>();
        List<User> users = service.findAll();

        for (User user : users) {
            EntityModel entityModel = EntityModel.of(user);
            entityModel.add(linkTo(methodOn(this.getClass()).retrieveAllUsers()).withSelfRel());

            result.add(entityModel);
        }

        return ResponseEntity.ok(CollectionModel.of(result, linkTo(methodOn(this.getClass()).retrieveAllUsers()).withSelfRel()));
    }

    //우리는 id를 숫자로 해도 서버측에 전달 될 경우에는 -> String으로 된다
    //id로 하면 자동으로 원하는 int에 맞게 찾아준다
    //HETAOS를 적용하면 개발자의 양은 많아지지만
    //내가 개발한 것을 보는 사용자입장에서는 더 많은 정보를 알 수 있다
    // 사용자 상세 정보
    @GetMapping("/users/{id}")
    public ResponseEntity<EntityModel<User>> retrieveUser(@PathVariable int id) {
        User user = service.findOne(id);

        if (user == null) {
            throw new UserNotFoundException("id-" + id);
        }

        EntityModel entityModel = EntityModel.of(user);

        WebMvcLinkBuilder linkTo = linkTo(methodOn(this.getClass()).retrieveAllUsers());
        entityModel.add(linkTo.withRel("all-users"));
        return ResponseEntity.ok(entityModel);

    }

    //post, put 처럼 데이터 맵핑 할려면 파라미터에 request body로 형식을 적어줘야한다
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        User saveUser = service.save(user);

        URI localtion =  ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saveUser.getID())
                .toUri();
        return ResponseEntity.created(localtion).build();

    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable int id) {

        User user = service.deleteById( id);

        if(user == null) {
            throw  new UserNotFoundException(String.format("ID[%s] not found ", id));
        }
    }
}

```

* 오류발생
org.springframework.beans.factory.NoUniqueBeanDefinitionException: No qualifying bean of type 'org.springframework.plugin.core.PluginRegistry<org.springframework.hateoas.client.LinkDiscoverer, org.springframework.http.MediaType>' available: expected single matching bean but found 3: relProviderPluginRegistry,linkDiscovererRegistry,entityLinksPluginRegistry

* 오류수정

```xml
     <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.4.5</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
...
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-hateoas</artifactId>
<!--            <version>2.1.8.RELEASE</version>-->
        <version>2.4.3</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.data</groupId>
        <artifactId>spring-data-rest-hal-browser</artifactId>
        <version>3.3.6.RELEASE</version>
    </dependency>

    <dependency>
        <groupId>io.springfox</groupId>
        <artifactId>springfox-boot-starter</artifactId>
        <version>3.0.0</version>
    </dependency>

    <dependency>
        <groupId>io.springfox</groupId>
        <artifactId>springfox-swagger-ui</artifactId>
        <version>3.0.0</version>
    </dependency>
```

```java
    //    @GetMapping("/users2")
    //    public Resources<Resource<User>> retrieveUserList() {
    //        List<Resource<User>> result = new ArrayList<>();
    //        List<User> users = service.findAll();
    //
    //        for (User user : users) {
    //            Resource<User> resource = new Resource<>(user);
    //            ControllerLinkBuilder linkTo = linkTo(methodOn(this.getClass()).retrieveAllUsers());
    //            resource.add(linkTo.withRel("all-users"));
    //
    //            result.add(resource);
    //        }
    //
    //        return new Resources(result);
    //    }

    // 전체 사용자 목록
    @GetMapping("/users2")
    public ResponseEntity<CollectionModel<EntityModel<User>>> retrieveUserList2() {
        List<EntityModel<User>> result = new ArrayList<>();
        List<User> users = service.findAll();

        for (User user : users) {
            EntityModel entityModel = EntityModel.of(user);
            entityModel.add(linkTo(methodOn(this.getClass()).retrieveAllUsers()).withSelfRel());

            result.add(entityModel);
        }

        return ResponseEntity.ok(CollectionModel.of(result, linkTo(methodOn(this.getClass()).retrieveAllUsers()).withSelfRel()));
    }
```

##### 참고
> https://docs.spring.io/spring-hateoas/docs/current/reference/html/#reference
> https://spring.io/projects/spring-hateoas
---
layout: single
title:  "[JAVA] - RESTful Api 라이브러리 정리 (feat - WebClient, Jersey)"
excerpt: "RESTful API 개발에 사용되는 Library 정리"

categories:
  - Java Lib
tags:
  - [java, library, RESTful]

toc: false
toc_sticky: true
 
date: 2022-01-21
last_modified_at: 2022-01-21
---

# REST API Client 라이브러리
 * REST API Client에 JAVA Library로는 WebClient, HttpURLConnection, HttpClient, OkHttp, Retrofit, RestTemplate가 대표적
 
 * Eclipse Jersey(JAX-RS구현 등을 제공하는 REST 프레임워크) 소개

## 1. WebClient
 * Spring5 에서 추가된 인터페이스

 * Spring5 이전에는 비동기 클라이언트로 AsyncRestTemplate를 사용 Spring5에서 Deprecated

 * **spring5 이후 버전을 사용한다면 AsyncRestTemplate 보다는 WebClient 사용하는 것을 추천.** 
    (아직 spring 5.2(현재기준) 에서도 AsyncRestTemplate 도 존재)

 * 기본적으로 사용방법은 간단. WebClient 인터페이스의 static 메서드인 create()를 사용해서 WebClient 를 생성.

 * 예제 (퍼옴 - 추후 출처 기록할것)

    ```java
      @Test
      void test1() {
          WebClient webClient = WebClient.create("http://localhost:8080");
          Mono<String> hello = webClient.get()
                  .uri("/sample?name={name}", "wonwoo")
                  .retrieve()
                  .bodyToMono(String.class);

          StepVerifier.create(hello)
                  .expectNext("hello wonwoo!")
                  .verifyComplete();
      }

      @Test
      void test2() {
          WebClient webClient = WebClient.create();
          Mono<String> hello = webClient.get()
                  .uri("http://localhost:8080/sample?name={name}", "wonwoo")
                  .retrieve()
                  .bodyToMono(String.class);

          StepVerifier.create(hello)
                  .expectNext("hello wonwoo!")
                  .verifyComplete();
      }

      @Test
      void test1_3() {
          WebClient webClient = WebClient.create();
          Mono<String> hello = webClient.get()
                  .uri("http://localhost:8080/sample?name=wonwoo")
                  .retrieve()
                  .bodyToMono(String.class);

          StepVerifier.create(hello)
                  .expectNext("hello wonwoo!")
                  .verifyComplete();
      }


      @Test
      void test1_3() {
          WebClient webClient = WebClient.create("http://localhost:8080");
          Mono<String> hello = webClient.get()
                  .uri("/sample?name={name}", Map.of("name", "wonwoo"))
                  .retrieve()
                  .bodyToMono(String.class);

          StepVerifier.create(hello)
                  .expectNext("hello wonwoo!")
                  .verifyComplete();
      }

      @Test
      void test1_3() {
          WebClient webClient = WebClient.create("http://localhost:8080");
          Mono<String> hello = webClient.get()
                  .uri("/sample?name={name}", "wonwoo")
                  .retrieve()
                  .bodyToMono(String.class);

          StepVerifier.create(hello)
                  .expectNext("hello wonwoo!")
                  .verifyComplete();
      }

      @Test
      void test1_3() {
          WebClient webClient = WebClient.create("http://localhost:8080");
          Mono<String> hello = webClient.get()
                  .uri(it -> it.path("/sample")
                          .queryParam("name", "wonwoo")
                          .build()
                  ).retrieve()
                  .bodyToMono(String.class);

          StepVerifier.create(hello)
                  .expectNext("hello wonwoo!")
                  .verifyComplete();
      }
    ```

## 2. RestTemplate
 * Spring3부터 지원.

 * **spring 5.0버전에서 WebFlux와 함께 WebClient라는 새로운 HTTP client가 RestTemplate의 대안으로 등장. 동기, 비동기, 스트리밍과 최신 API를 지원가능하게 됨. RestTemplate 클래스는 유지보수 모드에 있으며, 앞으로는 변경 및 버그에 대한 사소한 요청만 허용될 예정.**

 * Boilerplate code를 줄여줌.(Spring의 Template이 제공하는 장점 중 하나)

 * [connection pool 적용](https://stackoverflow.com/questions/31869193/using-spring-rest-template-either-creating-too-many-connections-or-slow/)
   -  **RestTemplate 은 기본적으로 connection pool 을 사용하지 않는다. 따라서 연결할 때 마다, 로컬 포트를 열고 tcp connection 을 맺는다. 이때 문제는 close() 이후에 사용된 소켓은 TIME_WAIT 상태가 되는데, 요청량이 많다면 이런 소켓들을 재사용하지 못하고 소켓이 부족으로 응답이 지연.**
   - 이런 경우 connection pool 을 사용해서 해결할 수 있는데, DBCP마냥 소켓의 갯수를 정해서 재사용하는 것이다. RestTemplate 에서 connection pool 을 적용하려면, 위와 같이 HttpClient 를 만들고 setHttpClient() 를 해야한다.
      * setMaxConnPerRoute : IP,포트 1쌍에 대해 수행 할 연결 수를 제한한다.
      * setMaxConnTotal : 최대 오픈되는 커넥션 수를 제한한다.

 * 요청할 URL
   - UriComponentsBuilder 로 파라미터를 붙이거나 String.format 로 붙이거나 등등
   - (/user/{id}, ... , "redboy") 처럼 rest하게 넘길 수도 있다.
   - map 을 이용해서 더 깔끔하게 할 수도 있다.

 * Object 로 받기
    ForObject 를 사용할때, 응답 xml이나 json 에 맞는 java object(Class responseType)가 필요하다. 
    @XmlElement 를 사용하거나 @JsonProperty 등을 사용하여 매핑해줘야한다.

 * 에러 처리
    DefaultResponseErrorHandler를 사용하여 HTTP Error 를 제어한다. restTemplate.setErrorHandler 를 통해 커스텀 핸들러를 등록할 수 있다.

 * 비동기 처리
    RestTemplate 는 동기처리에 사용된다. 비동기 처리는 org.springframework.web.client.AsyncRestTemplate 를 사용. 

 * 예제 및 사용법
   - 출처 : http://spring.io/blog/2009/03/27/rest-in-spring-3-resttemplate
   - 사용법 및 샘플 소스  : http://blog.saltfactory.net/using-resttemplate-in-spring/

   - 기본 생성예제 

    ```java
      RestTemplate restTemplate = getRestTempalte();
      String result = restTemplate.getForObject("http://example.com/hotels/{hotel}/bookings/{booking}", String.class, "42", "21");
    ```
  
   - 설정 생성예제

    ```java
        import org.apache.http.client.HttpClient;
        import org.apache.http.impl.client.HttpClientBuilder;
        import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
        import org.springframework.web.client.RestTemplate;

        public class RestTemplateEx {
            public static void main(String[] args) {
                HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
                factory.setReadTimeout(5000);  // 읽기시간초과, ms
                factory.setConnectTimeout(3000); // 연결시간초과, ms
                HttpClient httpClient = HttpClientBuilder.create()
                    .setMaxConnTotal(100) // connection pool 적용
                    .setMaxConnPerRoute(5) // connection pool 적용
                    .build();
                factory.setHttpClient(httpClient); // 동기실행에 사용될 HttpClient 세팅
                RestTemplate restTemplate = new RestTemplate(factory);
                String url = "http://testapi.com/search?boardNo=1111"; 
                Object obj = restTemplate.getForObject("요청 URI 주소", "응답내용과 자동으로 매핑시킬 java object");
            }
        }
    ```
    
 * HttpRequest는 java.net.HttpURLConenction에서 제공해주는 SimpleClientHttpRequest 사용.

 * 아파치에서 제공하는 jakarta Commons HttpClient의 CommonsClientHttpRequest를 쓰거나 사용자가 정의한 HttpRequest 사용가능, 통신하는 로직에서는 Apache Http Client 3,4와 URLConnection 등을 사용.

 * HTTP 응답에 대한 다양한 MessageConverter를 구현가능.
   - HttpMessageConverters를 interface로 구현하여 다양한 형식의 converter를 제공및 확장 가능. 
   - 따로 inputstream을 받아서 파싱해줄 필요가 없이 더 편하게 매핑가능.
   - text, application/json, xml, recourse등 다양한 converter 지원

    ```java
      RestTemplate restTemplate = new RestTemplate();
      restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());
      Title[] titles = restTemplate.getForObject(url, Title[].class);
    ```

    ```java
      public UserResponse post() {
          URI uri = UriComponentBuilder
                      .fromUriString("http://localhost:9090")
                      .path("/api/server/user/{userId}/name/{userName}")
                      .queryParam("name","aaaa")
                      .queryParam("age",99)
                      .encode()
                      .build()
                      .expand(100)
                      .expand("steve")
                      .toUri();
        //http body -> object -> object mapper -> json -> rest template -> http body json
          UserRequest req = new UserRequest("steve", 10);
          RestTemplate restTemplate = new RestTemplate();
          //uri주소에 req를 보내서 UserResponse 타입을 받는다
          ResponseEntity<UserResponse> result = restTemplate.postForEntity(uri, req, UserResponse.class);
          return result.getBody();
        }

        // postForEntity에도 HttpEntity<>를 이용해서 header 정보를 넣을 수 있다.
        public ResponseEntity<Employee> postForEntity(Employee newEmployee) {
          MultiValueMap<String, String> headers = new HttpHeaders();
          headers.add("User-Agent", "EmployeeRestClient demo class");
          headers.add("Accept-Language", "en-US");
          HttpEntity<Employee> entity = new HttpEntity<>(newEmployee, headers);
          return restTemplate.postForEntity(REQUEST_URI, entity, Employee.class);
        }
    ```    

## 3. HttpClient
  * Apache에서 제공하며 3버전과 4버전이 존재. 4버전부터는 HttpComponents로 불림.
    (단, 3버전과 4버전은 둘간 직접적인 호환은 되지 않음)

  * HttpComponents(4버전) 부터는 Thread에 안정적인 기능들을 많이 제공하나 무겁다는 평.

  * HttpURLConnection 대비 다양한 API를 지원함.

      ```java
        CloseableHttpClient httpclient = HttpClients.createDefault();
        메소드에 따라 new HttpGet("http:// ~~~ ");
        CloseableHttpResponse response = httpclient.execute(httpget);
        HttpEntity entity = response.getEntity();
        Stream으로 entity.getContent() 처리 등 ~~
      ```

  * URLConnection 와 비교하였을 때 장점
    - **모든 응답코드를 반환받을수 있음** => httpResponse.getStatusLine().getStatusCode()
    - 타임아웃 설정 가능
    - 쿠키 제어가 가능

  * 문제점
    - URLConnection 방식보다 코드가 간결하나, 여전히 반복적이고 코드가 길어짐.
    - 스트림 처리 로직이 별도필요. 
    - 응답의 컨텐츠타입에 따라 별도 로직 필요. (RestTemplate 가 이때 유용)

  * 예제 [출처](https://hc.apache.org/httpcomponents-client-ga/httpclient/examples/org/apache/http/examples/client/ClientWithResponseHandler.java)

    ```java
        /** HttpComponent 4.x **/
        CloseableHttpClient httpclient = HttpClients.createDefault();
        try {
            HttpGet httpget = new HttpGet("http://localhost/");
            System.out.println("Executing request " + httpget.getRequestLine());

            // Create a custom response handler
            ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

                public String handleResponse(
                        final HttpResponse response) throws ClientProtocolException, IOException {
                    int status = response.getStatusLine().getStatusCode();
                    if (status >= 200 && status < 300) {
                        HttpEntity entity = response.getEntity();
                        return entity != null ? EntityUtils.toString(entity) : null;
                    } else {
                        throw new ClientProtocolException("Unexpected response status: " + status);
                    }
                }

            };
            String responseBody = httpclient.execute(httpget, responseHandler);
            System.out.println("----------------------------------------");
            System.out.println(responseBody);
        } finally {
            httpclient.close();
        }
    ```


## 4. HttpURLConnection
 * 기본 JDK에 포함되어 있음. (jdk1.2부터 내장, java.net 패키지)

 * 상대적으로 가벼우며 핵심적인 API만 지원하고 있음.

 * HttpClient 보다 성능이 좋다고 함. (HttpClient에서 Server와 Client연결에 속도 이슈가 있어 HttpURLConnection으로 수정한 사례있다고 함) 

 * 서버로부터 전달 받은 Response 결과를 Stream으로 직접 처리해야 하는 등 개발 생산성이 떨어지는 요소가 다소 있음.

 * 문제점
   - 응답코드가 4xx 거나 5xx 면 IOException 이 터진다.
   - 타임아웃을 설정할 수 없다.
   - 쿠키 제어가 불가

## 5. 그 외 라이브러리
 * OKHttp
   - Square의 오픈소스 프로젝트 
   - OKHttp는 통신을 동기화로 할지 비동기로 처리 할지 선택하여 사용할 수 있음.
   - 단 스레드를 넘나들 수 없음. (스레드간에 데이터를 공유하기 위해서는 Handler를 활용해야함)

 * Retrofit
   - Square의 오픈소스 프로젝트
   - 어노테이션을 사용하여 개발할 수 있으므로 개발의 생산성 및 가독성이 올라감.
   - 어노테이션을 사용하여 코드를 생성하기 때문에 인터페이스를 적용하여 주로 개발함.
   - 사용법 및 샘플 소스  :  https://dev-juyoung.github.io/2017/11/10/android-retrofit-basic/ 

 * Volley
   - 사용법이 복잡한 HttpUrlConnection 대안으로 구글이 제공하는 라이브러리로 안드로이드에서 사용.

# Eclipse Jersey
 * Jersey 2.x : JAX-RS API에 대한 지원을 제공하고 JAX-RS(JSR 311 & JSR 339 & JSR 370) 참조 구현의 역할을 하는 Java로 RESTful 웹 서비스를 개발하기 위한 오픈 소스, 프로덕션 품질, 프레임워크

 * Jersey 3.x : Jakarta RESTful Web Services 3.0에 대한 지원을 제공하는 Java로 RESTful 웹 서비스를 개발하기 위한 오픈 소스, 프로덕션 품질, 프레임워크

 * RESTful 서비스 및 클라이언트 개발을 더욱 단순화하기 위해 추가 기능 및 유틸리티로 JAX-RS 툴킷을 확장하는 자체 API 를 제공

 * 개발자가 필요에 따라 커스터마이징 및 확장가능하도록 수많은 확장 SPI 제공

### 참고
 * Spring5 환경에서 비동기등의 기능을 위해 WebClient 사용.
 * Eclipse Jersey 사용시 Dozer Mappter 참고
 * 가볍고 빠른 속도의 성능 우선시 HttpURLConnection 사용.
 * 개발 생산성 및 안정성을 우선시 한다면 Retrofit or RestTemplate(Spring 프로젝트) 사용.

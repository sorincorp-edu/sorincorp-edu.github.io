---
layout: single
title:  "[SWAGGER] - Swagger API developer tool (feat. Spring Boot)"
excerpt: "Swagger API developer tool을 이용한 API lifecycle 관리"

categories:
  - Tools
tags:
  - [Swagger, Spring Boot]

toc: true
toc_sticky: true
 
date: 2022-01-22
last_modified_at: 2022-01-22
---

# Swagger(springfox) 사용하기
## 1. 스웨거(swagger) 이미지
 * [Swagger 샘플](http://springboot-swagger.herokuapp.com/swagger-ui.html)

## 2. Swagger(스웨거) - API developer tool
 * Swagger(스웨거)는 Open Api Specification(OAS)를 위한 프레임워크.
 * API 들이 가지고 있는 스펙(spec)을 명세, 관리
   - 설계와 문서화부터 테스트와 배치까지의 API lifecycle 전체를 관리하게끔 지원
 * SpringBoot에서 Swagger를 사용하면, Controller(컨트롤러)에 명시된 Annotation을 해석하여 API 문서를 자동으로 생성.
 * UI를 통한 직관적인 뷰를 제공하고 Test 기능 지원
   - Swagger 에서 만들어주는 docs 페이지를 통해 Postman 에서 진행했던 테스트가 가능.
 * 이미 존재하는 프로젝트에 대해 API 문서화 작업 자동화 지원

## 3. 기능들
 * API 디자인 : Swagger-Editor를 통해 문서화 지원
 * API Build : SDK를 이용하여 정의된 문서대로 프로토 타입 코드 생성 및 제공
 * API Document : 정의된 문서를 바탕으로 Swagger-UI를 통해 시각화 제공
 * API Test : Swagger-Inspector를 통해 테스트 가능
 * Standardize : 집중화를 통한 API 정보 공유 

## 4. 장단점 (vs 스프레드시트)
 * 장점
   - API 를 테스트할 수 있는 HTML 페이지 제공. (API docs + Postman)
   - 간단한 Annotation 을 통해 문서에 표기할 수 있고, 주석을 겸함.
   - 개발과 동시에 API 문서를 생성. (소스코드 빌드 시 문서 자동 생성)

 * 단점
   - 실제 코드에 영향을 주지는 않지만 지속적으로 Annotation이 추가됨에 따라 실제 코드보다 API 명세에 대한 코드가 더 길어짐. (전체 가독성이 떨어짐)
   - Swagger 코드는 주석일 뿐 실제 로직에 영향을 미치지 않지만, 비즈니스 로직이 변경됨에 따라 API 문서를 갱신하지 않으면 서로 일치하지 않게 됨.
   - 변경 이력 관리가 어려움.
   - 서버가 실행이 안 되어있으면, 문서를 확인할 수 없다.

## 5. 의존성(dependency) 추가
 * Swagger 를 사용하기 위해서는 springfox-swagger2 를 의존성에 추가해야 한다.
 * 문서를 보여주고, 테스트 기능을 위해서 springfox-swagger-ui 의존성을 추가한다.
 * springfox-swagger2 는 Config(설정 파일)와 Controller에 작성된 Annotation의 내용을 읽어 들여 json 또는 yaml 형태로 만들고, springfox-swagger-ui 는 이 json 을 view(html) 형식으로 보여준다.)
 * 최신 버전은 Maven Central 에서 확인할 수 있습니다.

 * Maven - pom.xml
 
```xml
    <dependency>
      <groupId>io.springfox</groupId>
      <artifactId>springfox-swagger2</artifactId>
      <version>2.9.2</version>
    </dependency>

    <dependency>
      <groupId>io.springfox</groupId>
      <artifactId>springfox-swagger-ui</artifactId>
      <version>2.9.2</version>
    </dependency>
```

 * Gradle - build.gradle

```gradle
    compile group: 'io.springfox', name: 'springfox-swagger2', version: '2.9.2'
    compile group: 'io.springfox', name: 'springfox-swagger-ui', version: '2.9.2'
```
 
## 6. Swagger 설정
 * Swagger 설정을 위해 SwaggerConfig 클래스가 필요.
 * Docket Bean 을 지정하면 기본적인 Api Docs 을 만들 수 있다.

```java
    @Configuration
    @EnableSwagger2
    public class SwaggerConfig {

    // 기본 swagger 선언
    @Bean
        public Docket api() {
            return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.any())
                .paths(PathSelectors.any())
                .build();
        }
    }
```

 * @EnableSwagger2 : Swagger2 를 활성화 하는 Annotation.
 * Docket : Swagger 를 설정의 핵심이 되는 Bean. (API 자체에 대한 스펙은 Controller 에서 작성.)
   - select() : ApiSelectorBuilder 를 생성.
   - api() : API 스펙이 작성되어 있는 패키지를 지정. (컨트롤러가 존해자는 패키지를 basepackage 로 지정하여, RequestMapping(GetMapping, PostMapping, ...)이 선언된 API를 문서화.)
   - paths() : apis() 로 선택되어진 API 중 path 조건에 맞는 API 들을 다시 필터링하여 문서화.
   - useDefaultResponseMessages() : false 로 설정하면, swagger 에서 제공해주는 응답코드에 대한 기본 메시지 제거. (컨트롤러에 직접 선언하거나 config 클래스에서 globalResponseMessage 선언하여 사용.)
   - globalResponseMessage() : operation 에 공통된 응답 메시지를 설정.
   - apiInfo() : 제목, 설명 등 문서에 대한 정보들을 보여주기 위해 호출.
   - RequestHandlerSelectors, PathSelectors : RequestHandler 선택을 위한 프로젝트 구성. (둘 다 any() 를 사용하면 swagger 를 통해 전체 API 에 대한 문서를 사용)

 * Docket Bean 에 대한 자세한 설명은 springfox docs 에서 확인할 수 있다.
 * SpringBoot가 아닌 일반 Spring MVC 프로젝트일 경우 아래와 같이 추가 설정이 필요하다.

```java
    public class SwaggerConfig implements WebMvcConfigurer {
        
        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {
            registry.addResourceHandler("swagger-ui.html")
                .addResourceLocations("classpath:/META-INF/resources/");

            registry.addResourceHandler("/webjars/**")
                .addResourceLocations("classpath:/META-INF/resoucres/webjars/");
        }

        ... Docket Bean ...
    }
```

 * Spring Secutiry 우회를 위해 실제사용했던 SwaggerConfig.

```java
    @Configuration
    @Profile("swagger")
    @EnableSwagger2
    public class SwaggerConfig {
        @Bean
        public Docket api() {
            List<SecurityScheme> 	ssList;
            List<SecurityContext>	scList;
            
            ssList	= new ArrayList<>();
            ssList.add(this.getApiKey());
            scList	= new ArrayList<>();
            scList.add(this.securityContext());
            return new Docket(DocumentationType.SWAGGER_2)
                    .select()
                    .apis(RequestHandlerSelectors.any())
                    .paths(PathSelectors.any())
                    .build()
                    .securitySchemes(ssList)
                    .securityContexts(scList);
        }
        
        private ApiKey getApiKey() {
            return new ApiKey("Authorization Bearer Token", "Authorization", "header");
        }
        
        private SecurityContext securityContext() {
            List<SecurityReference>	srList;
            
            srList	= new ArrayList<>();
            srList.add(new SecurityReference("Authorization Bearer Token", new AuthorizationScope[] {new AuthorizationScope("private", "require authtoken api")}));
            
            return SecurityContext.builder()
                    .securityReferences(srList)
                    .forPaths(PathSelectors.regex("^\\/((?!open-).)*$"))
                    .build();
        }
    }    
```

### Annotation (github 또는 docs 에서 확인가능)

  |Annotation|설명|
  |---|---|
  |@Api|클래스를 Swagger 자원으로 표시한다. |
  |@ApiImplicitParam|API 작업에서 단일 매개 변수를 나타낸다. |
  |@ApiImplicitParams|여러 ApiImplicitParam 객체 목록을 허용하는 warpper 이다. |
  |@ApiModel|Swagger 모델(VO)에 대한 추가 정보를 제공한다. |
  |@ApiModelProperty|모델 속성의 데이터를 추가하고 관리한다. |
  |@ApiOperation|특정 경로에 대한 작업 또는 일반적으로 HTTP 메서드를 설명한다. |
  |@ApiParam|작업 매개 변수에 대한 추가 메타 데이터를 추가한다. |
  |@ApiResponse|결과에 대한 응답 값을 설명한다. |
  |@ApiResponses|여러 ApiResponse 객체 목록을 허용하는 wrapper 이다. |
  |@Authorization|리소스 또는 작업에 사용할 권한 부여 체계를 선언한다. |
  |@AuthorizationScope|OAuth2 인증 범위를 설명한다. |
  |@ResponseHeader|응답의 일부로 제공될 수 있는 헤더를 나타낸다. |
 
### Controller
 * 간단한 기본 컨트롤러에 Swagger Annotation 을 추가.

```java
    @RestController
    @Api(value = "SwaggerTestController")
    @RequestMapping("/v1/test")
    public class SwaggerTestController {
        @ApiOperation(value = "test", notes = "테스트입니다.")
        @ApiResponses({
            @ApiResponse(code = 200, message = "OK~!"),
            @ApiResponse(code = 404, message = "page not found!!!")
        })
        @GetMapping(value = "/board")
        public Map<String, String> selectBoard(@ApiParam(value = "게시판번호", required = true, example = "1") @RequestParam String no) {
            Map<String, String> result = new HashMap<>();
            result.put("test title", "테스트");
            result.put("test content", "테스트 내용");
            return result;
        }
    }
```

### 간단한 Swagger 적용예제
 * 1. Maven 의존성 추가
 * 2. Swagger 설정 Bean 추가

```java
    @Configuration
    @EnableSwagger2
    public class SwaggerConfig {
    
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
        .select()
        .apis(RequestHandlerSelectors.any())
        .paths(PathSelectors.any())
        // .paths(PathSelectors.ant("/api/**")) // 그중 /api/** 인 URL들만 필터링
        .build();
    }
    }
```

 * 3. 기동 후 localhost:8080/{context}/swagger-ui.html 호출 

### 실행화면
 * 기본 접속 주소 : http://서버주소/swagger-ui.html (ex: http://localhost:8080/프로젝트이름/swagger-ui.html)

### 참조
- https://www.popit.kr/spring-rest-docs/
- https://springfox.github.io/springfox/javadoc/2.7.0/overview-summary.htm
- https://github.com/swagger-api/swagger-core/wiki/Swagger-2.X---Annotations
---
layout: single
title:  "[Lecture] - Spring Security"
excerpt: "Spring Security"

categories:
  - Lecture
tags:
  - [Lecture, Java, Servlet]

toc: true
toc_sticky: true
 
date: 2022-03-05
last_modified_at: 2022-03-05
---
# Spring Security
## Spring Security(스프링 시큐리티)
- 스프링 기반의 애플리케이션의 보안(인증과 권한,인가 등)을 담당하는 스프링 하위 프레임워크. 
- 서블릿 필터와 이들로 구성된 필터체인으로의 위임모델을 사용하여 처리하며 보안과 관련해서 체계적으로 많은 옵션을 제공해주기 때문에 개발자 입장에서는 일일이 보안관련 로직을 작성하지 않아도 됨

### 보안 용어
- 접근 주체(Principal) : 보호된 리소스에 접근하는 대상
- 인증(Authentication) : 보호된 리소스에 접근한 대상에 대해 이 유저가 누구인지, 애플리케이션의 작업을 수행해도 되는 주체인지 확인하는 과정(ex. Form 기반 Login)
- 인가(Authorize) : 해당 리소스에 대해 접근 가능한 권한을 가지고 있는지 확인하는 과정(After Authentication, 인증 이후)
- 권한 : 어떠한 리소스에 대한 접근 제한, 모든 리소스는 접근 제어 권한이 걸려있다. 즉, 인가 과정에서 해당 리소스에 대한 제한된 최소한의 권한을 가졌는지 확인.

## 인증 아키텍쳐
아래는 Form 로그인에 대한 플로우 이다.

Spring Security Authentication Architecture

![CSRF FORM 개념](./../../images/lecture/spring-security-authentication-architecture.png)

1. 사용자가 Form을 통해 로그인 정보를 입력하고 인증 요청을 보낸다.

2. AuthenticationFilter(사용할 구현체 UsernamePasswordAuthenticationFilter)가 HttpServletRequest에서 사용자가 보낸 아이디와 패스워드를 인터셉트한다. 프론트 단에서 유효성검사를 할 수도 있지만, 안전을 위해서 다시 한번 사용자가 보낸 아이디와 패스워드의 유효성 검사를 한다. HttpServletRequest에서 꺼내온 사용자 아이디와 패스워드를 진짜 인증을 담당할 AuthenticationManager 인터페이스(구현체 - ProviderManager)에게 인증용 객체(UsernamePasswordAuthenticationToken)로 만들어줘서 위임한다.

3. AuthenticationFilter에게 인증용 객체(UsernamePasswordAuthenticationToken)을 전달받는다.

4. 실제 인증을 할 AuthenticationProvider에게 Authentication객체(UsernamePasswordAuthenticationToken)을 다시 전달한다.

5. DB에서 사용자 인증 정보를 가져올 UserDetailsService 객체에게 사용자 아이디를 넘겨주고 DB에서 인증에 사용할 사용자 정보(사용자 아이디, 암호화된 패스워드, 권한 등)를 UserDetails(인증용 객체와 도메인 객체를 분리하지 않기 위해서 실제 사용되는 도메인 객체에 UserDetails를 상속하기도 한다.)라는 객체로 전달 받는다.

6. 
7. AuthenticationProvider는 UserDetails 객체를 전달 받은 이후 실제 사용자의 입력정보와 UserDetails 객체를 가지고 인증을 시도한다.

8. 
9. 
10. 인증이 완료되면 사용자 정보를 가진 Authentication 객체를 SecurityContextHolder에 담은 이후 AuthenticationSuccessHandle를 실행한다.(실패시 AuthenticationFailureHandler를 실행한다.)

### SecurityContextHolder 의 ThreadLocal 전략

- SecurityContextHolder 기본적으로 ThreadLocal 전략을 사용하고 있기 때문에 SecurityContextHolder는 동일 Thread내에서는 현재 인증된 유저에 대한 정보를 유지 가능

- ThreadLocal은 thread-local 변수를 제공하는 클래스, thread-local 변수란 thread 내부에서 사용되는 지역변수를 의미. 메소드에서 사용하는 변수나 데이터는 파라미터 혹은 메소드 scope 내에서 정의하고 사용하게 되는데, Thread Local을 사용하게 되면, 굳이 변수를 파라미터 같은 곳에 넣지 않아도 동일 Thread 내에서 공유 및 사용가능.

- SecurityContextHolder은 ThreadLocal을 통해 파라미터로 Principal을 주입 받지 않더라도, 현재 SecurityContextHolder에 ThreadLocal로 저장된 Principal을 꺼내와 사용할 수 있게 되는 것이다. 

## Spring Security Filter

- 서블릿에는 네트워크 통신의 사이 사이에서 여러 동작을 행하게 할 수 있는 클래스인 Filter가 존재, 이 필터들 중 DelegatingFilterProxy라는 것이 존재하고 서블릿 필터 처리를 스프링에 들어있는 빈으로 위임하고 싶을 때 사용하는 필터이다.

![spring-security-filter](./../../images/lecture/spring-security-filter.png)

- 우리가 Spring Security를 사용하고 싶을 때, 스프링 부트에서는 자동으로 SecurityFilterAutoConfiguration을 등록하여 springSecurityFilterChain이라는 빈에 위임, 이는 실제로 FilterChainProxy에 위임되어 Security Filter 동작을 수행한다.

- FilterChainProxy는 Security 설정 정보로부터 필요한 필터들을 가져와 SecurityFilterChain에 보관한다.

![spring_security_filter_chain](./../../images/lecture/spring_security_filter_chain.png)

### WebAsyncManagerIntegrationFilter
- SecurityContextHolder는 비동기 처리 기능을 사용한다면 다른 쓰레드를 생성하여 작업을 처리하기에 ThreadLocal 방식으로 Authentication을 공유받지 못하게 되는데 Spring MVC의 Async 기능을 사용할 때도 Authentication 객체가 필요하면 사용할 수 있게 위의 필터를 제공한다.

### SecurityContextPersistenceFilter
- 처음 인증 받은 객체가 HTTP 세션에 저장되어있는지 확인한 후 저장이 되어 있다면 SecurityContext를 불러와 사용, 인증 객체가 없다면 처음부터 인증을 시작.

- 인증을 완료한 SecurityContext를 HTTP 세션에 저장하거나 SecurityContext를 HTTP 세션에서 불러오려고 할 때 사용. SecurityContextRepository의 구현체인 HttpSessionSecurityContextRepository를 활용하여 가져온다.

### HeaderWriterFilter
- 응답 헤더에 Security Header를 추가해준다.
   - XContentTypeOptionsHeaderWriter - 마임 타입 스니핑 방어
   - XXSSProtectionHeaderWriter - 브라우저에 내장된 XSS 필터
   - CacheControlHeadersWriter - 캐시 히스토리 취약점 방어
   - HstsHeaderWriter - HTTPS를 활용하도록 조정
   - XFrameOptionsHeaderWriter - Click Jacking 방어

### CsrfFilter
- CSRF Attack을 방어하기 위한 기법을 적용한 필터, 보통 POST방식의 요청의 Form에 CSRF 토큰을 포함시켜 전송할 때, CSRF 토큰을 전달받아서 기존의 토큰과 일치하는지 비교하여 성패 결정.

###### CSRF (Cross-site request forgery)
- 타사이트에서 본인의 사이트로 form 데이터를 사용하여 공격하려고 할 때, 그걸 방지하기 위해 csrf 토큰 값을 사용.

- 타임리프, JSTL등에서 템플릿으로 form 생성시 타임리프, 스프링 MVC, 스프링 시큐리티가 조합이 되어 자동으로 csrf 토큰 기능을 지원.

![CSRF FORM 개념](./../../images/lecture/csrf_ofrm.png)

- 개발자 도구로 확인해보면, 타임리프로 form만 만들어주면, 자동으로 hidden으로 csrf 토큰 값이 생성되어 있음을 볼 수 있다. 이 토큰 값을 보고, 신뢰할 수 있는 form 데이터인지 아닌지 확인해준다.

### LogoutFilter
- 로그아웃을 할 때 사용하는 필터. 
- LogoutHandler를 이용해 로그아웃시 필요한 처리를 진행.
- LogoutSuccessHandler을 이용해 로그아웃 이후 필요한 처리를 진행.

### AuthenticationFilter
- 인증을 처리할 때 사용되는 필터.
- Form Login을 처리할 때 사용되는 필터는 UsernamePasswordAuthenticationFilter.
- OAuth2를 처리할 때 사용되는 필터는 OAuth2LoginAuthenticationFilter.

### DefaultLoginPageGeneratingFilter
- 기본 Form Login Page를 생성, Get 요청의 Login을 처리.
- 기본으로 생성하는 것이 아니라 커스터마이징한 페이지를 로그인 페이지로 사용하는 것 또한 가능.

### DefaultLogoutPageGeneratingFilter
- 기본 Form Logout Page를 생성, Get 요청의 Login을 처리.
- 기본으로 생성하는 것이 아니라 커스터마이징한 페이지를 로그아웃 페이지로 사용하는 것 또한 가능.

### BasicAuthenticationFilter
- HTTP Basic 인증을 처리하는 필터.
- HTTP Basic이란, 요청 헤더에 BASE 64 방식으로 인코딩하여 username과 password를 실어보내 인증하는 방식. 보안이 취약해 HTTPS를 사용하는 것이 좋다.

### RequestCacheAwareFilter
- 현재 요청과 관련된 요청이 캐쉬되어있는지 확인하고 있다면 적용하는 필터.
- 캐시된 것이 있다면 캐시된 것을 활용하여 처리하고 없다면 기본적인 방식을 따라 처리.

### SecurityContextHolderAwareRequestFilter
다음의 API를 구현해준다.
- HttpServletReqeust#authenticate(HttpServletResponse)
- HttpServletReqeust#login(String, String)
- HttpServletReqeust#logout()
- AsyncContext#start(Runnable)
​
### AnonymousAuthenticationFilter
- 인증받지 않은 객체에 대해 null이 아니라 익명의 객체라고 만들어주는 역할.
- 즉, Authentication을 Anonymous 객체로 생성하여 적용한다.

### SessionManagementFilter
- Session 변조 공격 방지 기능.

1. 세션관리 → 인증 시 사용자의 세션정보를 등록, 조회, 삭제 등의 세션 이력을 관리

2. 동시적 세션 제어 → 동일 계정으로 접속이 허용되는 최대 세션수를 제한

##### 동시 세션 제어
- 같은 계정(세션)을 동시에 몇개까지 유지할 수 있게 할 지에 대한 제어를 의미, 기존 접속해있는 계정이 있다고 할 때 새로운 사용자가 동일한 계정으로 접속을 시도했을 때 어떻게 대응할지에 대한 방법으로 기존 사용자를 로그아웃 시키거나 현재 사용자가 접속을 할 수 없게 막거나 하는식. 

- 최대 세션 허용 개수를 초과하였을 경우의 처리 로직 2가지 전략

1. 이전 사용자 세션 만료 전략 → 신규 로그인시 기존 로그인 계정의 세션이 만료되도록 설정하여 기존 사용자가 자원 접근시 세션만료가 된다.

2. 현재 사용자 인증 실패 전략 → 신규 사용자가 로그인 시도시 인증 예외 발생

- 동시 세션 제어 설정하기

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    UserDetailsService userDetailsService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .sessionManagement() //세션 관리 기능이 작동함
                .invalidSessionUrl("/invalid")//세션이 유효하지 않을 때 이동 할 페이지
                .maximumSessions(1)//최대 허용 가능 세션 수, (-1: 무제한)
                .maxSessionsPreventsLogin(true)//동시 로그인 차단함, false: 기존 세션 만료(default)
                .expiredUrl("/expired");//세션이 만료된 경우 이동할 페이지
		}
}
```

3. 세션 고정 보호 → 인증 할 때마다 세션 쿠키를 새로 발급하여 공격자의 쿠키 조작을 방지

##### 세션 고정 보호
- 악의적인 해커의 세션 고정 공격을 막기위한 대응 전략이다.
- 공격자가 서버에 접속을해서 JSSEIONID를 발급받아서 사용자에게 자신이 발급받은 세션쿠키를 심어놓게되면 사용자가 세션쿠키로 로그인 시도했을 경우 공격자는 같은 쿠키값으로 인증되어 있기 때문에 공격자는 사용자 정보를 공유하게 된다. 
- 사용자가 공격자 세션쿠키로 로그인을 시도하더라도 로그인시마다 새로운 세션ID를 발급하여 제공하게 되면, JSSEIONID가 다르기 때문에, 공격자는 같은 쿠키값으로 사용자 정보를 공유받을 수 없다.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    UserDetailsService userDetailsService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http
                .sessionManagement()
                .sessionFixation().changeSessionId();// 기본값 -> 세션은 유지하되 세션아이디는 계속 새로 발급(servlet 3.1이상 기본 값)
                                                     // none, migrateSession, newSession
		}
}
```

- none() : 아무런 전략을 사용하지 않음, 세션이 새로 생성되지 않고 그대로 유지, 세션 고정 공격에 취약.
- migrateSession() : 새로운 세션도 생성되고 세션아이디도 발급된다. (sevlet 3.1 이하 기본 값) + 이전 세션의 속성값들도 유지된다.
- newSession() : 세션이 새롭게 생성되고, 세션아이디도 발급되지만, 이전 세션의 속성값들을 유지할 수 없다.
- changeSessionId - 로그인을 하면 기존 세션의 ID만 변경하여 진행. (디폴트) 유효하지 않은 세션을 리다이렉트 시킬 URL을 설정.

4. 세션 생성 정책 → Always, if_required, Never, Stateless

- 인증처리를 할 때 꼭 스프링 시큐리티에서 세션을 생성할 필요는 없고, 오히려 외부 서비스를 통해 인증 토큰을 발급하는 방식을 사용 할 수도 있다. 예를들어 JWT 토큰을 사용하거나, KeyCloak같은 외부 서비스를 사용할수도 있다. 이런 경우에는 굳이 스프링 시큐리티를 통해 세션을 생성할 필요가 없다. 그래서 이런 세션 생성 정책도 설정을 통해 지정해 줄 수 있다. 
 
- SessionCreationPolicy.Always : 스프링 시큐리티가 항상 세션 생성
- SessionCreationPolicy.IF_REQUIRED : 스프링 시큐리티가 필요 시 생성(default)
- SessionCreationPolicy.Never : 스프링 시큐리티가 생성하지 않지만 이미 존재하면 사용
- SessionCreationPolicy.Stateless: 스프링 시큐리티가 생성하지 않고 존재해도 사용하지 않음.
- JWT 토큰방식을 사용할 때는 Stateless 정책을 사용한다.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    UserDetailsService userDetailsService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http
                .sessionManagement()// 세션 관리 기능이 작동함.
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED);
		}
}
```

- invalidSessionUrl(Url주소) : 최대 세션 수를 설정할 수 있다.
- maximumSessions(세션수) : 동시 로그인을 제어할 수 있다.
- maxSessionsPreventsLogin(Boolean) : True : 이전 세션을 유지, False : 이전 세션 만료

### ConcurrentSessionFilter
- 매 요청 마다 현재 사용자의 세션 만료 여부 체크
- 세션이 만료되었을 경우 즉시 만료 처리
- session.isExired() == true
   - 로그아웃 처리
   - 즉시 오류 페이지 응답(This session has been expired)


##### SessionManagementFilter와 ConcurrentSessionFilter는 서로 연계하여 1-2.동시적 세션 제어 처리

![동시적 세션 제어 처리1](./../../images/lecture/security_01.png)

###### user1과 user2를 예시로 세션 처리 과정.

![동시적 세션 제어 처리2](./../../images/lecture/security_02.png)

- 왼쪽의 상단에서 아래로 user1 -> user2 -> user1  순서대로 로그인 및 Get호출을 할 경우 세션이 처리되는 과정을 간략하게 글로 설명해보면 아래와 같습니다.

- user1 로그인
  > 1. ConcurrentSessionControlAuthenticationStrategy에서 세션 허용 개수 확인
  > 2. ChangeSessionIdAuthenticationStrategy에서 세션 고정 보호 기능 처리
  > 3. RegisterSessionAuthenticationStrategy에서 세션 정보 등록
  > 4. 인증 성공

- user2 로그인
  > ConcurrentSessionControlAuthenticationStrategy에서 세션 허용 개수 확인 -> 허용 개수 초과 발생!
  >
  > 1번 전략 : 인증 실패 전략 -> SessionAuthenticationException 예외 발생 -> 인증 실패
  >
  > 2번 전략 : 이떄 SessionManagementFilter와 ConcurrentSessionFilter가 연계해서 처리
  >
  > 세션 만료 전략 -> session.expireNow()로 기존 사용자 세션 만료 -> 위에 동일 하게 user2의 세션 고정 보호 기능 처리 및 세션 정보 등록 -> 인증 성공
  >
  > user1 Get호출 (세션 만료 전략으로 인해 user1 사용자의 세션은 만료 상태) 
  > session. isExpired() == true -> 세션 만료 -> 로그인 실패 (This session has been expired)

### ExceptionTranslationFilter
- 인증과 인가 과정의 에러 처리를 담당.
- AutehnticationException은 인증 처리가 안된 사용자가 인증이 필요한 URL에 접근하면 발생하는 Exception, AutehnticationEntryPoint로 이동하여 에러를 처리하고 보통 /login으로 보내 로그인을 처리.

###### AuthenticationEntryPoint vs AuthenticationFailureHandler
- AuthenticationEntryPoint는 인증이 안된 사용자가 인증이 필요한 URL에 접근해야할 때 발생하는 예외를 처리한다.
- AuthenticationFailureHandler는 로그인에 실패할 시 발생하는 예외를 처리한다.
- AccessDeniedException은 인가 처리가 안된 사용자가 어떤 권한이 필요한 URL에 접근하면 발생하는 Exception이다.
- 기본적으로 에러 페이지를 띄우고 AcecessDeniedHandler를 오버라이드하여 커스터마이징할 수 있다.

### FilterSecurityInterceptor
- AccessDecisionManager를 사용하여 인가를 처리, authorizeRequests()에 대한 세팅값이다.

### RememberMeAuthenticationFilter
- 로그아웃을 하거나 브라우저를 끄면 세션이 만료되어 추후에 다시 로그인하여 인증 요청을 해야한다.
- Remember을 사용하여 구현하게 되면 세션이 만료되어도 쿠키 또는 DB를 사용하여 저장된 토큰 기반으로 인증을 진행할 수 있도록 할때 사용하는 필터.

## 보안관련고려사항
### SOP (Same Origin Policy)
- SOP는 같은 Origin에만 요청을 보낼 수 있게 제한하는 보안 정책을 의미한다.
- 즉 같은 호스트, 같은 포트, 같은 프로토콜 에서만 접근이 가능한 것이다.
- 스프링 부트는 아무런 설정을 하지 않으면 SOP 정책을 따르게 된다.

> 백엔드인 스프링 부트는 http://localhost:8080 을 사용, 프론트는 http://localhost:3000 을 사용하였다.
>
> 두 Origin 간에 프로토콜, 포트, 호스트가 같아야 SOP 정책을 만족시키는데, Origin이 달라 해당 정책을 만족시키지 못하기 때문에 서버측에서 CORS를 이용하여야 한다.
>

### CORS (Cross-Origin Resource Sharing)
- CORS 란 서로 다른 Origin끼리 요청을 주고받을 수 있게 정해둔 표준. 위와 같이 백엔드와 프론트의 Origin이 다를 경우 사용해야 한다.
- CORS를 적용하고자 하는 Controller 위에 @CrossOrigin("*") 사용하여 특정 컨트롤러의 url에만 적용가능.
- WebMvcConfigurer 인터페이스를 상속받아서 CORS를 적용하여 범용적 적용가능.

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:3000");
    }
}
```

- Spring Security 사용시 WebConfig에 .allowedMethods("*") 를 추가외에도 Spring Security 관련설정 추가필요

```java
@Override
protected void configure(HttpSecurity httpSecurity) throws Exception {
    httpSecurity.cors().configurationSource(request -> new CorsConfiguration().applyPermitDefaultValues()); // 추가

    httpSecurity
        ....
        .authorizeRequests()
        .requestMatchers(CorsUtils::isPreFlightRequest).permitAll() // 추가
}
```

> jwt 인증 방식을 사용하기 위해 WebSecurityConfigurerAdapter를 상속받아 만들었던 WebSecurityConfig 클래스의 configure 메소드에 추가한 코드
> 
> applyPermitDefaultValues() 메소드는 allowMethods를 따로 설정해 주지 않으면 default로 GET, HEAD, POST만 가지게 된다.
>
> 그래서 이걸 사용하지 않고 아래와 같이 코드를 수정해 GET, HEAD, POST 이외의 메소드도 추가해줘야 한다.
>

```java
@Override
protected void configure(HttpSecurity httpSecurity) throws Exception {
    httpSecurity.cors().configurationSource(request -> {
        var cors = new CorsConfiguration();
        cors.setAllowedOrigins(List.of("http://localhost:3000"));
        cors.setAllowedMethods(List.of("GET","POST", "PUT", "DELETE", "OPTIONS"));
        cors.setAllowedHeaders(List.of("*"));
        return cors;
    });
    
    ....
    
}
```

- setAllowedOrigins() : 허용할 URL
- setAllowedMethods() : 허용할 Http Method
- setAllowedHeaders() : 허용할 Header
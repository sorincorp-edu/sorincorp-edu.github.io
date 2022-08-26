---
layout: single
title:  "[Spring Reactive] - RSocket"
excerpt: "스프링5 웹 리액티브 스택 RSocket 한글 번역"

categories:
  - Spring Reactive
tags:
  - [RSocket, Spring Reactive]

toc: true
toc_sticky: true
 
date: 2022-01-27
last_modified_at: 2022-01-27
---
* [출처 - 토리맘의 한글라이즈 프로젝트](https://godekdls.github.io/Reactive%20Spring/springwebflux/)

## 5.1. Overview

RSocket은 TCP, 웹소켓 등의 바이트 스트림 전송 프로토콜 위에서 동작하는, 다중화 양방향 소통을 위한 어플리케이션 프로토콜이다. RSocket은 다음 모델로 상호작용한다:

- `Request-Response` — 메세지 하나를 전송하고 메세지 하나를 돌려받는다.
- `Request-Stream` — 메세지 하나를 전송하고 메세지 스트림을 돌려받는다.
- `Channel` — 양방향 메세지 스트림을 전송한다.
- `Fire-and-Forget` — 메세지를 한 번만 전송한다.

한 번 커넥션을 맺고 나면 "클라이언트"와 "서버"라는 구분은 사라지고, 양쪽 다 동일하게 이 모델 중 하나로 통신을 시작할 수 있다. 그렇기 때문에 이 프로토콜에선 통신에 참여하는 각 주체를 "requester"와 "responder"라고 부르고, 이 모델은 "request streams" 또는 간단히 "requests"라고 부른다.

RSocket 프로토콜은 다음과 같은 특징이 있다:

- 네트워크 경계를 넘어선 [리액티브 스트림](https://www.reactive-streams.org/) 시맨틱스 — `Request-Stream`, `Channel` 같은 스트리밍 요청에선 requester와 responder가 back pressure 신호를 주고받기 때문에, requester가 responder의 속도를 제한할 수 있다. 따라서 네트워크 혼잡에 영향을 덜 받으며, 네트워크를 포함한 모든 레벨에서 버퍼의 필요성이 떨어진다.
- 요청 제한(Request throttling) — 한쪽에서 `LEASE` 프레임을 보내면 주어진 시간 동안 다른 한쪽이 보낼 수 있는 요청 수를 제한하기 때문에 이 기능을 "Leasing"이라고 부른다. Lease는 주기적으로 갱신된다.
- 세션 재개(Session resumption) — 커넥션을 유실해도 상태를 유지해 준다. 어플리케이션에 투명하게 상태를 관리할 수 있으며, back pressure와 함께 사용하면 state를 최소한으로 유지할 수 있고, 가능하면 producer를 중단할 수도 있다.
- 큰 메세지 단편화 및 재조립(Fragmentation and re-assembly of large messages).
- Keepalive (heartbeats).

RSocket은 다양한 언어로 [구현](https://github.com/rsocket)돼 있다. [자바 라이브러리](https://github.com/rsocket/rsocket-java)는 메세지 전송을 위해 [Project Reactor](https://projectreactor.io/)와 [Reactor Netty](https://github.com/reactor/reactor-netty)를 사용한다. 즉, 어플리케이션에서 리액티브 스트림 publisher로 신호를 보내면 RSocket을 통해 투명하게 네트워크 너머로 전파된다는 뜻이다.

### 5.1.1. The Protocol

RSocket을 쓰면 좋은 점은 네트워크 상 행동을 잘 정의하고 있으며, 프로토콜 [익스텐션](https://github.com/rsocket/rsocket/tree/master/Extensions)을 포함한 [스펙 문서](https://rsocket.io/docs/Protocol)를 읽기 쉽다는 것이다. 그렇기 때문에 언어별 구현체와 고수준 프레임워크 API와는 별개로 스펙 문서를 읽어보는 것도 좋은 생각이다. 이번 섹션에서는 스프링의 RSocket 지원을 다루기 앞서 필요한 개념을 간단히 정리한다.

**Connecting**

제일 처음엔 클라이언트가 TCP, 웹소켓같은 저수준 스트리밍을 전송해서 서버에 커넥션을 요청하고, 커넥션 파라미터 설정을 위한 `SETUP` 프레임을 전송한다.

서버에서 `SETUP` 프레임을 거절할 수도 있지만, 일반적으로 프레임을 전송하고(클라이언트가) 받았으면(서버가) 양쪽 다 요청을 시작할 수 있다. 단, `SETUP` 프레임에서 lease 플래그로 요청 수를 제한했다면, 양쪽 다 상대방이 `LEASE` 프레임을 보내 요청을 수락하기 전까지 기다린다.

**Making Requests**

한 번 커넥션을 맺고 나면, 양쪽 다 `REQUEST_RESPONSE`, `REQUEST_STREAM`, `REQUEST_CHANNEL`, `REQUEST_FNF` 프레임 중 하나로 요청을 시작할 수 있다. 각 프레임은 requester로부터 responder에게 메세지 한 개를 전송한다.

responder는 응답 메세지를 `PAYLOAD` 프레임에 담아 보내고, `REQUEST_CHANNEL` 요청이었다면, requester가 다른 요청 메세지를 `PAYLOAD` 프레임에 담아 전송한다.

`Request-Stream`이나 `Channel`로 메세지 스트림을 요청했다면, responder는 requester가 보낸 demand(아이템을 몇 개 받을 건지)를 지켜야 한다. Demand는 메세지 수로 표현한다. 첫 번째 demend는 `REQUEST_STREAM`, `REQUEST_CHANNEL` 프레임에 명시한다. 이어지는 demand는 `REQUEST_N` 프레임으로 알린다.

양쪽 다 `METADATA_PUSH` 프레임으로 메타데이터를 통지할 수도 있는데, 이때 사용하는 메타 데이터는 각 요청이 아닌 전체 커넥션과 관련된 정보다.

**Message Format**

RSocket 메세지엔 데이터와 메타 데이터가 있다. 메타 데이터로는 라우팅 정보, 보안 토큰 등을 전송한다. 데이터와 메타 데이터는 다른 포맷을 사용한다. 각 Mime 타입은 `SETUP` 프레임에 선언하며, 이는 커넥션으로 전송하는 모든 요청에 적용된다.

모든 메세지는 메타 데이터를 전송할 수 있지만, 라우팅 정보 같은 메타 데이터는 보통 요청 당 하나만 필요하기 때문에, 요청의 첫 번째 메세지에만 포함시킨다(e.g. `REQUEST_RESPONSE`, `REQUEST_STREAM`, `REQUEST_CHANNEL`, `REQUEST_FNF` 프레임 중 하나로).

프로토콜 익스텐션에선 어플리케이션에서 자주 사용하는 메타 데이터를 정의한다:

- [Composite Metadata](https://github.com/rsocket/rsocket/blob/master/Extensions/CompositeMetadata.md) — 독립적으로 포맷팅한 다양한 메타 데이터 엔트리.
- [Routing](https://github.com/rsocket/rsocket/blob/master/Extensions/Routing.md) — 요청을 라우팅하기 위한 정보.

### 5.1.2. Java Implementation

RSocket의 [자바 구현체](https://github.com/rsocket/rsocket-java)는 [Project Reactor](https://projectreactor.io/)를 사용한다. TCP/웹소켓 전송은 [Reactor Netty](https://github.com/reactor/reactor-netty)를 사용한다. 리액터는 리액티브 스트림 라이브러리기 때문에 프로토콜 구현을 단순하게 만들어 준다. 어플리케이션에서는 선언적인(declarative) 연산자와 back pressure를 지원하는 `Flux`, `Mono`를 사용하면 된다.

RSocket 자바 API는 최소한으로 설계되었다. API는 프로토콜 기능에만 집중하고, 어플리케이션 프로그래밍 모델은(e.g. RPC codegen 등) 고수준 관심사만 처리하면 된다.

[io.rsocket.RSocket](https://github.com/rsocket/rsocket-java/blob/master/rsocket-core/src/main/java/io/rsocket/RSocket.java)이 주로 담당하는 일은 네 가지 인터랙션 타입을 단일 메세지는 `Mono`로, 메세지 스트림은 `Flux`로, 바이트 버퍼로 데이터와 메타 데이터에 접근할 수 있는 실제 메세지는 `io.rsocket.Payload`로 모델링하는 일이다. `RSocket` 역할은 대칭적이다. 어플리케이션은 `RSocket`으로 요청을 만들고, 요청에 응답할 땐 `RSocket`을 구현한다.

여기서 설명한 게 전부는 아니다. 보통은 스프링 어플리케이션이 직접 이 API를 사용할 일은 없다. 하지만 스프링과는 별개로 RSocket을 살펴보고 테스트해보는 것도 좋다. RSocket 자바 레포지토리에는 API와 프로토콜 기능을 소개하는 다양한 [샘플 코드](https://github.com/rsocket/rsocket-java/tree/master/rsocket-examples)가 있다.

### 5.1.3. Spring Support

`spring-messaging` 모듈이 지원하는 내용은 다음과 같다:

- [RSocketRequester](#52-rsocketrequester) — `io.rsocket.RSocket`으로 요청을 만들고 데이터와 메타 데이터를 인코딩/디코딩할 수 있는 API.
- [Annotated Responders](#53-annotated-responders) — `@MessageMapping`을 선언해서 응답을 만드는 핸들러 메소드.

`spring-web` 모듈에는 RSocket 어플리케이션에서 필요할 수도 있는 Jackson CBOR/JSON, Protobuf 등의 `Encoder`, `Decoder` 구현체가 있다. 효율적으로 라우팅 정보를 매칭할 수 있는 `PathPatternParser`도 지원한다.

스프링 부트 2.2를 사용하면 TCP나 웹소켓을 사용해서 RSocket 서버를 기동시킬 수 있고, 웹플럭스 서버에서 사용할 웹소켓 기반 RSocket 옵션을 설정할 수 있다. 클라이언트도 지원하며, `RSocketRequester.Builder`, `RSocketStrategies`를 자동으로 설정할 수도 있다. 자세한 내용은 스프링 부트 레퍼런스의 [RSocket 섹션](../../Spring%20Boot/rsocket/)을 참고하라.

Spring Security 5.2는 RSocket을 지원한다.

Spring Integration 5.2는 RSocket 클라이언트와 서버로 통신할 수 있는 인바운드, 아웃바운드 게이트웨이를 지원한다. 자세한 내용은 Spring Integration 레퍼런스 매뉴얼을 참고하라.

Spring Cloud Gateway는 RSocket 커넥션을 지원한다.

---

## 5.2. RSocketRequester

RSocket 요청을 처리하는 `RSocketRequester`는 데이터와 메타 데이터를 저수준 데이터 버퍼 대신 객체로 표현한다. 클라이언트 요청과 서버 요청 둘 다 `RSocketRequester`로 만들 수 있다.

### 5.2.1. Client Requester

클라이언트 사이드에서 `RSocketRequester`를 사용하려면, 서버에 커넥션을 요청하고 첫 RSocket `SETUP` 프레임을 전송해야 한다. `RSocketRequester`는 이를 위한 빌더를 제공한다. 내부에선 RSocket 자바의 `RSocketFactory`를 사용한다.

다음은 디폴트 세팅으로 연결을 시작하는 가장 간단한 예제다:

<div class="switch-language-wrapper java kotlin">
<span class="switch-language java">java</span>
<span class="switch-language kotlin">kotlin</span>
</div>
<div class="language-only-for-java java kotlin"></div>
```java
Mono<RSocketRequester> requesterMono = RSocketRequester.builder()
  .connectTcp("localhost", 7000);

Mono<RSocketRequester> requesterMono = RSocketRequester.builder()
  .connectWebSocket(URI.create("https://example.org:8080/rsocket"));
```
<div class="language-only-for-kotlin java kotlin"></div>
```kotlin
import org.springframework.messaging.rsocket.connectTcpAndAwait
import org.springframework.messaging.rsocket.connectWebSocketAndAwait

val requester = RSocketRequester.builder()
      .connectTcpAndAwait("localhost", 7000)

val requester = RSocketRequester.builder()
      .connectWebSocketAndAwait(URI.create("https://example.org:8080/rsocket"))
```

위 코드는 바로 커넥션을 맺지 않는다. 실제로 커넥션을 맺고 requester를 사용하려면 다음과 같이 작성해야 한다:

<div class="switch-language-wrapper java kotlin">
<span class="switch-language java">java</span>
<span class="switch-language kotlin">kotlin</span>
</div>
<div class="language-only-for-java java kotlin"></div>
```java
// Connect asynchronously
RSocketRequester.builder().connectTcp("localhost", 7000)
  .subscribe(requester -> {
      // ...
  });

// Or block
RSocketRequester requester = RSocketRequester.builder()
  .connectTcp("localhost", 7000)
  .block(Duration.ofSeconds(5));
```
<div class="language-only-for-kotlin java kotlin"></div>
```kotlin
// Connect asynchronously
import org.springframework.messaging.rsocket.connectTcpAndAwait

class MyService {

  private var requester: RSocketRequester? = null

  private suspend fun requester() = requester ?:
      RSocketRequester.builder().connectTcpAndAwait("localhost", 7000).also { requester = it }

  suspend fun doSomething() = requester().route(...)
}

// Or block
import org.springframework.messaging.rsocket.connectTcpAndAwait

class MyService {

  private val requester = runBlocking {
      RSocketRequester.builder().connectTcpAndAwait("localhost", 7000)
  }

  suspend fun doSomething() = requester.route(...)
}
```

#### Connection Setup

`RSocketRequester.Builder`를 사용하면 `SETUP` 프레임에 다음과 같은 내용을 설정할 수 있다:

- `dataMimeType(MimeType)` — 전송할 데이터 mime 타입.
- `metadataMimeType(MimeType)` — 전송할 메타 데이터 mime 타입.
- `setupData(Object)` — `SETUP`에서 전송할 데이터.
- `setupRoute(String, Object…)` — `SETUP`에서 전송할 라우팅 관련 메타 데이터.
- `setupMetadata(Object, MimeType)` — `SETUP`에서 전송할 다른 메타 데이터.

데이터의 디폴트 mime 타입은 설정에 있는 첫 번째 `Decoder`로 결정한다. 메타 데이터의 디폴트 mime 타입은 요청 하나에 메타 데이터와 mime 타입을 여러 개 사용할 수 있는 [composite metadata](https://github.com/rsocket/rsocket/blob/master/Extensions/CompositeMetadata.md)다. 보통은 둘 다 변경할 필요 없다.

`SETUP`에서 데이터와 메타데이터는 옵션이다. 서버 사이드에선 [@ConnectMapping](#534-connectmapping) 메소드로 커넥션을 시작하고  `SETUP` 프레임 컨텐츠를 처리한다. 메타 데이터엔 커넥션에 필요한 보안 정보를 담을 수 있다.

#### Strategies

`RSocketRequester.Builder`엔 requester에서 사용할 `RSocketStrategies`를 받는 메소드가 있다. 여기에 데이터와 메타 데이터 값을 (역)직렬화할 인코더와 디코더를 설정할 수 있다. `spring-core`에 있는 기본적인 `String`, `byte[]`, `ByteBuffer` 코덱만 디폴트로 등록된다. `spring-web` 모듈을 사용하면 다음과 같은 코덱을 추가로 등록할 수 있다:

<div class="switch-language-wrapper java kotlin">
<span class="switch-language java">java</span>
<span class="switch-language kotlin">kotlin</span>
</div>
<div class="language-only-for-java java kotlin"></div>
```java
RSocketStrategies strategies = RSocketStrategies.builder()
  .encoders(encoders -> encoders.add(new Jackson2CborEncoder()))
  .decoders(decoders -> decoders.add(new Jackson2CborDecoder()))
  .build();

Mono<RSocketRequester> requesterMono = RSocketRequester.builder()
  .rsocketStrategies(strategies)
  .connectTcp("localhost", 7000);
```
<div class="language-only-for-kotlin java kotlin"></div>
```kotlin
import org.springframework.messaging.rsocket.connectTcpAndAwait

val strategies = RSocketStrategies.builder()
      .encoders { it.add(Jackson2CborEncoder()) }
      .decoders { it.add(Jackson2CborDecoder()) }
      .build()

val requester = RSocketRequester.builder()
      .rsocketStrategies(strategies)
      .connectTcpAndAwait("localhost", 7000)
```

`RSocketStrategies`는 재사용해도 된다. 어플리케이션 하나에서 클라이언트와 서버를 둘 다 사용한다면 스프링 설정에 선언하는 게 더 편리하다.

#### Client Responders

서버 요청에 응답하는 responder를 만들 때도 `RSocketRequester.Builder`를 사용한다.

핸들러를 만들어 어노테이션을 선언하면 클라이언트 측 응답을 처리할 수 있다. 내부에선 서버와 동일한 방법으로 처리하지만, 다음과 같이 코드로 등록한다:

<div class="switch-language-wrapper java kotlin">
<span class="switch-language java">java</span>
<span class="switch-language kotlin">kotlin</span>
</div>
<div class="language-only-for-java java kotlin"></div>
```java
RSocketStrategies strategies = RSocketStrategies.builder()
  .routeMatcher(new PathPatternRouteMatcher()) // (1)
  .build();

ClientHandler handler = new ClientHandler(); // (2)

Mono<RSocketRequester> requesterMono = RSocketRequester.builder()
  .rsocketFactory(RSocketMessageHandler.clientResponder(strategies, handler)) // (3)
  .connectTcp("localhost", 7000);
```
<div class="language-only-for-kotlin java kotlin"></div>
```kotlin
import org.springframework.messaging.rsocket.connectTcpAndAwait

val strategies = RSocketStrategies.builder()
      .routeMatcher(PathPatternRouteMatcher()) // (1)
      .build()

val handler = ClientHandler() // (2)

val requester = RSocketRequester.builder()
      .rsocketFactory(RSocketMessageHandler.clientResponder(strategies, handler)) // (3)
      .connectTcpAndAwait("localhost", 7000)
```
<small><span style="background-color: #a9dcfc; border-radius: 50px;">(1)</span> `spring-web` 모듈을 사용한다면 `PathPatternRouteMatcher`로 라우팅할 수 있다.</small><br>
<small><span style="background-color: #a9dcfc; border-radius: 50px;">(2)</span> `@MessageMaping` 또는 `@ConnectMapping` 메소드가 있는 responder를 만든다.</small><br>
<small><span style="background-color: #a9dcfc; border-radius: 50px;">(3)</span> `RSocketMessageHandler`의 스태틱 팩토리 메소드로 하나 이상의 responder를 등록한다.
</small>

위 코드는 클라이언트 responder를 등록하는 방법을 보여주기 위한 예시일 뿐이다. 스프링 설정을 사용한다면, 다음 예제처럼 스프링 빈으로 선언한 `RSocketMessageHandler`를 등록하면 된다:

<div class="switch-language-wrapper java kotlin">
<span class="switch-language java">java</span>
<span class="switch-language kotlin">kotlin</span>
</div>
<div class="language-only-for-java java kotlin"></div>
```java
ApplicationContext context = ... ;
RSocketMessageHandler handler = context.getBean(RSocketMessageHandler.class);

Mono<RSocketRequester> requesterMono = RSocketRequester.builder()
  .rsocketFactory(factory -> factory.acceptor(handler.responder()))
  .connectTcp("localhost", 7000);
```
<div class="language-only-for-kotlin java kotlin"></div>
```kotlin
import org.springframework.beans.factory.getBean
import org.springframework.messaging.rsocket.connectTcpAndAwait

val context: ApplicationContext = ...
val handler = context.getBean<RSocketMessageHandler>()

val requester = RSocketRequester.builder()
      .rsocketFactory { it.acceptor(handler.responder()) }
      .connectTcpAndAwait("localhost", 7000)
```

위 코드에선 디폴트로 `@Controller`에서 클라이언트 responder를 찾는다. `@RSocketClientResponder` 등의 커스텀 어노테이션을 사용하고 싶다면 `RSocketMessageHandler`의 `setHandlerPredicate`로  전략을 바꿔야 한다. 어플리케이션 하나에서 클라이언트와 서버를 같이 사용하거나, 여러 클라이언트를 사용한다면 이 전략이 필요하다.

프로그래밍 모델은 [Annotated Responders](#53-annotated-responders)에도 자세히 나와 있다.

#### Advanced

`RSocketRequesterBuilder`의 `ClientRSocketFactory` 콜백을 사용하면 RSocket 자바에서 사용할 keepalive 인터벌, 세션 재개, 인터셉터 등의 옵션을 설정할 수 있다:

<div class="switch-language-wrapper java kotlin">
<span class="switch-language java">java</span>
<span class="switch-language kotlin">kotlin</span>
</div>
<div class="language-only-for-java java kotlin"></div>
```java
Mono<RSocketRequester> requesterMono = RSocketRequester.builder()
  .rsocketFactory(factory -> {
      // ...
  })
  .connectTcp("localhost", 7000);
```
<div class="language-only-for-kotlin java kotlin"></div>
```kotlin
import org.springframework.messaging.rsocket.connectTcpAndAwait

val requester = RSocketRequester.builder()
      .rsocketFactory {
          //...
      }.connectTcpAndAwait("localhost", 7000)
```

### 5.2.2. Server Requester

서버에서 연결된 클라이언트로 요청을 보내려면 연결된 클라이언트의 requester가 필요하다.

[Annotated Responders](#53-annotated-responders)를 사용하면, `@ConnectMapping`, `@MessageMapping` 메소드에서 `RSocketRequester`를 인자로 받을 수 있다. 이 인자로 커넥션을 맺은 requester에 접근한다. `@ConnectMapping` 메소드는 요청을 시작하기 전에 처리해야 하는 `SETUP` 프레임을 위한 핸들러라는 점에 주의하라. 따라서 요청은 시작할 때부터 분리해야 한다. 예를 들면 다음과 같다:

<div class="switch-language-wrapper java kotlin">
<span class="switch-language java">java</span>
<span class="switch-language kotlin">kotlin</span>
</div>
<div class="language-only-for-java java kotlin"></div>
```java
@ConnectMapping
Mono<Void> handle(RSocketRequester requester) {
  requester.route("status").data("5")
      .retrieveFlux(StatusReport.class)
      .subscribe(bar -> { // (1)
          // ...
      });
  return ... // (2)
}
```
<div class="description-for-java java kotlin"></div>
<small><span style="background-color: #a9dcfc; border-radius: 50px;">(1)</span> 독립적인 쓰레드로 비동기 요청을 시작한다.</small><br>
<small><span style="background-color: #a9dcfc; border-radius: 50px;">(2)</span> 처리를 완료하면 `Mono<Void>`를 리턴한다.</small>
<div class="language-only-for-kotlin java kotlin"></div>
```kotlin
@ConnectMapping
suspend fun handle(requester: RSocketRequester) {
  GlobalScope.launch {
      requester.route("status").data("5").retrieveFlow<StatusReport>().collect { // (1)
          // ...
      }
  }
  /// ... // (2)
}
```
<div class="description-for-kotlin java kotlin"></div>
<small><span style="background-color: #a9dcfc; border-radius: 50px;">(1)</span> 독립적인 쓰레드로 비동기 요청을 시작한다.</small><br>
<small><span style="background-color: #a9dcfc; border-radius: 50px;">(2)</span> suspend 함수에서 처리한다.</small>

### 5.2.3. Requests

[client](#521-client-requester) 나 [server](#522-server-requester) requester를 얻어 왔다면 다음처럼 요청을 보낼 수 있다:

<div class="switch-language-wrapper java kotlin">
<span class="switch-language java">java</span>
<span class="switch-language kotlin">kotlin</span>
</div>
<div class="language-only-for-java java kotlin"></div>
```java
ViewBox viewBox = ... ;

Flux<AirportLocation> locations = requester.route("locate.radars.within") // (1)
      .data(viewBox) // (2)
      .retrieveFlux(AirportLocation.class); // (3)
```
<div class="language-only-for-kotlin java kotlin"></div>
```kotlin
val viewBox: ViewBox = ...

val locations = requester.route("locate.radars.within") // (1)
      .data(viewBox) // (2)
      .retrieveFlow<AirportLocation>() // (3)
```
<small><span style="background-color: #a9dcfc; border-radius: 50px;">(1)</span> 요청 메세지에 보낼 메타 데이터에 라우팅 정보를 지정한다.</small><br>
<small><span style="background-color: #a9dcfc; border-radius: 50px;">(2)</span> 요청 메세지에 보낼 데이터를 제공한다.</small><br>
<small><span style="background-color: #a9dcfc; border-radius: 50px;">(3)</span> 원하는 응답을 선언한다.</small>

인터랙션 타입은 입출력 카디널리티로 결정된다. 위 예제는 값 하나를 전송하고 값 여러 개를 스트림으로 돌려받기 때문에 `Request-Stream`을 사용한다. 사용하는 입출력 타입이 RSocket 인터랙션 타입과, responder에서 사용하는 입출력 타입과 동일하다면 굳이 신경 쓸 필요 없다. 동일하지 않은 조합은 다대일(many-to-one)밖에 없다.

`data(Object)` 메소드는 `Flux`, `Mono`를 포함해서 `ReactiveAdapterRegistry`에 등록된 모든 리액티브 스트림 `Publisher`를 받을 수 있다. 같은 타입을 여러 개 생산하는 `Flux` 등의 multi-value `Publisher`를 사용한다면, 다음 오버로딩한 `data` 메소드를 사용해라. 이 메소드는 타입 검사와 `Encoder` lookup을 매번 수행하지 않는다.

```java
data(Object producer, Class<?> elementClass);
data(Object producer, ParameterizedTypeReference<?> elementTypeRef);
```

데이터를 보내지 않는 요청이라면 `data(Object)`를 생략해도 된다:

<div class="switch-language-wrapper java kotlin">
<span class="switch-language java">java</span>
<span class="switch-language kotlin">kotlin</span>
</div>
<div class="language-only-for-java java kotlin"></div>
```java
Mono<AirportLocation> location = requester.route("find.radar.EWR"))
  .retrieveMono(AirportLocation.class);
```
<div class="language-only-for-kotlin java kotlin"></div>
```kotlin
import org.springframework.messaging.rsocket.retrieveAndAwait

val location = requester.route("find.radar.EWR")
  .retrieveAndAwait<AirportLocation>()
```

[composite metadata](https://github.com/rsocket/rsocket/blob/master/Extensions/CompositeMetadata.md)(디폴트)를 사용하거나 등록한 `Encoder`가 지원하는 값이라면, 다른 메타 데이터를 추가할 수 있다. 예를 들면 다음과 같다:

<div class="switch-language-wrapper java kotlin">
<span class="switch-language java">java</span>
<span class="switch-language kotlin">kotlin</span>
</div>
<div class="language-only-for-java java kotlin"></div>
```java
String securityToken = ... ;
ViewBox viewBox = ... ;
MimeType mimeType = MimeType.valueOf("message/x.rsocket.authentication.bearer.v0");

Flux<AirportLocation> locations = requester.route("locate.radars.within")
      .metadata(securityToken, mimeType)
      .data(viewBox)
      .retrieveFlux(AirportLocation.class);
```
<div class="language-only-for-kotlin java kotlin"></div>
```kotlin
import org.springframework.messaging.rsocket.retrieveFlow

val requester: RSocketRequester = ...

val securityToken: String = ...
val viewBox: ViewBox = ...
val mimeType = MimeType.valueOf("message/x.rsocket.authentication.bearer.v0")

val locations = requester.route("locate.radars.within")
      .metadata(securityToken, mimeType)
      .data(viewBox)
      .retrieveFlow<AirportLocation>()
```

`Fire-and-Forget` 방식은 `Mono<Void>`를 리턴하는 `send()` 메소드를 사용하면 된다. 단 `Mono`는 메세지 전송에 성공했다는 뜻이지, 제대로 처리됐다는 뜻은 아니다.

---

## 5.3. Annotated Responders

RSocket responder는 `@MessageMapping`, `@ConnectMapping` 메소드로 구현할 수 있다. `@MessageMapping` 메소드는 각 요청을 처리하고, `@ConnectMapping` 메소드는 커넥션 레벨 이벤트(setup과 메타 데이터 푸쉬)를 처리한다. 이 어노테이션으로 서버 쪽 응답과 클라이언트 쪽 응답을 모두 처리할 수 있다.

### 5.3.1. Server Responders

서버 사이드에서 annotated responder를 사용하려면, `RSocketMessageHandler`를 스프링 설정에 선언해야 한다. 그래야 `@Controller` 빈에 있는  `@MessageMapping`, `@ConnectMapping` 메소드를 인식한다:

<div class="switch-language-wrapper java kotlin">
<span class="switch-language java">java</span>
<span class="switch-language kotlin">kotlin</span>
</div>
<div class="language-only-for-java java kotlin"></div>
```java
@Configuration
static class ServerConfig {

  @Bean
  public RSocketMessageHandler rsocketMessageHandler() {
      RSocketMessageHandler handler = new RSocketMessageHandler();
      handler.routeMatcher(new PathPatternRouteMatcher());
      return handler;
  }
}
```
<div class="language-only-for-kotlin java kotlin"></div>
```kotlin
@Configuration
class ServerConfig {

  @Bean
  fun rsocketMessageHandler() = RSocketMessageHandler().apply {
      routeMatcher = PathPatternRouteMatcher()
  }
}
```

그다음 자바 RSocket API에 `RSocketMessageHandler`를 등록하면 RSocket 서버를 시작할 수 있다:

<div class="switch-language-wrapper java kotlin">
<span class="switch-language java">java</span>
<span class="switch-language kotlin">kotlin</span>
</div>
<div class="language-only-for-java java kotlin"></div>
```java
ApplicationContext context = ... ;
RSocketMessageHandler handler = context.getBean(RSocketMessageHandler.class);

CloseableChannel server =
  RSocketFactory.receive()
      .acceptor(handler.responder())
      .transport(TcpServerTransport.create("localhost", 7000))
      .start()
      .block();
```
<div class="language-only-for-kotlin java kotlin"></div>
```kotlin
import org.springframework.beans.factory.getBean

val context: ApplicationContext = ...
val handler = context.getBean<RSocketMessageHandler>()

val server = RSocketFactory.receive()
      .acceptor(handler.responder())
      .transport(TcpServerTransport.create("localhost", 7000))
      .start().awaitFirst()
```

`RSocketMessageHandler`는 기본적으로 [composite](https://github.com/rsocket/rsocket/blob/master/Extensions/CompositeMetadata.md), [routing](https://github.com/rsocket/rsocket/blob/master/Extensions/Routing.md) 메타 데이터를 지원한다. mime 타입을 바꾸거나, 다른 메타 데이터 mime 타입을 등록하려면 [MetadataExtractor](#54-metadataextractor)를 사용해야 한다.

메타 데이터와 데이터 포맷에 맞는 `Encoder` `Decoder` 인스턴스도 등록해야 한다. `spring-web` 모듈에 있는 코덱 구현체를 사용해도 된다.

라우팅 정보는 디폴트로 `SimpleRouteMatcher`가 `AntPathMatcher`로 매칭한다. 효율적인 매칭을 위해 `spring-web` 모듈의 `PathPatternRouteMatcher`를 추천한다. RSocket 라우트는 계층 구조를 사용할 수 있지만 URL path는 그렇지 않다. 두 라우트 매처 모두 "."를 디폴트 구분자로 사용하며, HTTP URL과 마찬가지로 URL 디코딩은 하지 않는다.

`RSocketMessageHandler`는 `RSocketStrategies`를 설정할 수 있다. 같은 프로세스 내에서 클라이언트와 서버가 설정을 공유해야 한다면 유용할 것이다.

<div class="switch-language-wrapper java kotlin">
<span class="switch-language java">java</span>
<span class="switch-language kotlin">kotlin</span>
</div>
<div class="language-only-for-java java kotlin"></div>
```java
@Configuration
static class ServerConfig {

  @Bean
  public RSocketMessageHandler rsocketMessageHandler() {
      RSocketMessageHandler handler = new RSocketMessageHandler();
      handler.setRSocketStrategies(rsocketStrategies());
      return handler;
  }

  @Bean
  public RSocketStrategies rsocketStrategies() {
      return RSocketStrategies.builder()
          .encoders(encoders -> encoders.add(new Jackson2CborEncoder()))
          .decoders(decoders -> decoders.add(new Jackson2CborDecoder()))
          .routeMatcher(new PathPatternRouteMatcher())
          .build();
  }
}
```
<div class="language-only-for-kotlin java kotlin"></div>
```kotlin
@Configuration
class ServerConfig {

  @Bean
  fun rsocketMessageHandler() = RSocketMessageHandler().apply {
      rSocketStrategies = rsocketStrategies()
  }

  @Bean
  fun rsocketStrategies() = RSocketStrategies.builder()
          .encoders { it.add(Jackson2CborEncoder()) }
          .decoders { it.add(Jackson2CborDecoder()) }
          .routeMatcher(PathPatternRouteMatcher())
          .build()
}
```

### 5.3.2. Client Responders

클라이언트 사이드 Annotated responder는 `RSocketRequester.Builder`로 설정해야 한다. 자세한 내용은 [Client Responders](#client-responders)를 참고하라.

### 5.3.3. @MessageMapping

[server](#531-server-responders)나 [client](#532-client-responders) 설정을 완료했다면, 다음과 같이 `@MessageMapping` 메소드를 활용할 수 있다:

<div class="switch-language-wrapper java kotlin">
<span class="switch-language java">java</span>
<span class="switch-language kotlin">kotlin</span>
</div>
<div class="language-only-for-java java kotlin"></div>
```java
@Controller
public class RadarsController {

  @MessageMapping("locate.radars.within")
  public Flux<AirportLocation> radars(MapRequest request) {
      // ...
  }
}
```
<div class="language-only-for-kotlin java kotlin"></div>
```kotlin
@Controller
class RadarsController {

  @MessageMapping("locate.radars.within")
  fun radars(request: MapRequest): Flow<AirportLocation> {
      // ...
  }
}
```

위에 있는 `@MessageMapping` 메소드는 "locate.radars.within"라는 라우팅 정보를 가진 Request-Stream에 응답한다. 다음과 같은 메소드 인자를 지원한다:

| Method Argument                | Description                                                  |
| :----------------------------- | :----------------------------------------------------------- |
| `@Payload`                     | 요청 payload. `Mono`, `Flux` 같은 비동기 타입의 구체적인 값이 될 수도 있다.<br><Br>**주의:** 이 어노테이션은 옵션이다. simple type도 아니고 지원하는 다른 인자도 아니면 payload로 간주한다. |
| `RSocketRequester`             | 요청을 보낸 Requester.                                       |
| `@DestinationVariable`         | 라우팅 정보에서 추출한, 매핑 패턴에서 사용한 변수 값 (e.g. `@MessageMapping("find.radar.{id}")`). |
| `@Header`                      | 등록한 메타 데이터를 추출한 값 ([MetadataExtractor](#54-metadataextractor) 참고). |
| `@Headers Map<String, Object>` | 등록한 모든 메타 데이터를 추출한 값 ([MetadataExtractor](#54-metadataextractor) 참고). |

하나 이상의 객체를 리턴하면 응답 payload로 직렬화한다. 리턴 값은  `Mono`, `Flux` 같은 비동기 타입일 수도 있고, 구체적인 값이거나 `void`, `Mono<Void>` 같은 값이 없는 비동기 타입일 수도 있다.

`@MessageMapping`  메소드에선 입력(i.e. `@Payload` 인자)과 출력 카디널리티로  RSocket 인터랙션 타입을 결정한다. 타입별 카디널리티는 다음과 같다:

| Cardinality | Description                                                  |
| :---------- | :----------------------------------------------------------- |
| 1           | 명시적인 값 하나 또는 `Mono<T>` 같은 single-value 비동기 타입. |
| Many        | `Flux<T>` 같은 multi-value 비동기 타입.                       |
| 0           | 입력에서는 메소드에 `@Payload` 인자가 없다는 뜻이다. 출력에서는 `void`, `Mono<Void>`같이 값이 없는 비동기 타입을 의미한다. |

다음은 입출력 카디널리티 조합에 따른 인터랙션 타입이다:

| Input Cardinality | Output Cardinality | Interaction Types                 |
| :---------------- | :----------------- | :-------------------------------- |
| 0, 1              | 0                  | Fire-and-Forget, Request-Response |
| 0, 1              | 1                  | Request-Response                  |
| 0, 1              | Many               | Request-Stream                    |
| Many              | 0, 1, Many         | Request-Channel                   |

### 5.3.4. @ConnectMapping

`@ConnectMapping`은 RSocket 커넥션을 시작할 때 사용하는 `SETUP` 프레임을 처리하며, 이어지는 `METADATA_PUSH` 프레임(i.e. `io.rsocket.RSocket `의 `metadataPush(Payload)`)으로 메타 데이터를 통지한다.

`@ConnectMapping` 메소드는 [@MessageMapping](#533-messagemapping)과 같은 인자를 지원하지만, `SETUP`, `METADATA_PUSH` 프레임의 데이터/메타 데이터를 매핑한다. `@ConnectMapping`에 패턴을 지정하면 메타 데이터에 특정 라우팅 정보가 있는 커넥션만 처리한다. 아무 패턴도 지정하지 않으면 모든 커넥션과 매칭된다.

`@ConnectMapping` 메소드는 데이터를 리턴할 순 없고, 리턴 타입을 `void`나 `Mono<Void>`로 선언해야 한다. 커넥션 요청을 처리할 때 에러를 리턴하면 커넥션을 거절한다. 커넥션을 맺으려면 핸들링 스레드에서 `RSocketRequester`로 요청을 보내면 안 된다. 자세한 내용은 [Server Requester](#522-server-requester)를 참고하라.

---

## 5.4. MetadataExtractor

Responder는 메타 데이터를 해석할 수 있어야 한다. [Composite metadata](https://github.com/rsocket/rsocket/blob/master/Extensions/CompositeMetadata.md)는 각 메타 데이터를(e.g. 라우팅, 보안, 추적 등) 각자에 맞는 mime 타입으로 포맷팅한다. 어플리케이션은 지원할 메타 데이터 mime 타입을 설정하고, 추출한 값에 접근할 방법이 필요하다.

`MetadataExtractor`는 직렬화한 메타 데이터를 받아 디코딩한 name-value 쌍을 리턴한다. 이 값은 헤더처럼 이름으로 접근할 수 있다. 예를 들어 어노테이션을 선언한 핸들러 메소드에서 `@Header`로 접근한다.

메타 데이터를 디코딩할 `Decoder` 인스턴스는 `DefaultMetadataExtractor`에 설정한다. `String`으로 디코딩해서 "route" 키에 저장하는 ["message/x.rsocket.routing.v0"](https://github.com/rsocket/rsocket/blob/master/Extensions/Routing.md)는 기본으로 지원한다. 그 외는 다음과 같이 mime 타입에 `Decoder`를 등록해야 한다:

<div class="switch-language-wrapper java kotlin">
<span class="switch-language java">java</span>
<span class="switch-language kotlin">kotlin</span>
</div>
<div class="language-only-for-java java kotlin"></div>
```java
DefaultMetadataExtractor extractor = new DefaultMetadataExtractor(metadataDecoders);
extractor.metadataToExtract(fooMimeType, Foo.class, "foo");
```
<div class="language-only-for-kotlin java kotlin"></div>
```kotlin
import org.springframework.messaging.rsocket.metadataToExtract

val extractor = DefaultMetadataExtractor(metadataDecoders)
extractor.metadataToExtract<Foo>(fooMimeType, "foo")
```

Composite metadata는 포맷이 다른 메타 데이터를 잘 조합해준다. 하지만 requester가 composite 메타 데이터를 지원하지 않거나, 단순히 사용하지 않을 수도 있다. 이런 경우, `DefaultMetadataExtractor`에 디코딩한 값을 map으로 매핑하는 커스텀 로직을 등록해야 한다. 다음은  메타 데이터에 JSON을 사용하는 예제다:

<div class="switch-language-wrapper java kotlin">
<span class="switch-language java">java</span>
<span class="switch-language kotlin">kotlin</span>
</div>
<div class="language-only-for-java java kotlin"></div>
```java
DefaultMetadataExtractor extractor = new DefaultMetadataExtractor(metadataDecoders);
extractor.metadataToExtract(
  MimeType.valueOf("application/vnd.myapp.metadata+json"),
  new ParameterizedTypeReference<Map<String,String>>() {},
  (jsonMap, outputMap) -> {
      outputMap.putAll(jsonMap);
  });
```
<div class="language-only-for-kotlin java kotlin"></div>
```kotlin
import org.springframework.messaging.rsocket.metadataToExtract

val extractor = DefaultMetadataExtractor(metadataDecoders)
extractor.metadataToExtract<Map<String, String>>(MimeType.valueOf("application/vnd.myapp.metadata+json")) { jsonMap, outputMap ->
  outputMap.putAll(jsonMap)
}
```

다음 예제는 `RSocketStrategies`로 `MetadataExtractor`를 등록한다. `RSocketStrategies.Builder`를 사용해 설정한 디코더로 extractor를 만들고, 간단하게 콜백으로 커스텀해서 등록할 수 있다:

<div class="switch-language-wrapper java kotlin">
<span class="switch-language java">java</span>
<span class="switch-language kotlin">kotlin</span>
</div>
<div class="language-only-for-java java kotlin"></div>
```java
RSocketStrategies strategies = RSocketStrategies.builder()
  .metadataExtractorRegistry(registry -> {
      registry.metadataToExtract(fooMimeType, Foo.class, "foo");
      // ...
  })
  .build();
```
<div class="language-only-for-kotlin java kotlin"></div>
```kotlin
import org.springframework.messaging.rsocket.metadataToExtract

val strategies = RSocketStrategies.builder()
      .metadataExtractorRegistry { registry: MetadataExtractorRegistry ->
          registry.metadataToExtract<Foo>(fooMimeType, "foo")
          // ...
      }
      .build()
```

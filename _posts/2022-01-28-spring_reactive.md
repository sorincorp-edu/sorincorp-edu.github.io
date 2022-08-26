---
layout: single
title:  "[Spring Reactive] - 리액티브 스프링"
excerpt: "Java/실전! 스프링 5를 활용한 리액티브 프로그래밍"

categories:
  - Spring Reactive
tags:
  - [Spring Reactive]

toc: true
toc_sticky: true
 
date: 2022-01-28
last_modified_at: 2022-01-28
---
# 리액티브 스프링
## 1. 왜 리액티브 스프링인가?
### 목적
* 리액티브와 매우 잘 어울리는 비즈니스 사례를 통해 리액티브 솔루션이 사전 대응형(proactive) 솔루션보다 우수한 이유를 이해한다
* 서버간 통신 방법을 보여주는 예시를 통해 현재의 비즈니스 요구사항을 이해한다
* 현대 스프링 프레임워크의 요구 사항에 대해 이해한다

### 1-1. 왜 리액티브인가?
증가하는 부하에 대해 응답 능력을 유지할 수 있다.

#### 탄력성(elasticty)
* 다양한 작업 부하에서 응답성을 유지하는 능력
* 수요에 따라 처리량이 자동으로 증가 또는 감소해야 한다
* 애플리케이션 관점으로 평균 지연 시간에 영향을 미치지 않고 시스템을 확장할 수 있어 응답성이 유지된다.

#### 복원력
* 시스템 실패에도 반응성을 유지할 수 있는 능력
* 시스템의 기능 요소를 격리해 모든 내부 장애를 격리하고 독립성을 확보함으로 달성 가능
* 탄력성과 복원력은 밀접하게 결합되어 있으며, 이 두 가지를 모두 사용할 때 시스템의 진정한 응답성을 달성가능

### 1-2. 메시지 기반 통신 (message-driven)
* I/O 측면에서 리소스 활용도를 높이려면 비동기 논블록킹(asynchronous and non-blocking) 모델을 사용해야 한다.
* 일반적으로 분산 시스템에서 서비스 간 통신을 할때 자원을 효율적으로 사용하기 위해서 메시지 기반 통신 원칙을 따른다
* 메시지 기반 통신을 수행하는 방법의 하나로 메시지 브로커(message broker) 사용이 있다.
* 메시지 브로커는 메시지 대기열을 모니터링해 시스템이 부하 관리 및 탄력성을 제어할 수 있도록 한다

#### 리액티브 시스템의 기본 원리

![리액티브 시스템](./../../images/spring_reactive/reacvie_system.png)
> 이 그림에서 유연성 → 탄력성, 탄력성 → 복원력이다

* 분산 시스템으로 구현되는 모든 비즈니스의 핵심 가치는 응답성이다.
* 시스템이 높은 응답성을 확보한다는 것은 탄력성 및 복원력 같은 기본 기법을 따른다는 의미이다.
* 응답성, 탄력성 및 복원력을 모두 확보하는 기본적인 방법의 하나는 메시지 기반 통신을 사용하는 것이다.

## 2. 기본개념
### 2-1. 관찰자(Observer) 패턴
* Subject와 Observer 두 개의 인터페이스로 구성된다
* Observer는 관찰자 이며, Subject는 주체이다. Observer는 Subject에 등록되며 Subject로 부터 알림을 수신한다.

![Observer 패턴](./../../images/spring_reactive/observer_pattern.png)

* java.util 패키지에서 Observer, Observable 제공
* JDK 1.0에 릴리즈, 제네릭이 없어 type safety 하지 못함
* 옵저버 패턴은 멀티스레드 환경에서 효율적이지 않다

```java
private final ExecutorService executorService = Executors.newCacheThreadPool(); 
public void notifyObservers(String event) { 
    observers.forEach(observer -> { executorService.submit(() -> observer.observe(event)); }); 
}
```

   - 스레드 풀 크기로 인해 OutOfMemoryError가 발생 가능하다
   - 클라이언트가 executor가 현재의 작업을 마치기도 전에 새로운 작업을 예약하도록 요청하는 상황에서 점점 더 많은 수의 스레드를 생성할 수 있다.
   - 각 스레드는 자바에서 약 1MB를 소비하므로 일반 JVM 응용 프로그램은 단 몇천 개의 스레드만으로 사용 가능한 메모리를 모두 소모할 수 있다.
실제로 자바 9에서 더 이상 사용되지 않는다

### 2-2. 발행-구독(Publish-Subscribe)
* 스프링 프레임워크는 @EventListener 애노테이션과 이벤트 발행을 위한 ApplicationEventPublisher를 제공한다. 이는 발행-구독 패턴이다.

![Publish-Subscribe 패턴](./../../images/spring_reactive/Publish_Subscribe_pattern.png)

* 옵저버 패턴과 다른점은 Publisher와 Subscriber사이 간접접인 계층이 존재한다는 것
* 이를 이벤트 채널, 메시지 브로커, 이벤트 버스라고 부른다.
* 필터링 및 라우팅은 메시지 내용이나 메시지 주제, 때로는 둘 다에 의해 발생할 수 있다.
* 토픽 기반 시스템(topic-based system)의 구독자는 관심 토픽에 게시된 모든 메시지를 수신할 수 있다.

#### 발행-구독 모델 예제
* SseEmitter를 이용해 스프링 프레임워크를 브로커로 두고 발행-구독 모델 생성가능하다.
* 그러나 이 프로그램은 수명 주기 이벤트를 위해 도입된 것이지 고부하 및 고성능 시나리오를 위한 것은 아니다.
* 또 다른 단점 로직 구현을 위헤 스프링 내부 메커니즘 사용, 변경시 안정성이 보장되지 못한다.
* @EventListener는 스트림의 종료와 오류 처리에 대한 구현을 추가할 수 없다.

### 2-3. 리액티브 프레임워크 RxJava
* RxJava 1.x 버전은 자바 플랫폼에서 리액티브 프로그래밍을 위한 표준 라이브러리였다.
* 현재 Akka Stream, 리액터 프로젝트 등이 더 존재한다.
* RxJava 라이브러리는 Reactive Extensions(ReactiveX라고도 함)의 자바 구현체이다.
* Reactive Extension은 동기식 또는 비동기식 스트림과 관계없이 명령형 언어를 이용해 데이터 스트림을 조작할 수 있는 일련의 고우이다.
* ReativeX는 종종 옵저버 패턴, 반복자 패턴 및 함수형 프로그래밍의 조합으로 정의된다.

```java
package rx; 
public interface Observer<T> { 
    void onCompleted(); 
    void onError(Throwable var1); 
    void onNext(T var1); 
}

package rx;
public interface Observer<T> {
	void onCompleted();
    void onError(Throwable var1); 
    void onNext(T var1); 
}
```

![Publish-Subscribe 패턴](./../../images/spring_reactive/Observable_observer.png)

   - Observable은 0을 포함해 일정 개수의 이벤트 보낼 수 있다
   - 연결된 각 구독자에 대한 Observable은 onNext()를 여러 번 호출한 다음 onComplete() 또는 onError()를 호출한다
   - onComplete() 또는 onError()가 호출된 이후에는 onNext()가 호출되지 않는다

#### RxJava 사용의 전제 조건 및 이점
* 핵심 개념은 구독자가 관찰 가능한 스트림에 가입한 후, 비동기적으로 이벤트를 생성해 프로세스를 시작한다.
* RxJava를 사용하는 접근 방식은 응용 프로그램의 응답성을 크게 높여준다.
   - 최초 데이터 수신 시간(Time To First Byte)
   - 주요 렌더링 경로(Critical Rendering Path)
* 메트릭 성능 평가시 더 좋은 결과를 가져온다.

## 3. 스트림의 새로운 표준
* CompletionStage를 이용하는 자바 코어 라이브러리 RxJava와 같은 다양한 라이브러리 존재
* 코드 작성시 다양한 선택 가능

### 3-1. 풀 방식과 푸시 방식
* 리액티브 초기 단계에서 모든 라이브러리의 데이터 흐름은 소스에서 구독자에서 푸시되는 방식이었다.
* 푸시 모델을 채택하는 가장 큰 이유는 요청하는 횟수를 최소화 하기 위해서이다.
* 반면 푸시 모델만 사용하는것은 기술적 한계가 있다.
   - 메시지 기반 통신의 본질은 요청에 응답하는 것
   - 프로듀서가 컨슈머의 처리 능력을 무시하면 전반적인 시스템 안정성에 영향을 미칠 수 있다

#### 프로듀서 컨슈머 동작 케이스
##### 1. 느린 프로듀서 빠른 컨슈머
* 동적으로 시스템의 처리량을 증가시키는 것은 불가능 (프로듀서가 따라와줘야함)

##### 2. 빠른 프로듀서와 느린 컨슈머
* 프로듀서가 컨슈머가 처리할 수 있는 것보다 훨씬 많은 데이터 전송
* 부하를 받는 컴포넌트에 치명적인 오류가 발생가능
* 처리되지 않은 원소를 큐에 수집하는 방식으로 처리. 3가지 방식 존재
> 1. 무제한 큐 - 메모리 한도 도달시 전체 시스템에 손상
> 2. 크기가 제한된 드롭 큐 - 데이터 세트가 변경됨. 메시지의 중요성이 낮을 때 주로 사용
> 3. 크기가 제한된 블록킹 큐 - 한계에 다다르면 메시지 유입 차단. 블록킹 모델로 리액티브 성격에 반한다
* 해결책은 배압 제어 메커니즘

### 3-2. 리액티브 스트림의 기본 스펙

* package org.reactivestreams

```xml
<dependency>
    <groupId>org.reactivestreams</groupId>
    <artifactId>reactive-streams</artifactId>
    <version>1.0.3</version>
</dependency>
```

* Publisher (RxJava의 Observable)

```java
public interface Publisher<T> {
	public void subscribe(Subscriber<? super T> s);
}
```

* Subscriber (RxJava의 Observer)

```java
public interface Subscriber<T> {
	void onSubscribe(Subscription s); // Invoked after calling Publisher#subscribe
	void onNext(T t);
	void onError(Throwable t);
	void onComplete();
}
```

* Subscription (신규 인터페이스)
원소 생성을 제어하기 위한 기본적인 사항 제공

```java
public interface Subscription {
	void request(long n);
	void cancel();
}
```

* org.reactivestreams는 하이브리드 푸시-풀 모델을 제공한다.
* 순수 푸시 모델을 사용하고 싶은 경우 최대 개수 요소 요청 request(Long.MAX_VALUE)
* 순수 풀 모델을 사용하고 싶은 경우 onNext()가 호출 될 때 마다 요청하면 된다.

* Processor

```java
public interface Processor<T, R> extends Subscriber<T>, Publisher<R> {
}
```

### 3-3. JDK 9
* 더그 리(Doug Lee)가 JDK 9에 리액티브 스트림 스펙을 추가하자는 제안을 했다
* java.util.concurrent.Flow 클래스 내 정적 하위 클래스로 제공됨 (JDK 9)
* 하지만 이전에 많은 프로젝트는 org.reactivestreams.* 패키지에 제공된 스펙을 사용하고 있었다.
* FlowAdapters를 통해 가능하다

```java
Flow.Publisher jdkPublisher = ...;
Publisher external = FlowAdapters.toPublisher(jdkPublisher);
Flow.Publisher jdkPublisher2 = FlowAdapter.toFlowPublisher(external);
```

### 3-4. 리액티브 스트림을 활용한 비동기 및 병렬 처리
#### 리액티브 스트림 API 규칙
* Publisher, Subscriber가 생성 소비한 모든 신호는 처리중에 논블로킹이어야 하며 방해받지 않아야 한다.
* on*** 메서드의 호출은 스레드 안전성을 보장하는 방식으로 신호를 보내야 하며, 다중 스레드에서 수행되는 경우 외부적인 동기화를 사용해야 한다.
* 스트림의 요소를 병렬로 처리할 수 없다...
* 자원을 효율적으로 활용하기 위해 스트림 처리 파이프를 독립적인 스레드에 할당해 처리하도록 할 수 있다.

##### 일반적인 스트림 처리 파이프
>                < 처리 흐름 >
> 소스   →   필터 → (이외 작업들) → 맵   →   목적지

##### 소스와 목적 데이터 사이의 비동기 처리 부분
* 두개의 스레드 사용 (처리 흐름을 소스와 함께)
* 사용 케이스: 원본 리소스가 목적지 리소스보다 더 적게 로드될 때
> 소스   →   필터 → (이외 작업들) → 맵   →   목적지
> (              스레드 A                ) (스레드 B)

* 두개의 스레드 사용 (처리 흐름을 목적지와 함께)
* 사용 케이스: 목적지 리소스가 원본 리소스보다 더 적게 로드될 때
> 소스   →   필터 → (이외 작업들) → 맵   →   목적지
> (스레드 A)(              스레드 B                 )

* 각 컴포넌트 간 비동기 처리경계
* 사용 케이스: 메시지 생산과 소비가 모두 CPU 집약적인 작업일 때
> 소스   →   필터   →   (이외 작업들)   →   맵   →   목적지
> (스레드 1)(스레드 2)    ( ... )     (스레드 N-1) (스레드 N)

### 3-5. 리액티브 전망의 변화
#### RxJava
* RxReactiveStream 클래스로 리액티브 타입을 변환해주는 추가 모듈 제공
```xml
<dependency>
    <groupId>io.reactivex</groupId>
    <artifactId>rxjava-reactive-streams</artifactId>
    <version>1.2.1</version>
</dependency>
```

#### 또 다른 리액티브 라이브러리
* Vert.x
* Ratpack
* (리액티브 스트림 기반의) MongoDB 드라이버

#### 리액티브 기술 조합
* 리액티브 스트림 스펙은 연산자 사이에 여러 통신 수단을 허용한다
* 이러한 유연성을 비동기 영역을 다양하게 배치할 수 있게 해준다
* 리액티브 라이브러리 공급자들이 이러한 부분을 책임지고 구현하도록 강제하고 있다


## 4. 리액티브 앱의 기초
### 4-1. 리액터 프로젝트 필수 요소
* 목적 - 콜백 지옥, 깊게 중첩된 코드를 생략
* 가독성을 높이고 리액터 라이브러리에 의해 정의된 워크플로에 조합성(composability)를 추가
* 리액트 API 연산자로 실행 그래프를 제작
* 실제 구독을 만들기 전까지 아무 일도 발생하지 않으며 구독을 했을 때만 데이터 플로가 기동
* 비동기 요청의 결과를 효율적으로 처리가능
* 오류 처리 간단, 복원력 있는 코드 작성 가능
* 배압 제공
   - 푸시 전용 : subscription.request(Long.MAX_VALUE)
   - 풀 전용 : subscription.request(1)
   - 풀-푸시 혼합
   - 풀-푸시 모델 미 지원하는 이전 API 사용 시 예전 스타일의 배압 메커니즘 제공

#### 리액터 추가

```xml
<dependency>
    <groupId>io.projectreactor</groupId>
    <artifactId>reactor-core</artifactId>
    <version>3.2.0.RELEASE</version>
</dependency>
<dependency>
    <groupId>io.projectreactor</groupId>
    <artifactId>reactor-test</artifactId>
    <version>3.2.0.RELEASE</version>
    <scope>test</scope>
</dependency>
```

### 4-2. 리액티브 타입 - Flux와 Mono
#### Flux
* 여러 요소를 생성할 수 있는 일반적인 리액티브 스트림을 정의
* onNext x 0..N [onError | onComplete]

#### Mono
* 최대 하나의 요소를 생성할 수 있는 스트림 정의
* onNext x 0..1 [onError | onComplete]
* Mono는 버퍼 중복과 값비싼 동기화 작업을 생략하여 Flux보다 효율적으로 사용 가능하다

#### CompletableFuture vs Mono
* CompletableFuture : 즉시 처리를 시작
* Mono: 구독자가 나타날 때까지 아무 작업도 수행하지 않는다.

### 4-3. 사용법
* 1. Flux, Mono 시퀀스 만들기
* 2. 리액티브 스트림 구독하기
    subscribe()
* 3. 사용자 정의 Subscriber 구현하기
    subscriber 인터페이스 구현
* 4. 연산자를 이용해 리액티브 시퀀스 변환하기
> 매핑, 필터링, 수집, 원소 줄이기
> 스트림 조합 - concat, merge, zip, combineLatest
> 일괄처리 - buffer, windowing, grouping
> flatMap, concatMap, flatMapSequential
> 샘플링 - sample
> 블로킹 구조로 변환 - toIterable, toStream, blockFirst, blockLast
> 시퀀스 처리동안 처리 내역 확인 - doOnNext, doOnComplete, doOnSubscribe, doOnTerminate
> 적합한 연산자는 아래의 링크 참고

### 4-4. Hot 스트림과 cold 스트림
#### 콜드 퍼블리셔(cold publisher)
* 구독자가 나타날 때마다 해당 구독자에 대해 모든 시퀀스 데이터가 생성
* 구독자 없이는 데이터가 생성되지 않는다
* 구독자가 나타날 때마다 새로운 시퀀스가 생성 - HTTP 요청과 비슷한 동작

#### 핫 퍼블리셔 (hot publisher)
* 데이터 생성은 구독자의 존재 여부에 의존하지 않는다
* 첫 번째 구독자가 구독을 시작하기 전에 원소를 만들어 내기 시작할 수 있다
* 구독자가 나타나면 이전에 생성된 값을 보내지 않고 새로운 값만 보낼 수 있다
* 이전의 기록은 보내지 않고 이후 업데이트만 보낸다

#### 그 외
* 리액터 라이브러리에 포함된 대부분 핫 퍼블리셔는 processor 인터페이스를 상속한다
* 팩토리 메서드 just는 게시자가 빌드될 때 값이 한 번만 계산되고 새 구독자가 도착하면 다시 계산되지 않는 형태의 핫 퍼블리셔를 생성한다.
* just는 defer로 래핑해 콜드 퍼블리셔로 전환할 수 있다.
* 스트림 원소를 여러 곳으로 보내기 - cold
    Flux.publish - ConnectableFlux

* 스트림 내용 캐싱하기 - cold
    Flux.cache

* 스트림 내용 공유 - hot
    Flux.share
---
layout: single
title:  "[Reactive] - 리액티브 프로그래밍"
excerpt: "리액티브 프로그래밍"

categories:
  - Spring Reactive
tags:
  - [Reactive]

toc: true
toc_sticky: true
 
date: 2022-03-02
last_modified_at: 2022-03-02
---
# Reactive Programming : 리액티브 프로그래밍이 뭔가요

https://juneyr.dev/reactive-programming

그날이 왔다. 여러가지 api 콜을 합쳐서 다시 하나의 응답으로 만들어 내보내주는 코드를 보는데, 이해를 전혀 못하겠는 때가.. 그래서 이번주는 Reactive Programming 101이다.

처음에 구현체로 내가 마주한 건 바로 Project Reactor다. Project Reactor 는 Spring 프레임워크를 만든 pivotal에서 제공하는 오픈소스 프로젝트로, 자바/스프링 환경에서의 리액티브 프로그래밍을 할 수 있게해준다. Reactive Stream 규약을 기반으로, Reactive X 에서 영감받은 방식의 프로그래밍을 구현한 프로젝트다.

실제로 구현체를 열심히 뜯어봤자, 개념을 모르면 잘 못쓴다는 걸 이제 2년차의 킴은 알고 있기때문에, 리액티브 프로그래밍 개념을 간단히 짚고 넘어가자🤓

리액티브 프로그래밍
모던 자바 인 액션에서는 리액티브 프로그래밍이 등장한 배경을 간략하게 설명한다. 수년 전 까지, 우리가 생각하는 대규모 어플리케이션은 그냥 수십대의 서버를 운용하고, GB 정도의 데이터, 몇초정도 걸리는 응답시간, 유지보수는 몇시간 정도 걸리는 것이 당연했다. 하지만 지금은 어떤지 생각해보자. 🤔 성질 급한 나는 수초의 응답이 걸리는 페이지는 그냥 닫아버린다.

이렇게 환경이 변화한데는 이유가 있는데,

빅데이터: 빅데이터는 보통 PB(페타바이트) 단위로 구성되고, 거기에 매일 증가해버린다.

다양한 환경: 비슷비슷한 디바이스가 아니라 작은 모바일 디바이스부터 수천 개의 멀티 코어 프로세서로 실행되는 클라우드 클러스터까지 ! 너무도 다양한 환경에 애플리케이션이 배포됨.

사용 패턴: 사용자는 1년 내내 항상 서비스를 사용할 수 있고, ms 단위의 응답시간을 기대한다. 👽

리액티브 프로그래밍에서는 다양한 소스에서 들어오는 데이터의 흐름(스트림)을 비동기적으로 합쳐서 이런 문제를 해결한다.

그래두.. 아직 어떨때 쓰면 좋은지 모르겠는데요? 🥺
우아한형제들 기술블로그 에서는 간단한 예제로 사용 이유를 설명하고 있다.

여러 API를 취합해서 전달해야하는 시스템에서는 SUM([각 API들의 경과시간]) 만큼 필요합니다. 반대로 리액티브로 진행할 경우, 여러 API 중 MAX([각 API들의 경과시간]) 이 필요합니다.

이전에 사용하던 것 처럼 sync 하고 blocking 하게 요청을 한다고 하자. API 요청이 n개가 있으면 이를 하나 호출하고 받을 때까지 다른일을 할 수 없기때문에 n개의 요청 시간을 모두 합친만큼 걸린다. 하지만 리액티브 시스템을 사용하면 요청을 비동기적으로 동시에 보내기때문에 이 중 가장 긴 요청 시간만큼만 걸린다.

리액티브 메니페스토 (선언)
리액티브 메니페스토는 리액티브 애플리케이션과 시스템 개발의 원칙을 공식적으로 정의하고 있다.

반응성(responsive) : 리액티브 시스템은 빠를 뿐 아니라 + 일정하고 예상가능한 반응 시간을 제공한다.
회복성(resilient) : 장애가 발생해도 시스템은 반응해야한다. 여러 컴포넌트의 시간과 공간 분리 (즉, 컴포넌트가 각각 독립적인 생명주기를 갖고 다른 프로세스에서 실행), 작업 위임시 비동기적으로 위임하는 등의 기법이 있다.
탄력성(elastic) : 애플리케이션의 생명주기 동안 다양한 부하를 받는데 이때 리액티브 시스템에서는 자동으로 관련 컴포넌트에 할당된 자원 수를 늘린다.
메시지 주도(message-driven) : 회복성과 탄력성을 지원하려면 약한 결합, 고립, 위치 투명성 등을 지원하도록 경계를 명확히 정의한다. 또한 비동기 메시지를 전달해 컴포넌트 간 통신이 이뤄진다.
리액티브 메니페스토
애플리케이션 수준의 리액티브
애플리케이션 수준 컴포넌트의 리액티브 프로그래밍의 기능은 비동기로 작업을 수행할 수 있다는 점이다. 잠깐 여기서 비동기/동기와 블로킹/논블로킹을 짚고가자.

async/sync vs blocking/non-blocking
비동기 (async) 적인 프로그래밍을 다루기 전에, 비동기/동기 그리고 블로킹 / 논-블로킹을 먼저 다뤄야한다.

간단히 생각해보면 async와 논 블로킹이 같은 개념이고, sync와 블로킹이 같은 개념처럼 느껴진다. 비동기로 일을 던져주면, 호출한 함수 A는 호출된 함수 B가 응답할 때까지 기다리지 않고(non-blocking)하게 일할 수 있으니까. 반대로 동기로 일을 던지면 호출된 함수 B가 다시 결과값을 넘겨줄 때까지 호출한 함수 A는 기다리는(blocking) 상태가 된다.

하지만 이 두가지 개념은 관점의 차이가 있다.

async

sync/async : 호출되는 함수 B의 작업완료 여부를 누가 신경쓰느냐가 주제다.

호출하는 함수 A가 호출된 함수 B의 작업 완료 후 리턴을 기다리거나, 혹은 바로 리턴받더라도 작업 완료 여부를 A가 직접 신경쓰면 sync
B에게 callback을 전달해서, B의 작업이 완료될 때 B가 callback을 실행하고, A는 그때서야 받는 구조. 즉 A가 작업의 완료 여부를 신경스지 않으면 async
blocking
blocking/non-blocking: 호출되는 함수가 바로 리턴하느냐, 마느냐

호출된 함수 B가 바로 리턴해서 A에게 다시 제어권을 넘겨주고, A가 다른 일을 할 기회를 준다면 non-blocking
호출된 함수가 자신의 작업을 마칠때까지 대기하게 만든다면 blocking
다시 돌아와서, 이벤트 스트림을 블록하지 않고 비동기로 처리하는 것이 최신 멀티코어 CPU의 사용률을 극대화 할 수 있는 방법이다. 스프링 5 이전 (리액티브 프로그래밍을 하기 이전) 오랫동안 자바 개발자에게 동시성 = 많은 쓰레드 였다. 쓰레드 별로 다른 일을 하도록하면 쓰레드 갯수만 늘리면 동시에 여러 일을 처리하게 할 수 있었으니까. 그런데 시스템이 점점 분산되고(MSA) API 호출, 데이터 액세스등의 이유로 IO 수행시간이 늘어났다.(=쓰레드 점유)

많은 쓰레드로 해결을 할 때는 몇가지 문제가 있다. CPU와 메모리가 충분해도 쓰레드가 부족하면 처리율이 내려가고, 쓰레드를 늘리면 CPU와 메모리에 엄청난 부하가 간다. 쓰레드를 변경할 때 사용되는 비용이 CPU 에 부하를 주기때문에 이 역시 문제다. 쓰레드는 그래서 상대적으로 비싸고 희귀한 자원이다.

리액티브 프레임워크와 라이브러리는 쓰레드를 퓨처, 액터, 일련의 콜백을 발생시키는 이벤트 루프등과 공유하고 처리할 이벤트를 변환하고 관리한다. 이 기술은 쓰레드보다 가볍다 🕊 !

거기에 별도로 지정된 스레드 풀에서 블록 동작을 실행시켜서, 스레드 블록의 문제를 해결한다. 메인 풀의 모든 스레드는 방해받지 않고 실행되므로 가장 최적의 상황에서 동작할 수 있다.

시스템 수준의 리액티브
리액티브 시스템은 여러 애플리케이션이 하나의 일관적이며 회복이 가능한 플랫폼을 구성해주는 아키텍처를 말한다. 시스템 수준에서는, 애플리케이션을 조립하고 상호 소통을 조절한다. 이런 과정에는 메시지 주도 (message-driven) 이 사용된다.

메시지는 정의된 목적지 하나만 바라보고 가는 반면, 이벤트는 옵저버들이 모두 수신한다는게 다른점이다. 리액티브 시스템에서는 수신자, 발신자가 수신 메시지와 발신 메시지와 강하게 결합하지 않고, 독립적인 구조를 유지하도록 메시지를 비동기로 처리한다. 그래야 시스템이

(장애로부터의) 회복성
(높은 부하로부터의) 탄력성
에서도 반응성을 유지할 수 있다.

시스템에서 장애가 발생했을 때, 리액티브 시스템은 성능이 저하되는 것이 아니라 문제를 완전히 고립시켜서 시스템을 복구한다. 예를 들어 에러 전파를 방지하고, 메시지 방향성을 바꾸어 다른 컴포넌트로 보내는 등 감독자 역할을 수행해서 문제를 고립시킬 수 있다. 이렇게 하여, 컴포넌트 자체로 문제가 한정되고, 외부로는 안정성을 보장할 수 있다.

회복성은 고립, 비결합 이 핵심이다. 그리고 탄력성의 핵심은 위치 투명성이다 위치 투명성은 리액티브 시스템의 모든 컴포넌트가 다른 모든 서비스와 통신할 수 있음을 의미한다. 위치에 상관없이 모두 서로 통신이 가능하기때문에 시스템을 복제할 수 있으며, 작업 부하에 따라 자동으로 애플리케이션을 확장할 수 있다.

프로그래밍에서의 리액티브 : 리액티브 프로그래밍
리액티브 프로그래밍은 리액티브 스트림을 사용하는 프로그래밍이다. 리액티브 스트림은 무한(이라고 생각 할 수 있는)의 비동기 데이터가 순서대로, 그리고 블록하지 않는 역압력(backpressure)를 전제해 처리하는 표준 기술이다. ..역압력은 뭐야? 역압력은 pub-sub 프로토콜에서 이벤트 스트림의 subscriber가 이벤트를 소비하는 속도 < publisher가 이벤트를 발행하는 속도 를 보장해서 문제가 발생하지 않도록 하는 장치를 말한다. 이래야, 부하가 발생한 컴포넌트가 완전 불능이 되거나 예기치 않게 이벤트를 잃어버리는 등의 문제가 발생하지 않는다. 역압력은 즉, 비동기 작업이 실행되는 동안 암묵적으로 블록 API를 사용해서 제공한다. 이런 기법은, subscriber가 스레드를 블록하지 않고도 감당 못할만큼의 데이터를 받는일을 방지한다.

리액티브 스트림 프로젝트는 넷플릭스, 레드햇, 트위터 등의 쟁쟁한 회사들이 참여해서 최소 기능 집합을 네개의 인터페이스로 정의했다. Java9 의 Flow 클래스 뿐 아니라 위에서 말한 Spring reactor, RxJava(넷플릭스) 등 많은 서드 파티에서 이 인터페이스를 구현한다.

Java 9의 Flow 클래스로 리액티브 프로그래밍 맛만 보기
Java 9에서는 리액티브 프로그래밍을 제공하는 클래스 java.util.concurrent.Flow 를 추가했다.
flow class

이 안에는 4개의 인터페이스가 포함되어있다.

Publisher: 아이템(메시지) 의 발행자입니다. 이 메시지들은 하나의 흐름(current)에 실려서 나가고, 같은 아이템이 같은 순서로 나가는 것을 보장합니다.
publisher

Subscriber : 메시지의 구독자입니다. 메시지들을 정상적으로 수신하면, onNext 함수로 하나하나 볼 수 있고, publisher가 메시지를 정상 발행하지 못하는 경우 onError가 호출됩니다.
subscriber

Subscription : publisher와 subscriber를 잇는 메시지 컨트롤을 합니다. subscription의 request(갯수) 메소드를 사용하면 current에서 갯수만큼 메시지를 가져옵니다.
subscription

Processor : Publisher와 Subscriber 역할을 둘다 할 수 있는 인터페이스입니다. 기본적으로 버퍼를 갖고 있으므로, 중간에 pub-proc-sub 의 구조로 둔다면 메시지를 가공하거나 잠시 유지할 수 있습니다.
processor
자바 Flow, RxJava
자바 Flow 클래스에 정의된 인터페이스는 직접 구현하도록 의도한게 아닌데... 구현체는 없다. 도대체 이게 뭐냐! Akka나 RxJava 등의 리액티브 라이브러리는 이 인터페이스를 구현해줬다.

넷플릭스에서 개발한 RxJava 예제로 리액티브 애플리케이션관련 예제를 좀더 알아보자. RxJava에서 publisher의 구현체는 Observable 이다. 한편 subscriber의 구현체는 Observer이다.

import java.lang.concurrent.Flow.*; // Flow API 는 이렇게 import하는데 

// RxJava
import io.reactivex.Observable; // RxJava는 이렇게 사용한다.
RxJava는 역압력 기능이 적용된 Flowable을 2.0에서 출시했다. Flowable 역시 똑같은 구현체인데, Observable과는 역압력 기능에서의 차이만 있다. 여기서는 Observable 예제를 살펴본다. 다음처럼 미리 정의한 요소로 Observable을 만들 수 있다.

Observable<String> strings = Observable.just("first", "second");

Observable<Long> onePersec = Observable.interval(1, TimeUnit.SECONDS);
// 1초 간격으로 Long 값을 반환한다. 이때 값은 계속 증가.
위에서 말한 Observer와 Observable을 좀더 살펴보자. Observer 인터페이스는 자바9의 subscriber 와 같은 메서드를 갖고 있다.

public interface Observer<T> {
   void onSubscribe(Disposable d);
   void onNext(T t);
   void onError(Throwable t);
   void onComplete();
}
RxJava API 는 훨씬 유연한데, 오버로드된 기능이 많아 Observer를 만들때onNext 메서드 에서 쓸 람다만 전달해도 된다.

onePerSec.subscribe(i -> System.out.println(TempInfo.fetch("New York")));
onePersec observable은 초당 한개의 이벤트를 발생하도록 위에 생성해줬다. observable.subscirber(observer) 의 형태를 띄고 있고, observer는 람다를 전달받아 onNext만 정의된 상태다. 즉 위 코드에서 observer는 onNext함수만 구체화된 상태다. 그 내용은 바로 onNext를 받을 때 뉴욕의 온도를 가져와서 프린트하자. 🙋‍♀️ 인것이고.

그런데 매번 굳이 구독자가 뉴욕 서울을 지정해서 가져와야햘까? 아니다. 정보를 방출(emit) 하는 쪽에서 파라미터를 받아서 원하는 정보를 가져오게 하면 된다.

public static Observable<TempInfo> getTemperature(String town) {
    return Observable.create(emitter -> Observable.interval(1, TimeUnit.SECONDS).subscribe(i -> {
      if (!emitter.isDisposed()) {
        if (i >= 5) {
          emitter.onComplete();
        }
        else {
          try {
            emitter.onNext(TempInfo.fetch(town));
          }
          catch (Exception e) {
            emitter.onError(e);
          }
        }
      }
    }));
  }
emitter는 구독은 못하는 Observable이다. (onSubscribe가 없음) 이 코드로 Observer에게 직접 TempInfo를 전달할 수 있다.

그러면 observer 측에서는 다음과 같이 받아서 출력만 하면 된다.

public class TempObserver implements Observer<TempInfo> {

  @Override
  public void onComplete() {
    System.out.println("Done!");
  }

  @Override
  public void onError(Throwable throwable) {
    System.out.println("Got problem: " + throwable.getMessage());
  }

  @Override
  public void onSubscribe(Disposable disposable) {}

  @Override
  public void onNext(TempInfo tempInfo) {
    System.out.println(tempInfo);
  }

}
Observable을 합치기 RxJava는 flow의 processor보다 훨씬 풍부한 기능을 제공한다. 한 스트림을 다른 스트림의 입력으로 사용할 수 있고, 필터링, 매핑의 동작이 가능하다.

이런 동작중의 하나인 merge를 살펴보자. merge는 서로 다른 Observable이 마치 하나의 Observable인 것 처럼 합쳐준다. merge

코드로는 이렇게 쓴다.

public static Observable<TempInfo> getCelsiusTemperatures(String... towns) {
    return Observable.merge(Arrays.stream(towns)
        .map(TempObservable::getCelsiusTemperature)
        .collect(toList()));
  }
이런 식으로 Rxjava에는 다양한 도구들이 있으니 한번 보고 활용할 가치가 있다.

map
public static Observable<TempInfo> getCelsiusTemperature(String town) {
    return getTemperature(town)
        .map(temp -> new TempInfo(temp.getTown(), (temp.getTemp() - 32) * 5 / 9));
  }
filter
public static Observable<TempInfo> getNegativeTemperature(String town) {
    return getCelsiusTemperature(town)
        .filter(temp -> temp.getTemp() < 0);
  }
마무리하며
원래는 Spring reactor를 꼼꼼하게 뜯어보려고 시작한 글이었는데, 리액티브의 개념을 제대로 알지 못해서 결국 개념을 파다보니 글이 길어졌다. 다음 글은 Spring reactor로 연결하려고한다. ☺️

참고
모던 자바 인 액션(2019, 한빛미디어) https://woowabros.github.io/experience/2019/03/18/tech-toby-reactive.html https://homoefficio.github.io/2017/02/19/Blocking-NonBlocking-Synchronous-Asynchronous/

https://tech.kakao.com/2018/05/29/reactor-programming/

https://javacan.tistory.com/entry/Reactor-Start-1-RS-Flux-Mono-Subscriber

https://luvstudy.tistory.com/100
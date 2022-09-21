---
layout: single
title:  "[WEB] - WebSocket"
excerpt: "WebSocket 과 WebRTC"

categories:
  - web-5
tags:
  - [WebSocket, WebRTC]

toc: false
toc_sticky: false
 
date: 2022-09-20
last_modified_at: 2022-09-20
---

# WebSocket
- 기존의 단방향 HTTP 프로토콜과 호환되어 양방향 통신을 제공하기 위해 개발된 프로토콜.
- 일반 Socket통신과 달리 HTTP 80 Port를 사용하므로 방화벽에 제약이 없다.
- 접속까지는 HTTP 프로토콜을 이용, 그 이후 통신은 자체적인 WebSocket 프로토콜로 통신.

웹 소켓은 HTTP(Hyper Text Transfer Protocol)를 사용하는 네트워크 데이터 통신의 단점을 보완하는데 그 목적이 있다. HTTP를 다뤄본 적이 있다면, HTTP는 HTML이라는 문서를 운반하기 위한 프로토콜로 다음과 같이 동작한다.

![websocket](./../../images/sr_web/websocket_1.png)

- RFC 6455 명세서에 정의된 프로토콜인 웹소켓(WebSocket)을 사용 서버와 브라우저 간 연결을 유지한 상태로 데이터를 교환
- 데이터는 ‘패킷(packet)’ 형태로 전달되며, 전송은 커넥션 중단과 추가 HTTP 요청 없이 양방향으로 이뤄짐.
- 이런 특징 때문에 웹소켓은 온라인 게임이나 주식 트레이딩 시스템같이 데이터 교환이 지속적으로 이뤄져야 하는 서비스에 매우 적합.
- 웹소켓 커넥션을 만들려면 new WebSocket을 호출하면 되는데, 이때 ws라는 특수 프로토콜을 사용.

```
  let socket = new WebSocket("ws://javascript.info");
```

- ws말고 wss://라는 프로토콜도 있는데, 두 프로토콜의 관계는 HTTP와 HTTPS의 관계와 유사.

- wss://는 보안 이외에도 신뢰성(reliability) 측면에서 ws보다 좀 더 신뢰할만한 프로토콜.
> ws://를 사용해 데이터를 전송하면 데이터가 암호화되어있지 않은 채로 전송되기 때문에 
> 데이터가 그대로 노출. 아주 오래된 프락시 서버는 웹소켓이 무엇인지 몰라서 
> ‘이상한’ 헤더가 붙은 요청이 들어왔다고 판단하고 연결을 끊어버림.
>
> 반면 wss://는 TSL(전송 계층 보안(Transport Layer Security))이라는 보안 계층을 통과해 
> 전달되므로 송신자 측에서 데이터가 암호화되고, 복호화는 수신자 측에서 이뤄지게 됨. 
> 따라서 데이터가 담긴 패킷이 암호화된 상태로 프락시 서버를 통과하므로 
> 프락시 서버는 패킷 내부를 볼 수 없게 됨.

- 소켓이 정상적으로 만들어지면 이하 네 개의 이벤트를 사용가능.

  - open : 커넥션이 제대로 만들어졌을 때 발생함
  - message : 데이터를 수신하였을 때 발생함
  - error : 에러가 생겼을 때 발생함
  - close : 커넥션이 종료되었을 때 발생함

- 커넥션이 만들어진 상태에서 무언가를 보내고 싶으면 socket.send(data) 사용.

**WebSocket이 존재하기 전에는 Polling이나 Long Polling 등의 방식 사용.**

## polling

![websocket](./../../images/sr_web/websocket_2.gif) 

- 클라이언트가 평범한 HTTP Request를 서버로 계속 요청해 이벤트 내용을 전달받는 방식. 
- 가장 쉬운 방법이지만 클라이언트가 지속적으로 Request를 요청하기 때문에 클라이언트의 수가 많아지면 서버의 부담이 급증. 
- HTTP Request Connection을 맺고 끊는 것 자체가 부담이 많은 방식이고, 클라이언트에서 실시간 정도의 빠른 응답을 기대하기 어려움.

## Long polling

![websocket](./../../images/sr_web/websocket_3.gif) 

- 클라이언트에서 서버로 일단 HTTP Request를 요청후  이 상태로 계속 기다리다가 서버에서 해당 클라이언트로 전달할 이벤트가 있다면 그 순간 Response 메세지를 전달하며 연결이 종료.
- 응답수신 후 클라이언트가 다시 HTTP Request를 요청해 서버의 다음 이벤트를 기다리는 방식. 
- polling보다 서버의 부담이 줄겠으나, 클라이언트로 보내는 이벤트들의 시간간격이 좁다면 polling과 별 차이 없게 되며, 다수의 클라이언트에게 동시에 이벤트가 발생될 경우 서버의 부담이 급증.

## HTTP/2 + SSE
- HTTP/2 서버 푸시는 서버가 클라이언트 캐시에 리소스를 사전에 전송하는 것으로 웹소켓처럼 어플리케이션 코드에서 이벤트로 가져올 수 없다.

![websocket](./../../images/sr_web/how-javascript-work-9.9492a47e.png) 

- 실시간 서비스를 위해서는 Server-Sent Events (SSE)를 사용.
- SSE는 커넥트가 되어 있으면 서버가 데이터를 푸시 할 수 있다. (one-way publish-subscribe model)
- 클라이언트는 객체를 서버로 부터 스트림을 받아 EventSource로 데이터를 수신.

  ```
    var es = new EventSource(stream_url);

    es.onmessage = function (event) {
        // 이벤트 설정이안된 기본 데이터 처리
    };
    es.addEventListener('myevent', function(e) {
        // 'myevent' 이벤트의 데이터 처리
    }, false);
  ```

- http2는 멀티플랙스로 한 연결에 SSE 스트림을 동시에 여러개 포함할 수 있다. 

![websocket](./../../images/sr_web/how-javascript-work-11.15593463.png) 

- 양쪽으로 많은 양의 메세지가 교환되고 멀티 플레이어인 경우, 지연시간이 낮아서 실시간을 기대하는 상황에서는 websocket이 어울리지만 뉴스라던가 데이터를 열람하는 서비스이라면 HTTP2 + SSE를 사용해도 좋다.

- 웹소켓은 HTTP연결을 변경시켜 사용하기 때문은 기존 웹 인프라와 호환성 문제를 걱정해야하고 HTTP2 + SSE는 브라우저 호환성이 웹소켓보다 좋지 않다.

- 단점 1. 브라우저에서 최대 동시 접속 수는 HTTP/1.1의 경우 6개, HTTP/2는 100개까지 가능.
- 단점 2. 클라이언트에서 페이즈를 닫아도 서버에서 감지불가.

# WebSocket 동작방식
웹소켓은 HTTP로 Handshake를 한 후 ws로 프로토콜을 변환하여 웹소켓 프레임을 통해 데이터를 전송합니다. 웹소켓은 양방향 통신(full-duplex)을 지원하며, 그래서 요청과 응답을 구분하지 않습니다.

![websocket](./../../images/sr_web/websocket_4.png)

- 붉은 박스로 표시된 Opening Handshake
- 노란 박스로 표시된 Data transfer
- 보라색 박스로 표시된 Closing Handshake, 
 
### Opening Handshake
웹소켓 클라이언트에서 핸드쉐이크 요청(HTTP Upgrade)을 전송하고 이에 대한 응답으로 핸드 셰이크 응답을 받는데, 이때 응답 코드는 101입니다. 101은 '프로토콜 전환'을 서버가 승인했음을 알리는 코드입니다.
이 과정에서 요청과 응답의 헤더를 살펴보겠습니다. ws://localhost:8080/chat 으로 접속하려고 한다고 가정합니다.
 
  ```
    GET /chat HTTP/1.1
    Host: localhost:8080
    Upgrade: websocket
    Connection: Upgrade
    Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
    Sec-WebSocket-Protocol: chat, superchat
    Sec-WebSocket-Version: 13
    Origin: http://localhost:9000
  ```

- Upgrade : 프로토콜을 전환하기 위해 사용하는 헤더. 웹소켓 요청 시에는 반드시 websocket이라는 값을 가지며, 이 값이 없거나 다른 값이면 cross-protocol attack이라고 간주하여 웹소켓 접속을 중지시킵니다.  
- Connection : 현재의 전송이 완료된 후 네트워크 접속을 유지할 것인가에 대한 정보. 웹소켓 요청 시에는 반드시 Upgrade라는 값을 가지며, Upgrade와 마찬가지로 이 값이 없거나 다른 값이면 웹소켓 접속을 중지시킵니다. 
- Sec-WebSocket-Key : 유효한 요청인지 확인하기 위해 사용하는 키 값.  
- Sec-WebSocket-Protocol : 사용하고자 하는 하나 이상의 웹 소켓 프로토콜 지정. 필요한 경우에만 사용.
- Sec-WebSocket-Version : 클라이언트가 사용하고자 하는 웹소켓 프로토콜 버전.
- Origin : 모든 브라우저는 보안을 위해 이 헤더를 보냅니다(Cross-Site WebSocket Hijacking와 같은 공격을 피하기 위해서). 대부분 어플리케이션은 이 헤더가 없는 요청을 거부하며, 이러한 이유로 CORS정책이 만들어진 것입니다. 

이 외에도 여러 메시지나 서브 프로토콜, Referer나 Cookie와 같은 공통 헤더, 인증 헤더 등을 추가해 보낼 수도 있습니다. 
 
  ```
    HTTP/1.1 101 Switching Protocols
    Upgrade: websocket
    Connection: Upgrade
    Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
    Sec-WebSocket-Protocol: chat
  ```

  - Upgrade와 Connection은 요청과 동일합니다. 
  - Sec-WebSocket-Accept : 요청 헤더의 Sec-WebSocket-Key에 유니크 아이디를 더해서 SHA-1로 해싱한 후, base64로 인코딩한 결과. 웹소켓 연결이 개시되었음을 알립니다.

### Data Transfer
- 핸드쉐이크를 통해 웹소켓 연결이 수립되면, 데이터 전송 파트가 시작. 
- 클라이언트와 서버가 '메시지'라는 개념으로 데이터를 주고받는데, 여기서 메시지는 한 개 이상의 '프레임'으로 구성. 
- 프레임은 텍스트(UTF-8) 데이터, 바이너리 데이터, 컨트롤 프레임(프로토콜 레벨의 신호) 등이 있음
- 핸드 셰이크가 끝난 시점부터 서버와 클라이언트는 서로가 살아 있는지 확인하기 위해 heartbeat 패킷을 보내며, 주기적으로 ping을 보내 체크. 서버와 클라이언트 양측에서 설정 가능. 


### Close Handshake
- 클라이언트와 서버 모두 커넥션을 종료하기 위한 컨트롤 프레임을 전송가능. 
- 이 컨트롤 프레임은 Closing Handshake를 시작하라는 특정한 컨트롤 시퀀스를 포함.
- 서버가 커넥션을 종료한다는 프레임을 보내고, 클라이언트가 이에 대한 응답으로 Close 프레임을 전송. 
- 웹소켓 연결이 종료됩니다. 연결 종료후 수신되는 모든 추가적인 데이터는 버림. 

## WebSocket 단점
- 웹소켓을 지원하지 않는 브라우저 존재
- HTTP와 달리 Stateful 한 프로토콜이므로 연결을 항상 유지해야 하며, 비정상적으로 연결이 끊겼을 때에 대한 대응이 필요
- 개발 복잡도 증가
- Socket 연결을 유지하는 자체가 비용 발생

# socket.io
-  일정 간격마다 데이터를 받아오는 HTTP polling을 사용해 실시간 통신 기능을 구현하게끔 해주는 자바스크립트 라이브러리.
- xhr-polling 을 이용한 long-polling 연결 후 WebSocket 연결로 전환.
- 장점 1: 새로운 사람이 채팅방에 들어왔음을 연결된 모든 사용자들에게 한번에 알려야하는 경우, socket.io는 **연결된 모든 클라이언트에 메세지를 브로드캐스팅** 할 수 있지만 websocket은 연결된 사용자들의 리스트를 받아와서 한명씩 메시지를 보내야한다.
- 장점 2: 소켓 연결 실패 시 socket.io는 fallback을 통해 다른 방식으로 알아서 reconnect하지만 websocket은 reconnect를 시도하지 않는다.
- 단점 : 많은 비용, 자원, boilerplate코드

# WebRTC
Web Real-Time Communication의 약자로, 브라우저끼리 통신하여 중간자인 서버 없이 브라우저 간에 P2P 형태로 오디오, 영상, 데이터를 교환할 수 있게 하는 기술.

![webRTC](./../../images/sr_web/webrtc.jfif)

WebSocket과 대비되는 점은 아래와 같다.
- UDP Layer위에서 Peer to Peer 로 동작하는 데이터 전송 방식
- WebRTC는 영상, 오디오, 데이터 통신이 고성능, 고품질이도록 설계되었다.
- WebRTC는 브라우저간 직접 통신이므로, 훨씬 전송 속도가 빠름
- WebRTC는 네트워크 지연시간이 짧다.(Latency)
- 다만, WebRTC만으로 제어하기 어려운 부분이 있으므로 WebSocket, 또는 Socket.io 를 사용해 신호를 주고받을 수 있는 Signaling 서버는 필요하다.
- 현재 Zoom, Google Meet, 매일 쓰고있는 Gather.town 에서도 이 WebRTC를 이용하여 화상회의 기능을 구현하였다.
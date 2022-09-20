---
layout: single
title:  "[WEB] - 웹소켓 (WebSocket)"
excerpt: "웹소켓"

categories:
  - web-5
tags:
  - [web-5, websocket]

toc: false
toc_sticky: false
 
date: 2022-08-29
last_modified_at: 2022-08-29
---

# 웹소켓 (WebSocket)
  - RFC 6455 명세서에 정의된 프로토콜인 웹소켓(WebSocket)을 사용하면 서버와 브라우저 간 연결을 유지한 상태로 데이터를 교환가능. 
  - 데이터는 ‘패킷(packet)’ 형태로 전달되며, 전송은 커넥션 중단과 추가 HTTP 요청 없이 양방향으로 통신.

  - 웹소켓은 온라인 게임이나 주식 트레이딩 시스템같이 데이터 교환이 지속적으로 이뤄지는 서비스에 적합.

## 간단한 예시
  - 웹소켓 커넥션을 만들려면 new WebSocket을 호출하면 되는데, 이때 ws라는 특수 프로토콜을 사용.

``` javascript
  let socket = new WebSocket("ws://javascript.info");
```

- ws말고 wss://라는 프로토콜도 있는데, 두 프로토콜의 관계는 HTTP와 HTTPS의 관계와 유사.
- 항상 wss://를 사용합시다.
- wss://는 보안 이외에도 신뢰성(reliability) 측면에서 ws보다 좀 더 신뢰할만한 프로토콜.

- ws://를 사용해 데이터를 전송하면 데이터가 암호화되어있지 않은 채로 전송되기 때문에 데이터가 그대로 노출. 
- 아주 오래된 프락시 서버의 경우 웹소켓이 무엇인지 몰라서 ‘이상한’ 헤더가 붙은 요청이 들어왔다고 판단 연결을 끊어버립니다.

- 반면 wss://는 TSL(전송 계층 보안(Transport Layer Security))이라는 보안 계층을 통과해 전달되므로 송신자 측에서 데이터가 암호화되고, 복호화는 수신자 측에서 이뤄지게 됩니다. 따라서 데이터가 담긴 패킷이 암호화된 상태로 프락시 서버를 통과하므로 프락시 서버는 패킷 내부를 볼 수 없게 됩니다.

- 소켓이 정상적으로 만들어지면 아래 네 개의 이벤트를 사용할 수 있게 됩니다.

  * open – 커넥션이 제대로 만들어졌을 때 발생함
  * message – 데이터를 수신하였을 때 발생함
  * error – 에러가 생겼을 때 발생함
  * close – 커넥션이 종료되었을 때 발생함

- 커넥션이 만들어진 상태에서 무언가를 보내고 싶으면 socket.send(data)를 사용하면 됩니다.

``` javascript
  let socket = new WebSocket("wss://javascript.info/article/websocket/demo/hello");

  socket.onopen = function(e) {
    alert("[open] 커넥션이 만들어졌습니다.");
    alert("데이터를 서버에 전송해봅시다.");
    socket.send("My name is Bora");
  };

  socket.onmessage = function(event) {
    alert(`[message] 서버로부터 전송받은 데이터: ${event.data}`);
  };

  socket.onclose = function(event) {
    if (event.wasClean) {
      alert(`[close] 커넥션이 정상적으로 종료되었습니다(code=${event.code} reason=${event.reason})`);
    } else {
      // 예시: 프로세스가 죽거나 네트워크에 장애가 있는 경우
      // event.code가 1006이 됩니다.
      alert('[close] 커넥션이 죽었습니다.');
    }
  };

  socket.onerror = function(error) {
    alert(`[error] ${error.message}`);
  };
```

- 위 예시는 데모 목적을 위해 만들어놓은 간이 Node.js 서버(server.js)에서 돌아갑니다. 서버는 'Hello from server, Bora’라는 메시지가 담긴 응답을 클라이언트에 보내고, 5초 후 커넥션을 종료시킵니다.

- 서버 쪽 코드가 동작하면서 open → message → close 순의 이벤트를 볼 수 있었던 것이죠.

### 웹소켓 핸드셰이크
- new WebSocket(url)을 호출해 소켓을 생성하면 즉시 연결이 시작됩니다.
- 커넥션이 유지되는 동안, 브라우저는 (헤더를 사용해) 서버에 '웹소켓을 지원하나요?'라고 물어봅니다. 이에 서버가 '네’라는 응답을 하면 서버-브라우저간 통신은 HTTP가 아닌 웹소켓 프로토콜을 사용해 진행됩니다.

- 이번엔 new WebSocket("wss://javascript.info/chat")을 호출해 최초 요청을 전송했다고 가정하고, 이때의 요청 헤더를 살펴봅시다.

```
  GET /chat
  Host: javascript.info
  Origin: https://javascript.info
  Connection: Upgrade
  Upgrade: websocket
  Sec-WebSocket-Key: Iv8io/9s+lYFgZWcXczP8Q==
  Sec-WebSocket-Version: 13
```

Origin – 클라이언트 오리진(예시에선 https://javascript.info)을 나타냅니다. 서버는 Origin 헤더를 보고 어떤 웹사이트와 소켓통신을 할지 결정하기 때문에 Origin 헤더는 웹소켓 통신에 중요한 역할을 합니다. 참고로 웹소켓 객체는 기본적으로 크로스 오리진(cross-origin) 요청을 지원합니다. 웹소켓 통신만을 위한 전용 헤더나 제약도 없습니다. 오래된 서버는 웹소켓 통신을 지원하지 못하기 때문에 웹소켓 통신은 호환성 문제도 없습니다.
Connection: Upgrade – 클라이언트 측에서 프로토콜을 바꾸고 싶다는 신호를 보냈다는 것을 나타냅니다.
Upgrade: websocket – 클라이언트측에서 요청한 프로토콜은 'websocket’이라는걸 의미합니다.
Sec-WebSocket-Key – 보안을 위해 브라우저에서 생성한 키를 나타냅니다.
Sec-WebSocket-Version – 웹소켓 프로토콜 버전이 명시됩니다. 예시에서 버전은 13입니다.
웹소켓 핸드셰이크는 모방이 불가능합니다.
바닐라 자바스크립트로 헤더를 설정하는 건 기본적으로 막혀있기 때문에 XMLHttpRequest나 fetch로 위 예시와 유사한 헤더를 가진 HTTP 요청을 만들 수 없습니다.

서버는 클라이언트 측에서 보낸 웹소켓 통신 요청을 최초로 받고 이에 동의하면, 상태 코드 101이 담긴 응답을 클라이언트에 전송합니다.

```
  101 Switching Protocols
  Upgrade: websocket
  Connection: Upgrade
  Sec-WebSocket-Accept: hsBlbuDTkk24srzEOTBUlZAlC2g=
```
여기서 Sec-WebSocket-Accept는 Sec-WebSocket-Key와 밀접한 관계가 있습니다. 브라우저는 특별한 알고리즘을 사용해 서버에서 생성한 Sec-WebSocket-Accept 값을 받아, 이 응답이 자신이 보낸 요청에 대응하는 응답인지를 확인합니다.

이렇게 핸드셰이크가 끝나면 HTTP 프로토콜이 아닌 웹소켓 프로토콜을 사용해 데이터가 전송되기 시작. 
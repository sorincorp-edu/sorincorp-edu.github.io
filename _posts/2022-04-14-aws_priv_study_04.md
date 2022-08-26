---
layout: single
title:  "[AWS] AWS VPC 디자인"
excerpt: "AWS EC2 개인학습용 자료#4"

categories:
  - aws-study
tags:
  - [AWS, Jenkins]

toc: true
toc_sticky: true
 
date: 2022-04-14
last_modified_at: 2022-04-14
---
# Multi AZ를 활용한 고가용성

VPC(Virtual Private Cloud) 서비스는 AWS 사용자가 직접 가상 네트워크 환경을 구성하는 서비스이다. 이 서비스를 이용하면 Public / Private network 환경을 사용자가 원하는대로 디자인하고 구축할 수 있게 되며, 다양한 부가 기능을 통해 VPC 환경 내 네트워크 흐름을 제어할 수 있다. 

먼저 VPC를 이해하려면, 기존의 물리 IDC 환경을 디자인 할 때 상황을 비교해서 생각해 보면 쉽게 이해할 수 있다. 이번 포스팅에는 데이터 센터 구성에서도 Multi 데이터센터 구성과 AWS의 VPC 서비스를 비교해 보고자 한다. 

## 1. Multi AZ VPC를 활용한 Multi 데이터센터(IDC) 구성 효과

Multi 데이터센터는 지진같은 천재지변으로 인한 데이터센터 장애나 데이터센터 자체의 전력, 네트워크 장애에 대비하기 위한 이중화 구성이다. 하지만 물리적으로 데이터센터를 이중화 하려면 굉장히 많은 비용이 든다. 데이터센터 상면 비용에서 부터 데이터센터간 network latency 를 보장하기 위한 전용선 확보까지 비용적 부담이 매우 크다. 그래서 왠만큼 큰 규모의 서비스가 아니면 시도하기도 쉽지 않다. 또한 DB 의 경우는 DBMS 이중화와 데이터센터 이중화를 복합적으로 고민해야 한다. 
이러한 현실을 고려하다 보면 Multi 데이터센터 구성은 쉽지 않은게 현실이다. 

### VPC를 활용해 Multi 데이터센터 구성을 한다면?

VPC 를 디자인 하기 위해서는 먼저 Region 과 Availability Zone 에 대한 개념을 이해해야 한다. 

AWS 서비스의 가장 큰 단위는 Region이다. 
Region이란 AWS의 서비스가 위치한 지리적인 장소이며, 글로벌 기준으로 지역적 위치를 묶어서 관리하는 단위이다.
하나의 Region 안에는 다수의 Availability Zone 으로 구성되어 있다.

Availability Zone(이하 AZ) 이란 Region 내에 실제 컴퓨팅 리소스들이 물리적으로 분리되어 있는 단위이다. 
이해하기 쉽게, AZ 하나가 물리적인 데이터 센터와 맵핑된다고 생각해도 무방하다. 

그렇다면, AZ간 물리적으로 떨어져 있음으로 인해 생기는 latency는 어떠할까.
AWS 측에서는 같은 Region 내 AZ간에는 low-latency link 로 연결되어 있기 때문에 물리적으로 떨어져 있음으로 생기는 latency 에 대해 
보장해준다. 

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_01.png)

그렇다면 VPC와 Region은 어떠한 관계인가.

VPC를 생성할때는 반드시 Region을 지정해야 한다. 즉, VPC는 반드시 하나의 Region에 속하게 된다.
또한 VPC는 Region내 다수의 AZ를 이용해 설계가 가능하다. 
만약 VPC 를 디자인 할때 Multi AZ를 기반으로 구성한다면, 사용자는 물리적으로 다수의 데이터센터를 이용하는 것과 같은 효과를 볼 수 있다. 

실제로 VPC 를 구성할때 어떻게 Multi AZ 형태로 구성하는지 알아보자. 
그러기 위해서는 먼저 VPC 설계의 가장 기본인 Subnet에 대해서 알아보자

### Subnet 이란

VPC에는 Subnet 이라는 개념이 있는데, 흔히 알고 있는 대로 IP block을 구분짓는 그 Subnet과 동일하다. 

Subnet의 특징은 반드시 하나의 AZ 에 속해야 한다는 것이다. 그렇기 때문에 VPC 내부에 다수의 Subnet 을 생성하여 각각의 AZ에 분산 배치 하면 아래와 같이 하나의 VPC에 Multi AZ 를 사용하도록 디자인 가능하다. 

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_02.png)

위 VPC 는 서울 Region에 구성한 것으로, 서울 Region에는 두개의 AZ가 존재한다. 각 AZ에 아래와 같이 subnet을 배치해 보았다.  
- AZ (ap-northeast-2a) : subnet-01 / subnet-03
- AZ (ap-northeast-2c) : subnet-02 / subnet-04 

VPC와 Subnet을 구성할때는 반드시 CIDR을 설정해야 하는데, 위 VPC 경우에는 10.10.0.0/16 으로 생성하였다. Subnet CIDR은 당연히 VPC에 포함되도록 해야 한다. 각 subnet의 CIDR은 아래와 같이 설정해 보았다. 
- subnet-01 : 10.10.1.0/24
- subnet-02 : 10.10.2.0/24, 
- subnet-03 : 10.10.101.0/24
- subnet-04 : 10.10.102.0/24 

이제, 위와 같이 구성된 VPC에 Instance 를 배포한다고 가정해보자. 

만약 웹서버 두대를 배포한다고 가정하면, 위 VPC의 구성에서는 AZ가 분산되도록 subnet-01과 subnet-02에 분산하여 배포하면 된다. 그리고 이 instance에 ELB를 연결해 서비스한다. 이렇게 되면 만약 AWS의 AZ 하나에 장애가 발생되더라도 다른 AZ에서 서비스가 되기 때문에 고가용성이 유지될 수 있다. 

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_03.png)

ELB (Elastic Load Balancer) 는 Region 내 Multi-AZ 로 설정이 가능하다. 

>
>  * 참고로 ELB는 Region을 벗어나는 로드밸런싱 설정이 불가하다. 이때는 ELB가 아닌 Route53을 이용한 DNS Load balancing 과 같은 방법을 이용해야 한다. 
>
>  ![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_04.png)

>
> * LB를 만들때 보면, 위와 같이 고가용성을 위해 두개 이상의 subnet을 선택해 LB를 생성하기를 권고하는 메시지를 볼 수 있다. 
>

## 2. Public / Private network 존 구분

데이터 센터를 디자인 할때 네트워크단에서 반드시 고려 하는 것이 Public / Private network 존을 나누는 것이다.

서비스를 구축할때 외부와 통신이 직접적으로 필요한 Web 서버 같은 Front-end layer의 경우, Public 존에 위치 하도록 한다. 하지만 Back-end나 DB의 경우 외부와의 통신이 직접적으로 필요하지 않으며, 단지 Public 존에 위치한 Front-end 서버와의 통신만 필요로 하는 경우가 많다. 이런 경우에는 외부와의 통신이 제한된 Private 존에 위치하도록 한다. 이는 보안상 부적절한 접근을 네트워크 레벨에서 원천적으로 차단하기 위함이다. 

만약 물리 IDC의 경우라면, Public / Private 존을 나누기 위해서는 각각의 존을 구성하는 Switch 같은 물리 장비가 필요할 것이다. 또한 VLAN등을 이용해 네트워크 영역을 분할하는 작업도 해야하며, Router를 이용해 IP대역에 대한 routing table을 직접 구성해야 할 것이다. 

만약 AWS의 VPC를 이용한다면 어떨까.
아래 그림은 위에서 구성한 VPC 환경의 Subnet 중 01/02 의 역할을 Public 으로, 03/04 는 Private 으로 설계한 것이다.

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_05.png)

[ Public ]
- public-subnet-01 (ap-northeast-2a) : 10.10.1.0/24
- public-subnet-02 (ap-northeast-2c) : 10.10.2.0/24

[ Private ]
- private-subnet-01 (ap-northeast-2a) : 10.10.101.0/24
- private-subnet-01 (ap-northeast-2c) : 10.10.102.0/24

public subnet 과 private subnet도 각각의 AZ에 분산해서 배포하였다. 
그리고 subnet-01과 02에는 외부와 통신이 필요한 Web 서버만 배포하도록 정책을 세우고, subnet-03 과 04 에는 외부와 통신이 제한되는 DB 서버만 배포하도록 정책을 세우면 된다. 

이제 실제적으로 subnet-01과 02가 외부와 통신을 하기 위한 추가적인 설정을 해야한다. 
VPC 를 생성하면 기본적으로 외부 통신과 단절된 상태로 생성된다. 또한 모든 network가 private IP로 설정되어 있기 때문에 외부로 통신이 불가한 상태다. 이때 외부로 통신하기 위해 VPC 에서는 Internet Gateway 라는 기능을 제공한다. 

### Internet Gateway

VPC 에서 제공되는 Internet Gateway 라는 기능을 이용하면 원하는 Subnet을 외부 통신이 되도록 설정이 가능하다. 
구성 방법은 매우 간단하다. 

먼저 외부 통신을 위한 Internet Gateway (이하 IGW) 를 생성 한후, 생성된 IGW를 VPC에 Attach한다.

>
> * 참고로 하나의 VPC 에는 하나의 IGW 만 attach 할 수 있다. 
>

그리고 route table 을 생성 한 후, 외부 통신을 위한 public-subnet-01 과 02 에 route table 을 assign 한다. 

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_06.png)

[ route table을 생성 후 위와 같이 외부 통신을 위한 두 subnet을 추가한다 ]

마지막으로 route table에 모든 traffic이 생성한 IGW로 가도록 설정 해주면 된다.

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_07.png)  
[ routing 경로로 위에서 생성한 IGW 를 지정해준다 ]

그리고 Private 을 위한 route table 도 추가로 생성 한 후, private-subnet-03 과 04 에 assign 하면 된다. private의 경우에는 외부 통신을 제한해야 하므로 IGW로 routing 설정을 추가하지 않는다. 그럼 자연스럽게 내부통신만 가능하다.

그림으로 보면 아래와 같은 구성이 되겠다. 

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_08.png)

VPC 를 초기에 구축할때는 위와 같이 Multi AZ와 Public / Private Subnet 을 구분하여 디자인하는게 고가용성과 보안성을 위해 좋은 설계 방향이다. 이미 인스턴스가 배포되고 서비스가 운영되고 있는 상황에서 새롭게 VPC를 구성하여 마이그레이션 하기에는 굉장히 번거로운 작업들이 필요하기 때문이다. 

# Network ACL과 Security Group을 활용한 보안 강화

VPC(Virtual Private Cloud) 서비스는 AWS 사용자가 직접 가상 네트워크 환경을 구성하는 서비스이다. 이 서비스를 이용하면 Public network 환경과 Private network 환경을 사용자가 원하는대로 디자인하고 구축할 수 있게 된다.

또한 다양한 부가 기능을 통해 VPC 환경 내 네트워크 흐름을 제어할 수 있기 때문에 나만의 가상 데이터 센터를 구축하여 사용할 수 있게 된다.

VPC의 보안 강화를 위해 Network ACL,  Security Group과 Flow log를 이용하는 방법을 알아보자.

## 1. Network ACL

데이터 센터 구축시, 보안 강화를 위해 가장 많이 사용하는 방법은 Network 앞단에 방화벽 장비를 두고 데이터센터로 유입되는 트래픽을 제어하는 것이다. 방화벽 장비를 통해 패킷의 출발지 주소와 목적지 주소, Protocol 유형, 서비스 포트를 확인하여 inbound 또는 outbound 패킷을 허용하거나 차단하도록 설정한다. 혹은 Switch나 Router 장비에 ACL(Access Control List) 를 활용하여 구현하는 것도 가능하다. 하지만 이러한 방식을 구성하기 위해서는 고가의 방화벽 장비를 추가적으로 설치 하거나 Network 장비에 ACL 을 직접 설정해야 하는 부담이 있다. 

### AWS VPC를 사용하면 어떨까

VPC 를 사용하면, 추가적인 비용 없이 Network ACL 설정을 사용자가 직접 VPC로 유입되는 트래픽을 제어할 수 있도록 제공해 준다. 기존 데이터 센터에서는 방화벽이나 Switch 마다 ACL 규칙을 설정하고 이 설정 내역을 관리 해야 했지만, VPC 에서는 AWS Console 을 통해 손쉽게 설정을 할 수 있으며 API도 제공하기 때문에 사용성이 매우 뛰어나다. 

데이터 센터 구축시 어려운 점이었던 (1) 보안 장비 도입 비용 증가와 (2) 장비 운영 관리에 대한 부담을 해결해 주기 때문에 이를 잘 이용한다면 견고한 가상 데이터 센터를 구축할 수 있다. 

ACL의 특징을 알아보면 아래와 같이 요약해 볼 수 있다. 

>
> ACL의 특징
> - VPC의 Network ACL은 Subnet 단위로 적용 시킬 수 있다. 
> - ACL은 여러 서브넷에 적용이 가능하다. 하지만, 서브넷은 한번에 한개의 ACL만 연결이 가능하다. 
> - ACL 규칙 목록은 번호가 낮은 것부터 우선으로 적용된다. 
> - VPC 당 최대 ACL 개수는 200개이다. 
> - ACL당 규칙 목록은 inbound 최대 20개, outbound 최대 20개까지 지정 가능하다.  
> - ACL은 stateless 이다. 
>
> 
> 여기서 마지막 특징인 stateless 에 대해 좀 더 자세히 알아보자. 
> 
>  stateless 는 트래픽에 대한 상태를 저장하지 않는다는 의미로, 요청과 응답은 트래픽의 상태와 상관없이 각각 inbound 와 outbound 규칙을 따른다는 것이다. 즉, 허용되는 inbound 트래픽에 대한 응답의 경우에는 inbound 규칙과 상관 없이 outbound 규칙을 따르게 된다는 것이다. 
> 
>  예를 들어, ACL 의 inbound 규칙에 80 포트 접근 허가를 추가해 놓았다고 해보자.
>  외부에서 HTTP 요청(80)을 하였을 경우, ACL의 inbound 규칙 80을 허용하였으므로 트래픽이 들어오게 된다. 
>  하지만 해당 요청에 대한 응답의 경우는 ACL의 outbound 규칙을 따르게 된다. 
> 
>  즉, ACL의 outbound 규칙에 HTTP 요청에 대한 응답 포트를 오픈하지 않을 경우, 
>  ACL에 의해 deny되며 최종적으로 client에게 요청 결과가 전송되지 않게 된다. 
> 
>  그렇기 때문에 inbound / outbound 규칙 관리의 중요성이 크다. 
>  이 부분에서 한가지 신경써 줘야 할 부분이 Ephemeral Port 에 대한 허용 규칙이다. 
> 
>  Ephemeral Port 는 TCP Connection 시에 커널이 임의로 port를 binding 하는 경우가 있는데 이런 port를 Ephemeral port 라고 부른다. 
>  여기서 임의로 할당되는 port 의 범위를 커널에서 관리하기 때문에 설정마다 다르다. 
> 
>  AWS에서 제공하는 Amazon Linux AMI 인 경우 Ephemeral port range 가 32768 ~ 60999 로 설정되어 있다. 
>  
>      root@~~# cat /proc/sys/net/ipv4/ip_local_port_range 
>      32768 60999
> 
> 따라서 Network ACL의 inbound/outbound 규칙에 해당 포트 범위에 허용 시켜주는것이 좋다. 
> 아래는 VPC 에서 권장되는 ACL 규칙 관련 가이드 문서이니 참고.  
>  
> VPC에서 권장되는 네트워크 ACL 규칙
>
> ![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_11.png) 
>
> 위 그림은 ACL을 지정한 VPC 예이다. 
>
> Public Subnet 2개와 Private Subnet 2개 이루어진 VPC 이다.
> Public/Private 에 속한 subnet은 고가용성을 고려해 두개의 AZ에 분산 배치되어 있다.  
> Public Subnet 에는 Public용 ACL 이 적용되었고, Private Subnet에는 Private용 ACL을 각각 적용하였다.
>
> 아래는 public subnet에 적용한 ACL의 inbound 규칙의 예이다. public subnet 에는 Web 서비스가 생성될 것이라고 가정해보았다. 
>
>   ![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_12.png) 
>
> - SSH 는 서버에 접속하는 경로이므로 Source IP를 반드시 개발자의 IP에 한정지어 설정하도록 한다. 
> - 80/443 은 HTTP/HTTPS 서비스를 위한 포트이므로 everywhere 오픈으로 설정하였다. 
> - Ephemeral Port를 위해 32768~60999 포트까지 오픈으로 설정하였다.
> - 나머지 모든 트래픽은 All deny 이다. 
>
> 아래는 Private ACL의 inbound 규칙이다. private subnet 에는 MySQL 서버가 배포될 것을 가정하였다.
>
>   ![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_13.png) 
>
> - Private Subnet의 경우 외부 통신이 불가하다. SSH 접속이 필요한 경우 Public Subnet에 배포된 instance를 경유해 들어오도록 가정하여, source IP 대역을 public subnet 대역인 10.10.0.0/16 대역으로 설정하였다. 
> - MySQL 서비스 포트인 3306 또한 public subnet 에서 접속할 것으로 간주하여, source IP 대역을 10.10.0.0/16 대역으로 설정하였다.
> - 나머지 모든 트래픽은 All deny 이다. 
>

## 2. Security Group
Security Group은 인스턴스에 대한 inbound 와 outbound 트래픽을 제어하는 방화벽 역할을 한다. Network ACL 과의 차이라고 한다면, ACL의 경우 Network 레벨에서의 방화벽이라면, Security Group은 인스턴스 레벨의 방화벽이라고 생각하면 된다. 

Security Group 의 특징을 알아보면 아래와 같다.

[Security Group의 특징]
- Security Group은 instance 단위로 적용 시킬 수 있다. 
- 동일 Subnet 내에서 통신일 경우, ACL 규칙과 상관없이 Security Group 의 규칙을 적용 받게 된다. 
- Security Group의 규칙은 Allow 지정 방식이며, Deny 지정은 불가하다.
- 기본적으로 Inbound 트래픽의 경우 All Deny 이다. 
- Outbound 트래픽의 경우 기본적으로 All Allow 상태이며, All Allow 규칙은 삭제가 가능하고 원하는 Allow 규칙만 추가 가능하다.
- Security Group은 Stateful 하기 때문에 허용된 inbound 트래픽에 대한 응답은 outbound 규칙에 관계없이 허용된다. 

Security group 은 Network ACL 과 다르게 State를 기억하기 때문에 outbound 나 Ephemeral Port 에 대한 고민을 하지 않아도 된다. 

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_14.png) 

위 그림은 VPC에 Security Group을 추가한 예이다. Security Group은 Instance 별로 지정이 가능하다. 위 예제에서는 Public Subnet에 배포된 Instance를 위한 Security Group 과 Private 에 배포된 Instance를 위한 Security Group을 지정한 모습이다. 

Network ACL 과 Security Group 을 함께 사용하는 경우, 오히려 트래픽 제어가 복잡해 질 수 있고, 갑자기 통신이 두절된 경우 Trouble shooting 이 복잡해 질 수 있으므로 주의하도록 해야 한다. 

## 3. Flow Log
Flow log는 VPC 내 트래픽에 대한 로그 정보를 수집하는 기능이다. Flow log는 instance에게로 유입되는 트래픽을 모니터링을 할 수 있으므로 보안을 위한 추가 도구로 유용하게 사용 가능하다. 또한 Network ACL 로 인한 얘기치 않은 통신 두절 상황에서 Trouble shooting 도구로도 사용이 가능하다. 

Flow log를 설정하면 로깅 데이터는 CloudWatch Log를 사용하여 저장하게 된다. 그렇기 때문에 AWS Console 에서 UI로 손쉽게 확인이 가능한 점도 큰 장점이다. 

### VPC 에서 Flow log 적용 방법
VPC 에 Flow log를 설정하는 방법을 소개한다.  
Flow log를 사용하려면 먼저 두가지를 설정해야 한다. 
- VPC Flow log를 위한 CloudWatch의 Log group 생성
- 생성한 Log group에 log stream을 사용할 수 있는 IAM role 권한 지정

먼저 Log group을 생성하려면 CloudWatch에 Log 메뉴를 선택하고 Create log group 을 선택한다. 

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_15.png) 

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_16.png) 

Log group에 기록하기 위한 IAM role은 아래와 같은 권한이 필요하다. 

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}   
```

이제 VPC에 Flow log를 설정해 보자.
VPC를 클릭한 후 Flow logs 탭을 선택해 Create Flow log 버튼을 클릭한다. 

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_17.png) 

- Filter를 설정해 VPC 로 유입되는 트래픽 중 허용된 것 / 거부된 것 / 모두 기록 할지를 선택할 수 있다. 위에서는 거부된 것만 기록하도록 설정하였다.
- Role은 위에서 만든 IAM role을 설정한다. 
- Log group은 CloudWatch에서 만든 log group 명을 선택한다.  

설정을 완료 하고 CloudWatch의 Log stream 기록을 보면 아래와 같이 reject log 를 볼 수 있다. 

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_18.png) 

참고로 Log Record 필드의 의미는 아래와 같다. 

> version, account, eni, source, destination, srcip, destip="22", protocol="6", packets, bytes, windowstart, windowend, action="REJECT", flowlogstatus
>

# Private Network을 위한 NAT Gateway 와 Bastion 서버

VPC(Virtual Private Cloud) 서비스는 AWS 사용자가 직접 가상 네트워크 환경을 구성하는 서비스이다. 이 서비스를 이용하면 Public network 환경과 Private network 환경을 사용자가 원하는대로 디자인하고 구축할 수 있게 된다.

또한 다양한 부가 기능을 통해 VPC 환경 내 네트워크 흐름을 제어할 수 있기 때문에 나만의 가상 데이터 센터를 구축하여 사용할 수 있게 된다.

VPC의 Private Subnet을 위한 NAT Gateway 와 Bastion host에 대해 알아보자.

## 1. NAT Gateway

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_21.png) 

위 그림은 VPC를 이용해 구성한 Network 환경이다. 

Subnet 을 Public 과 Private 으로 구분하여, Public subnet은 Internet Gateway 를 이용하여 외부와 통신이 가능하도록 설정하였다. 하지만, Private Subnet 의 경우는 외부와의 통신이 단절된 환경이다. 보안을 높이기 위한 선택이지만 불편함이 따를 수 밖에 없다. 

아래의 경우를 가정 해보자.
- Private Subnet에 위치한 instance가 다른 AWS 서비스에 연결해야 하는 경우. 
- 인터넷에서 Private instance 에 접근 불가 조건은 유지하면서 반대로 instance 에서 외부 인터넷으로 연결이 필요한 경우. 

위와 같은 이유로 Private Subnet에 배포된 instance 라도 외부와의 통신이 필요한 경우가 있다. 이런 경우 가장 간단히 해결 할 수 있는 방법은 NAT 서버를 구축하는 것이다. 이전에는 외부 통신이 가능한 Public Subnet 에 EC2 instance를 배포하고 이를 NAT 서버로 구축하여 사용하는 방법이 일반적이었다. 하지만 최근 VPC 환경에 NAT 서버를 손쉽게 배포하고 관리해주는 서비스인 NAT Gateway를 제공해 주고 있다. 

NAT 서버에 대한 Managed 서비스 이기 때문에 NAT 서버에 대한 운영 부담을 덜 수 있는 장점이 있다. 
아래는 직접 NAT 서버를 구축해 사용하는 것과 NAT Gateway 서비스를 사용하는 것에 대한 비교 자료이니 참고. 

NAT 인스턴스 및 NAT 게이트웨이 비교

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_22.png) 

위 그림은 Public Subnet 에 NAT Gateway를 추가한 형상이다. 
사용하는 방법은 매우 간단하다. NAT Gateway를 생성 후 Private Subnet 에 적용된 Route table에 NAT Gateway 로 가는 경로만 추가해 주면 된다. 

아래는 NAT Gateway를 적용하는 방법이다.

### NAT Gateway 설정 방법
VPC 메뉴 중 NAT Gateways 를 선택 후 Create NAT Gateway 버튼을 눌러 NAT 를 생성한다. 

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_23.png) 

- NAT Gateway를 생성할 Subnet을 지정하는데 반드시 Public 통신이 가능한 Subnet에 생성한다. 
- NAT Gateway에 연결할 EIP를 할당한다. 만약 EIP가 없다면 Create New EIP 하면 된다. 

NAT Gateway는 생성되는데 시간이 걸리므로 Status가 Available 될때까지 기다린다. 
Available 되었으면 Private Subnet에 적용된 Route table에 NAT Gateway로 경로를 설정해 주면 끝이다. 

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_24.png) 

### NAT Gateway 통신을 위한 Network ACL 설정

이미 VPC 에 Network ACL 과 Security Group 을 적용하여 사용 중이라면, Private Subnet 에서 NAT Gateway 통신을 위해 규칙 설정을 해줘야 한다. 
먼저, ACL 설정을 살펴보자. 

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_25.png) 

NAT Gateway는 Public Subnet에 존재하고 Private Subnet 과 통신을 한다. 
그러므로 Private Subnet에 적용된 ACL에 아래와 같이 설정해 보았다.

> * 참고 : 생성된 NAT Gateway 의 Private IP 를 확인하도록한다. 여기서는 10.10.1.31 로 생성되었다.
>

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_26.png) 

- Private Subnet 에는 MySQL이 배포된다고 가정하고, 3306 포트를 허용하였다. source IP 대역은 Public Subnet 대역인 10.10.1.0/24 10.10.2.0/24 이다. 
- 외부 통신시 사용되는 Ephemeral Port 32768~60999 를 허용하였다. source IP 는 NAT Gateway IP인 10.10.1.31 만 허용하였다. Private Subnet의 경우 외부와 통신되는 경우는 NAT Gateway 를 통해서만 되기 때문이다. 
- yum repository 와의 통신을 위해 80 포트도 추가해 주자. source IP 는 NAT Gateway IP 이다.  
- 통신이 잘 되는지 테스트해보기 위해 ICMP 를 허용 하였다. source IP 는 NAT Gateway IP 이다. 참고로 Public Subnet 에도 ICMP를 허용해 주도록 한다. NAT gateway 는 public subnet 에 있으므로 public subnet 에 적용된 ACL의 규칙을 적용 받는다. 

이제 Private Subnet에 배포된 instance 에서 외부와 통신이 잘 되는지 확인해 보자. 
간단히 instance 에서 외부로 통신이 되는지 ping 을 통해 확인해 보자. 

> 
> root@~~# ping 8.8.8.8
> PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
> 64 bytes from 8.8.8.8: icmp_seq=1 ttl=55 time=2.13 ms
> 64 bytes from 8.8.8.8: icmp_seq=2 ttl=55 time=1.90 ms
> 64 bytes from 8.8.8.8: icmp_seq=3 ttl=55 time=2.73 ms
> 

global repository 에서 yum install 이 되는지도 확인해보자. 

> 
> root@~~# yum update
> Loaded plugins: priorities, update-motd, upgrade-helper
> Resolving Dependencies
> --> Running transaction check
> ---> Package curl.x86_64 0:7.40.0-8.57.amzn1 will be updated
> ---> Package curl.x86_64 0:7.40.0-8.58.amzn1 will be an update
> ---> Package libcurl.x86_64 0:7.40.0-8.57.amzn1 will be updated
> ---> Package libcurl.x86_64 0:7.40.0-8.58.amzn1 will be an update
> --> Finished Dependency Resolution
> 
> Dependencies Resolved
> 

Private 환경에 있더라도 NAT를 통해 외부와 통신이 잘 됨을 알 수 있다. 
NAT Gateway는 Managed 서비스 이므로 사용시 과금이 청구된다. 
Gateway 당 시간 단위로 비용이 청구 되며 NAT 를 통해 처리된 데이터에 대한 요금도 추가로 발생된다. 

## 2. Bastion Host
Private Subnet에 배포된 instance의 경우 외부에서 접근이 차단되어 있기 때문에 SSH 로 접근할 수 있는 방법이 없다. 하지만 운영자는 서버를 관리 하기 위해 SSH 접속이 필요하다. 이러한 경우 Bastion host 라는 방식으로 외부 접근이 가능하도록 구성한다.  

Bastion host는 Private 네트워크 환경에 접근하기 위한 일종의 Proxy 역할을 하는 서버라고 보면 된다.  Private subnet에 배포된 모든 instance 들은 bastion을 통해 SSH 접속을 허용하도록 한다. 접근 허용을 한 곳으로 한정 지음으로 좀 더 보안성을 높이고자 하는 목적이 있으며 bastion host의 logging 만 관리하면 private subnet에 접속하는 모든 기록을 관리할 수 있다. 

단, bastion host 가 공격 당하면 내부 네트워크가 모두 위험해 질 수 있으므로 bastion host에 대한 접근을 최대한 철저히 관리하는게 좋다. 

아래는 Bastion host 를 이용해 Private Subnet 에 배포된 instance 에 접속되는 구조이다.

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_27.png) 

- Bastion host는 Public Subnet에 위치하도록 EC2 instance를 생성한다. 외부 사용자는 Bastion host 를 통해 접속한다. 
- 외부 사용자의 특정 IP만 허용하여 Bastion host에 접속 가능하도록 ACL 과 Security Group을 설정한다. 
- Bastion host 를 통해 Private Subnet에 상주한 instance 로 접속 한다. 

### SSH Tunneling
Bastion host 에서 SSH 접속을 Proxy 하는 여러가지 방법이 있다. 여기서는 SSH Tunneling 을 이용해 외부에서 Private instance 에 접속하는 방법을 소개한다. 

이해를 돕기 위해 현재 환경을 정리하면 아래와 같다. 
- Bastion host Public IP :  52.100.1.1 
- 접속 타겟 instance Private IP : 10.10.101.225

먼저 Local PC 에서 Bastion host 에 SSH 할때, -L 옵션을 이용하여 접속한다. 
SSH를 이용해 Bastion host 에 접속하는데 Local 터널링으로 접속하는 명령어이다.

> ssh -i key.pem -L 22:10.10.101.225:22 ec2-user@52.100.1.1

여기서 -L 옵션인 22:10.10.101.225:22 의 의미는 "로컬 포트 22번 으로 접속 타겟 instance(10.10.101.225)의 22번 포트로 접속하겠다" 는 의미이다 .
이렇게 SSH를 접속해 놓은 상태에서 터미널을 한개 더 열고 

> ssh -i key.pem ec2-user@localhost

위와 같이 접속하면 자동으로 타겟 instance 로 SSH Tunneling 되어 접속됨을 볼 수 있다. 
위와 같은 방법으로 Private Subnet에 위치한 모든 서버에 접속 가능하다. 

# VPC Peering을 활용한 Multi VPC 사용하기

VPC(Virtual Private Cloud) 서비스는 AWS 사용자가 직접 가상 네트워크 환경을 구성하는 서비스이다. 이 서비스를 이용하면 Public network 환경과 Private network 환경을 사용자가 원하는대로 디자인하고 구축할 수 있게 된다.
또한 다양한 부가 기능을 통해 VPC 환경 내 네트워크 흐름을 제어할 수 있기 때문에 나만의 가상 데이터 센터를 구축하여 사용할 수 있게 된다.
이번 포스팅에는 여러 VPC를 연동해서 사용할 수 있는 VPC Peering에 대해서 알아보자. 

## VPC Peering
VPC는 사용자마다 다수의 VPC 환경을 구성해서 사용 가능하다. 그러므로 적당한 기준으로 VPC 를 분리해서 운영하는게 관리상 장점이 될 수 있다.
하지만, 이런 경우를 생각해 보자. 
 10.10.0.0/16 대역을 사용하는 VPC A 와 10.30.0.0/16 대역을 사용하는 VPC B 가 있다고 가정해보자.
 만약, VPC A 에 배포된 instance 와 VPC B 에 배포된 instance가 서로 통신을 하고 싶다면 어떻게 구성하면 될까. 

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_31.png) 

실제 데이터센터의 경우를 비추어 생각해보면, 두 데이터 센터를 연결하려면 전용선을 이용하거나 VPN 같은 장비를 이용하여 연결 구간을 외부에 노출시키지 않고 internal 하게 연결 시켜야 한다. 하지만 이런 방법은 많은 도입비용과 관리에 대한 부담이 앞서게 된다. 

하지만 AWS의 경우, 몇가지 상황이 충족한다면 VPC Peering 이라는 기능을 이용하여 손쉽게 두 VPC를 연결 가능하다. Gateway 나 VPN 연결 방식이 아닌 AWS의 internal level 에서 구현한 연결이기 때문에 보안이나 대역폭에 대한 고민, SPOF 에 대한 걱정 없이 바로 연결이 가능하다. 

아래는 VPC Peering 을 위한 기본 전제 조건이다. 
- 다른 Region에 있는 VPC 간에는 Peering 연결이 불가하다.
- 두 VPC 의 CIDR 블럭이 중복되는 경우 연결이 불가하다. 
- VPC 당 Peering 은 최대 50개 가능하다. 
- VPC Peering 간 MTU는 1,500 byte 이다.

위 제약 조건을 제외 하고는 VPC 간 Peering 연결이 가능하며, 다른 계정에 있는 VPC도 연결이 가능하다. 
그렇다면 직접 VPC Peering 설정해보자. 테스트 해볼 VPC 구성은 아래와 같다. 

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_32.png) 

- Peering 으로 연결한 VPC 정보는 아래와 같다.
  - song-vpc-01 : 10.10.0.0/16 
  - song-vpc-02 : 10.30.0.0/16
- song-vpc-01 에는 총 4개 subnet이 있으며 이 중에 두개 subnet은 Internet Gateway에 연결된 public subnet 이며, 나머지는 private subnet 이다. 
- song-vpc-02 에는 총 2개의 subnet이 있으며 모두 Internet Gateway 에 연결된 public subnet 이다. 

먼저 Peering 할 VPC 두개를 생성한 후, Subnet 과 통신을 위한 Internet Gateway, Route table을 설정한다.  

VPC 구성을 위한 설명은 이번 포스팅과 관계가 적으므로 생략.

VPC 구성이 완료 되었다면, 이제 Peering 설정을 해보자.
VPC의 메뉴중 "Peering Connections" 를 선택 후 Create Peering Connection 클릭.

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_33.png) 
 
- Local VPC to peer 는 연결할 song-vpc-01 의 ID 를 작성한다. 
- 만약 같은 계정일 때 My account 선택, 만약 다른 계정일 때는 Another account 를 선택 한 후 account ID 를 넣는다. 
- 마지막 VPC 는 연결할 대상 VPC song-vpc-02 의 ID를 작성한다. 

VPC Peering 연결은 요청과 요청에 대한 응답 구조이다.  
여기서는 song-vpc-01 이 요청 / song-vpc-02 가 요청에 응답하는 형상이다.
VPC Peering 요청과 응답에 대한 상태 주기는 아래와 같다. 자세한 설명은

VPC 피어링 연결 수명 주기

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_34.png) 

[ 출처 : http://docs.amazon.com ]

Peering 을 요청하면 아래와 같이 상대 VPC 에서 응답 요청을 볼 수 있다. 요청에 대한 응답을 기다리는 상태는 pending-acceptance 이다.  

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_35.png) 

Peering 요청을 수락해보자. Action 버튼에서 Accept Request 를 선택하면 된다. 
요청을 수락하면 아래와 같이 status 가 active 로 바뀌면 연결이 완료된 것이다. 

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_36.png) 

연결이 완료 되었다고 바로 통신이 되는 것은 아니다. 
서로간 통신이 가능하도록 Route table을 설정해 줘야 한다. 
먼저 song-vpc-01(10.10.0.0/16) 에서 song-vpc-02(10.30.0.0/16) 으로 통신할 수 있도록 song-vpc-01에 적용된 route table 규칙을 아래와 같이 추가해준다. 


먼저 song-vpc-01 에 있는 public subnet / private subnet 의 route table 에 아래와 같이 10.30.0.0/16 대역 패킷에 대한 경로를 설정해 준다. 
Target 은 위에서 생성한 vpc-peer-01로 지정 한다. 

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_37.png) 

[ 캡쳐는 귀찮으니 public route table 만.. private 용 route table 도 똑같이 적용해준다. ]

song-vpc-02 의 route table 의 경우는 반대로 10.10.0.0/16 대역에 대한 경로를 설정해 준다. 
Target 은 마찬가지로 vpc-peer-01 로 지정한다. 

![AWS VPC-Design](./../../images/aws/gilab/aws_vpc_design_38.png) 

* VPC Peering 을 통한 통신도 ACL 과 Security Group 을 동일하게 적용 받게 된다. 
그러므로 만약 Network ACL 과 Security Group 도 설정되어 있다면, 반드시 해당 대역에 대해 허용 규칙을 넣어주도록 한다. 
이제 해당 대역에 배포된 instance 가 서로간 통신이 잘 되는지 확인해 보자. 
아래는 10.10.101.0 대역에 배포된 song-vpc-01 에 배포된 private subnet에 있는 instance(10.10.101.205) 에서 song-vpc-02에 배포된 instance의 private IP 10.30.10.151 로 ping 테스트를 해본 결과이다.

> 
> [root@ip-10-10-101-205 ec2-user]# ping 10.30.10.151
> PING 10.30.10.151 (10.30.10.151) 56(84) bytes of data.
> 64 bytes from 10.30.10.151: icmp_seq=1 ttl=255 time=0.627 ms
> 64 bytes from 10.30.10.151: icmp_seq=2 ttl=255 time=0.679 ms
> 

정상적으로 통신 된 것을 볼 수 있다. 

VPC Peering 의 경우 같은 Region에 있는 VPC 사이에만 설정이 가능하다.
만약 다른 Region 에 배포되어 있는 VPC 을 연동하려면 어떻게 하면 될까. 

출처: https://bluese05.tistory.com/49 [ㅍㅍㅋㄷ]
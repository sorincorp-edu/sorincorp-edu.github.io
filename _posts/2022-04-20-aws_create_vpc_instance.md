---
layout: single
title:  "[AWS] git과 gitlab 설치"
excerpt: "AWS git과 gitlab 설치"

categories:
  - aws-study
tags:
  - [AWS]

toc: true
toc_sticky: true
 
date: 2022-04-20
last_modified_at: 2022-04-20
---
# VPC 만들기
- VPC는 사설망을 AWS Public Cloud 에 만들 수 있게 해주는 기능
- AWS에 계정을 생성하면 기본적으로 Default VPC가 제공
- 특별한 설정 없이 간단한 테스트용으로 사용하기에는 충분
- 서비스 용도로는 Default VPC 사용을 권장하지 않음

## Default VPC 살펴보기
### (1) VPC
VPC ID가 vpc-0608f3b368063dfed이고, 네트워크 주소 범위는 B Class로 172.31.0.0/16 (65,5361 IP) 입니다. VPC는 Region 단위로 설정됩니다.

![AWS VPC](./../../images/aws/createvpc/1_Lq1Yj8Qo-iQ_BFSF9pez2w.png)

### (2) Subnet
Default VPC 안에 2개의 Subnets이 있고, AZ별도 서로 다른 네트워크 주소를 갖고 있습니다. 참고로, Subnet 네트워크 주소는 172.31.0.0/20과 172.31.16.0/20 입니다. Subnet의 할당단위는 AZ 단위입니다.

> Subnet은 VPC의 CIDR 주소를 더 작은 단위로 나눈 네트워크 주소 공간입니다.

![AWS VPC](./../../images/aws/createvpc/1_CF9TTNtMPY_e4ECZx0IYIw.png)

### (3) Route Table
VPC 네트워크 주소 범위 내부의 통신 (172.31.0.0 /16) 은 VPC 내부로의 라우팅입이 되고, 그 이외의 것(0.0.0.0)은 인터넷으로 라우팅하도록 설정되어 있습니다. Route Table의 설정단위는 Subnet 입니다.

> Destination이 0.0.0.0 이라는 의미는 외부로 나가는 모든 Packet을 IGW로 보내다는 의미입니다.

![AWS VPC](./../../images/aws/createvpc/1_mhaqv9zX5-tefzPUtpHJzg.png)

### (4) Internet Gateway
인터넷 통신을 하기 위해서 인터넷 게이트웨이를 생성하여 Route Table에 할당을 합니다. Internet Gateway 설정 단위는 VPC 입니다.

![AWS VPC](./../../images/aws/createvpc/1_q8NJbT78jPQTZIQMYQTQwA.png)

### (5) DHCP Option set
VPC 안에 생성되는 EC2에게 자동으로 IP를 할당해주기 위해서 사용하는 DHCP 서비스입니다.

![AWS VPC](./../../images/aws/createvpc/1_S289mvB4KyMBpWiJLIZBjQ.png)

### (6) Network ACL
InBound (내부로의 통신), OutBound (외부로의 통신) 를 기반으로 모든 통신을 허가합니다. 설정 단위는 Subnet 입니다.

>
> Network ACL은 stateless 방화벽으로 Inbound와 Outbound 별로 방화벽 정책을 설정해줘야 합니다. 설정이 복잡하여 현업에서는 주로 Stateful 방화벽을 사용합니다.
> 

![AWS VPC](./../../images/aws/createvpc/1_-uiugCpHjL8NrEik72qtWw.png)

### (7) Security Group
InBound (내부로의 통신)는 모든 통신을 거부하고, OutBound (외부로의 통신) 를 기반으로 모든 통신을 허가하도록 설정되어 있습니다. 설정 단위는 인스턴스입니다.

>
>Security Group은 statefull 방화벽입니다. Inbound 통신을 허용하면 Outbound 통신도 같이 허용됩니다.
>

![AWS VPC](./../../images/aws/createvpc/1_WGIR17IXfHub7rCXQqNK6Q.png)

## [실습] VPC 만들기
아래와 같이 MyVPC를 생성해보도록 하겠습니다.

![AWS VPC](./../../images/aws/createvpc/1_GGAb0NfOt90CbvAnqLoU3w.png)

### 1. VPC
VPC 에서 Create VPC 버튼을 눌러서 MyVPC VPC를 생성하겠습니다. VPC는 Region 단위로 설정이 되기 때문에 여기서는 Seoul 리전에 생성을 합니다.

![AWS VPC](./../../images/aws/createvpc/1_gxQ0B6AO7QDyFFI9CSWw7g.png)

생성된 VPC ID는 vpc-0c523710293bc0faa 입니다.

### 2. Subnet
Subnet은 AZ 별로 생성되는 객체입니다. Seoul 리전에는 두개의 AZ가 존재하기 때문에 2개의 Subnet을 생성하도록 하겠습니다.
생성할 Subnet 네트워크 주소 공간을 10.10.1.0/24, 10.10.3.0/24 로 정의하겠습니다.

![AWS VPC](./../../images/aws/createvpc/1_o0GFCJwTcKmBZ_1iPyWrew.png)

![AWS VPC](./../../images/aws/createvpc/1_J5Irv-TXYqUdLSuGFbBXWw.png)

생성된 결과는 아래와 같습니다.

![AWS VPC](./../../images/aws/createvpc/1_Prq3SC2EdBmdNh9etD_r-A.png)

>
> 참고로, Subnet에 Route Table이 연결되어 있고 Route Table에 IGW가 연결되어 있으면 해당 Subnet을 Public Subnet이라고 부르고, IGW와 연결되어 있지 않으면 Private Subnet이라고 합니다.
> 

### 3. Route Table
Route Table은 MyVPC생성 시 이미 자동으로 생성되어 있습니다.

![AWS VPC](./../../images/aws/createvpc/1_-Rk_zWtAxNT2VRN1Z3X8Ag.png)

여기서는 자동으로 생성된 Route Table을 사용하지 않고 새로운 Route Table을 생성해 사용하겠습니다. 생성하고자 하는 Route Table 이름은 MyRouteTable 입니다.

![AWS VPC](./../../images/aws/createvpc/1_6f1BCK4evoPYFxka8-OTVA.png)

방금 생성된 Route Table의 Main 값은 No 로 되어 있습니다. Set Main Route Table 을 통해서 방금 생성한 Route Table의 Main 값을 Yes로 변경하도록 하겠습니다.

>
> 참고로, Main Route Table의 의미는 VPC 내에 여러 개의 Route Table이 존재할 경우 default 로 사용할 Route Table을 지정하는 것입니다.
> 

![AWS VPC](./../../images/aws/createvpc/1_yCvtGvOA6w5jHdjNXCQioA.png)

Subnet은 VPC 안에 있는 1개의 Route Table과 연결되어야 합니다. 그래야 VPC 내부에서 통신이 가능하게 됩니다.

Subnet으로 가서 방금 생성한 Route Table이 지정되어 있는지 확인해보겠습니다. 이미 Subnet에 방금 생성한 MyRouteTable이 연결되어 있는 것을 확인할 수 있습니다.

![AWS VPC](./../../images/aws/createvpc/1_2Vo-I_aMvi1Sq12vXSRRUQ.png)

>
> 기본 Route Table 정책 - Destination 은 10.10.0.0/16 (참고로, VPC 생성 시에 입력했던 CIDR 주소 입니다.)로 되어 있고 , Target은 Local 로 되어 있습니다. VPC 사설망 안에서는 통신이 가능하게 설정이 되어 있는 것입니다. 그러나 인터넷 통신은 가능하지 않습니다.
> 

### 4. Internet Gateway(IGW) 생성하기
인터넷 통신을 하기 위해서 IGW를 생성하도록 하겠습니다. MyIGW로 생성하였습니다. 아직 VPC 와도 연결(detached)이 되어 있지 않습니다.

![AWS VPC](./../../images/aws/createvpc/1_LWJIEbf20JNG5qFyI6dCCQ.png)

방금 생성한 Internet Gateway를 MyVPC에 attach 해주겠습니다.

![AWS VPC](./../../images/aws/createvpc/1__cth7NePC5MOcFpEQbi9WA.png)

VPC에 연결해줬다고 인터넷 통신이 되지는 않습니다. 인터넷 통신이 하기 위해서는 IGW를 Route Table 에 추가해줘야 합니다.

Destination을 0.0.0.0/0 으로 설정하였고, Target을 방금 생성한 IGW (igw-04a60ddb9718c282f) 을 지정해주었습니다.

![AWS VPC](./../../images/aws/createvpc/1_nYEbAX0xgs6DBB0VfqS0VQ.png)

>
> 0.0.0.0/0 의미는 이미 지정된 Routing Table의 주소를 제외한 모든 주소를 의미합니다. 여기서는 10.10.0.0/16 주소 안에 있는 주소는 Local로 Routing을 하고 그 외의 모든 주소는 IGW로 Routing하라는 의미입니다.
> 

### 5. SecurityGroup
VPC를 생성하면 Default SecurityGroup이 생성되지만, 기본값을 사용하지 않고 MySecurityGroup을 생성해 사용하겠습니다.

![AWS VPC](./../../images/aws/createvpc/1_A9GDnB5LXgyMW28ExIdUCA.png)

그리고, SSH 접속이 가능하도록 Inbound Rule을 추가합니다.

![AWS VPC](./../../images/aws/createvpc/1_H4lQwJ4xnZWqhYdeSaczjg.png)

### 6. EC2 생성해 접속 테스트
MyVPC 안에 테스트할 EC2를 하나 생성하겠습니다. Subnet (MySubnet-2a) 안에 MySecurityGroup을 사용하도록 설정합니다.

![AWS VPC](./../../images/aws/createvpc/1_XyFsQx68MALBb5w3aSvwnA.png)

EC2를 생성하고 나서 Elastic IP를 할당하도록 하겠습니다.

![AWS VPC](./../../images/aws/createvpc/1_Eg3aG6uMf1VFap8tKp6yYA.png)

Elastic IP로 SSH 접속이 잘 되는지 테스트해보면 정상적으로 접속이 됩니다.

```powershell
MackBook-Pro:.aws redwood$ ssh -i "aws-redwood.pem" ec2-user@54.180.67.167
__|  __|_  )
_|  (     /   Amazon Linux AMI
___|\___|___|
https://aws.amazon.com/amazon-linux-ami/2018.03-release-notes/
[ec2-user@ip-10-10-1-91 ~]$
```
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
# 인스턴스 연결 중 오류 발생: 연결 시간 초과

## 서브넷의 라우팅 테이블 확인

VPC 외부로 지정된 모든 트래픽을 VPC의 인터넷 게이트웨이로 보내는 경로가 필요합니다.

- https://console.aws.amazon.com/ec2/에서 Amazon EC2 콘솔을 엽니다.
- 탐색 창에서 인스턴스를 선택한 다음 인스턴스를 선택합니다.
- [네트워킹(Networking)] 탭에서 [VPC ID] 및 [서브넷 ID(Subnet ID)]의 값을 기록합니다.
- https://console.aws.amazon.com/vpc/에서 Amazon VPC 콘솔을 엽니다.
- 탐색 창에서 [Internet Gateways]를 선택합니다. VPC에 인터넷 게이트웨이가 연결되어 있는지 확인합니다. 
- 그렇지 않은 경우 [인터넷 게이트웨이 생성(Create internet gateway)]을 선택하고 인터넷 게이트웨이의 이름을 입력한 다음 [인터넷 게이트웨이 생성(Create internet gateway)]을 선택합니다. 그런 다음 생성한 인터넷 게이트웨이에 대해 [작업(Actions)], [VPC에 연결(Attach to VPC)]을 선택하고, VPC를 선택한 다음 [인터넷 게이트웨이 연결(Attach internet gateway)]을 선택하여 VPC에 연결합니다.

- 탐색 창에서 서브넷을 선택한 후 해당 서브넷을 선택합니다.
- [라우팅 테이블(Route table)] 탭에서 대상 위치로 0.0.0.0/0 경로가 있으며, VPC의 대상으로 해당 인터넷 게이트웨이가 있는지 확인합니다. IPv6 주소를 이용해 인스턴스에 연결하는 경우 인터넷 게이트웨이를 가리키는 모든 IPv6 트래픽(::/0)에 대한 경로가 있는지 확인합니다. 그렇지 않으면 다음을 수행하십시오.

  - 라우팅 테이블의 ID(rtb-xxxxxxxx)를 선택해 해당 라우팅 테이블로 이동합니다.
  - 라우팅 탭에서 라우팅 편집을 선택합니다. 라우팅 추가를 선택하고 대상 위치로 0.0.0.0/0을, 대상으로 인터넷 게이트웨이를 사용합니다. IPv6의 경우 라우팅 추가를 선택하고 대상 위치로 ::/0을, 대상으로 인터넷 게이트웨이를 사용합니다.
  - 라우팅 저장을 선택합니다.

## 네트워크 ACL(액세스 제어 목록)내 서브넷 유무 확인.

네트워크 ACL이 포트 22(Linux 인스턴스의 경우) 또는 포트 3389(Windows 인스턴스의 경우)에서 로컬 IP 주소로부터 전송되는 트래픽을 허용해야 합니다. 또한 임시 포트(1024~65535)로의 아웃바운드 트래픽도 허용해야 합니다.

- https://console.aws.amazon.com/vpc/에서 Amazon VPC 콘솔을 엽니다.
- 탐색 창에서 서브넷을 선택합니다.
- 서브넷을 선택합니다.
- [네트워크 ACL(Network ACL)] 탭의 [인바운드 규칙(Inbound rules)]에서 규칙이 컴퓨터의 필수 포트에서 트래픽을 허용하는지 확인합니다. 허용하지 않을 경우 트래픽을 차단하는 규칙을 삭제하거나 수정합니다.
- [아웃바운드 규칙(Outbound rules)] 탭에서 규칙이 임시 포트에서 컴퓨터로의 트래픽을 허용하는지 확인합니다. 허용하지 않을 경우 트래픽을 차단하는 규칙을 삭제하거나 수정합니다.



---
layout: single
title:  "[AWS] Jenkins에 GitLab 저장소 연동"
excerpt: "AWS EC2 개인학습용 자료#2"

categories:
  - aws-study
tags:
  - [AWS, Jenkins]

toc: true
toc_sticky: true
 
date: 2022-04-14
last_modified_at: 2022-04-14
---
# GitLab repository와 Jenkins 연동

## EC2 접속

> $ ssh -i your-pem-file.pem ec2-user@your-ec2-dns-주소

- your-pem-file.pem: EC2 인스턴스 생성 시 설정한 키 페어 이름
- your-ec2-dns-주소: ec2 퍼블릭IPv4 DNS 주소

## git 설치

> $ sudo yum install git

## SSH 접속을 위한 Key 생성
- GitLab은 SSH Public Key로 인증 후 사용할 수 있기 때문에 GitLab을 연동시키기 위해서는 SSH 접속을 위한 키 생성이 필요하다.

> $ ssh-keygen -t rsa -C "your-gitlab-email"

- your-gitlab-email: 연결하고자 하는 GitLab 계정 이메일 주소

>
> 1번: Key 파일 저장 위치를 묻는 내용으로 디폴트로 정해준 위치에 저장할거면 그냥 엔터⏎!
>         만약 위치를 변경하려면 원하는 위치 경로를 입력하면 된다.
> 2번: 해당 Key 파일의 비밀번호를 입력하라는 내용이다. (연동 시 필요하니 꼭 기억해두기❗️)
>         만약 비밀번호 입력을 원하지 않으면 그냥 엔터⏎!
> 3번: 2번에서 입력한 비밀번호 확인
> 
> ![AWS GitLab](./../../images/aws/gilab/aws_gitlab_01.png)
> 

## SSH Key 권한 부여
SSH Key 생성이 완료되면 'cd ~/.ssh' 위치에 id_rsa, id_rsa.pub 두 가지 파일로 저장이 된다.
해당 파일들은 읽기, 쓰기, 실행 모든 권한을 사용자만 가져야 하기 때문에 권한을 부여해준다.

> $ chmod 700 ~/.ssh/id_rsa*

##  pub key 값 복사
SSH Key 생성이 완료되면 'cd ~/.ssh' 위치에 id_rsa, id_rsa.pub 두 가지 파일로 저장이 된다.
해당 파일들은 읽기, 쓰기, 실행 모든 권한을 사용자만 가져야 하기 때문에 권한을 부여해준다.

> $ cat ~/.ssh/id_rsa.pub

- ssh-rsa 부터 입력했던 GitLab 계정 이메일 주소까지 모두 Key 값이기 때문에 전부 다 복사❗️

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_02.png)

## GitLab 로그인 후 SSH Keys 등록
1. GitLab 로그인

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_03.png)

2. GitLab 화면 우측 상단 프로필 선택 후 Edit profile로 이동

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_04.png)

3. SSH Keys 메뉴 이동

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_05.png)

4. 복사한 pub key 값 붙여넣은 후 Add key 버튼 클릭

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_06.png)

## Jenkins에 git plugin 설치
1. Jenkins 로그인

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_07.png)

2. Jenkins 관리 > 플러그인 관리

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_08.png)

3. 설치 가능 탭에서 git plugin 검색 후 해당 플러그인 설치
(나는 이미 설치되어 있기 때문에 예시 이미지는 설치된 플러그인 목록 탭이다.)
설치 완료 후 Jenkins 재시작 (설치 페이지 맨 하단에 '설치가 끝나고 실행중인 작업이 없으면 Jenkins 재시작' 문구에 체크하면 설치 완료 후 자동 재시작)

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_09.png)

##  jenkins 새로운 Item 생성
새로운 Item을 선택 후 원하는 Project명을 입력 후 Freestyle project로 생성

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_10.png)

##   Jenkins Project 설정
소스 코드 관리에서 Git 선택 및 빌드 원하는 Branch 설정
GitLab repository 중 빌드 원하는 repository를 선택하여 SSH 주소 복사

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_11.png)

Jenkins 소스 코드 관리 화면에서 Git에 체크 후 Repository URL에 복사한 SSH 주소 붙여넣기
그 후 아래에 Branch Specifier 부분에는 빌드 할 GitLab Branch명을 넣어주면 된다.
기본 설정은 master로 되어있는데 나는 develop 브랜치를 사용할 예정이라 수정해줬다.

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_12.png)

Credentials(private key) 생성

Kind: Credentials 종류 선택 (여기에서는 SSH Key를 사용할 것이기 때문에 SSH Username with private key 선택)
ID: Credentials명으로 사용하고 싶은 이름 입력
Description: Credentials 설명이 필요하다면 이 부분에 입력
Username: Credentials 사용자 입력 (나는 해당 SSH Key를 GitLab에서 사용할 예정이니 나중에 알아보기 쉽도록 GitLab 계정 입력)

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_13.png)

아래로 스크롤 해보면 Enter derectly가 보일 것이다. 이 부분 체크 후 Add 버튼을 클릭하여 SSH Private Key 값을 넣을 준비를 한다.

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_14.png)

AWS EC2 서버에서 발급 받은 SSH Private Key 값 입력

//SSH Private Key 값 가지고 오는 명령어
$ cat ~/.ssh/id_rsa
'----BEGIN RSA PRIVATE KEY----' 부터 '----END RSA PRIVATE KEY----' 까지 전부 복사

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_15.png)

복사한 SSH Private Key 값 붙여넣기

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_16.png)

생성한 Credentials 선택
앞에서 생성한 Credentials Key를 선택한다.
만약 위에서 Repository URL을 입력했을 때 Failed to connect to repository : Command ~~ returned status code 128: ~~~ Permission denied (publickey) 이런 오류 메시지가 나타났었다면 Credentials Key 선택 후 몇 초 기다리면 해당 오류 메시지는 사라질 것이다.

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_17.png)

나는 여기에 GitLab Webhook 연동까지 넣을 예정이기에 이어서 해당 설정 부분까지 작성했다.
만약 GitLab Webhook 연동이 필요하지 않다면 여기까지 설정 후 Jenkins 설정 화면에서 Build 탭 부분에 각자 프로젝트에 맞는 빌드 방법만 추가해서 사용하면 된다!👍

# Jenkins에 GitLab Webhook 설정

## Jenkins 빌드 유발 설정
'Build when a change is pushed to GitLab. GitLab webhook ~~' 이 부분에 체크해주고 GitLab webhook URL: 뒤에 적혀있는 URL은 GitLab에서 설정 시 사용할 예정이니 기억해둔다.
그리고 고급 버튼 클릭🖱

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_18.png)

이전 단계에서 고급 버튼을 누르면 나오는 화면으로 아마 처음엔 예시 이미지와 달리 공란일 것이다.
그럼 Generate 버튼을 클릭해서 예시 이미지처럼 Secret token을 생성시킨다.
(이미 토큰이 있는 경우라면 Generate 버튼 클릭 시 새로운 토큰으로 변경되니 주의하자❗️)
이 토큰 역시 GitLab에서 사용할 예정이니 기억해둔다.

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_19.png)

## GitLab Webhook 설정
Jenkins와 연결할 GitLab Repository Webhook 설정 화면으로 이동한다.

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_20.png)

Jenkins 빌드 유발 설정 시 기억해뒀던 URL과 Secret token 정보 입력 후 저장
나는 Jenkins 소스 코드 관리 부분에서 develop 브랜치를 사용하겠다고 했기 때문에 push events 부분도 develop으로 설정했다.

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_21.png)

테스트 진행으로 설정 확인
생성한 Project Hooks에서 Push events 테스트 진행!

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_22.png)

이렇게 200 코드가 보이면 성공!

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_23.png)

Jenkins 상에서는 이렇게 Build History가 생긴것을 확인해볼 수 있다.

![AWS GitLab](./../../images/aws/gilab/aws_gitlab_24.png)

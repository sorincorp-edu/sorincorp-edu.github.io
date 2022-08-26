---
layout: single
title:  "[AWS] git과 gitlab 설치"
excerpt: "AWS git과 gitlab 설치"

categories:
  - aws-study
tags:
  - [AWS, gitlab]

toc: true
toc_sticky: true
 
date: 2022-04-15
last_modified_at: 2022-04-15
---
## 1. git 설치
일단 설치가 되어 있는지 확인.

> $ git --version
11-1

- 1.8.3.1 버전이 설치되어 있습니다.
- 최신 버전을 사용하기 위하여 제거하겠습니다.

> $ sudo yum remove git

- 최신 버전을 사용하기 위해서 소스코드를 컴파일 해서 설치를 할 수도 있으나 업그레이드나 여러가지 불편함이 있기에 Wandisco 사에서 운영하는 repository를 사용하겠습니다. 해당 repository를 사용하기 위하여 아래의 링크를 install 합니다.

> $ yum install http://opensource.wandisco.com/centos/7/git/x86_64/wandisco-git-release-7-1.noarch.rpm

- 다시 git을 install해줍니다.

> $ sudo yum install git

- 다시 install후 다시 버전을 확인해봅니다.

> git --version
> git version 2.27.0

## 2. gitlab 설치
- 공식 홈페이지의 내용을 따라하면 손쉽게 설치. 살짝 설정을 바꿔줄 부분은 있습니다.

https://about.gitlab.com/installation/#centos

- 공식 홈페이지는 아래가 처음 설치 할 것으로 소개하고 있는데요, 아마 기본적으로 CentOS를 설치할 때 이미 설치되어 있는 것들이 있을 것입니다.
### 기본설정
> $ sudo yum install curl policycoreutils openssh-server openssh-clients 
> $ sudo systemctl enable sshd 
> $ sudo systemctl start sshd 
> $ sudo yum install postfix 
> $ sudo systemctl enable postfix 
> $ sudo systemctl start postfix 

> $ sudo yum install firewalld
> $ sudo systemctl unmask firewalld
> $ sudo systemctl enable firewalld
> $ sudo systemctl start firewalld

> $ sudo firewall-cmd --permanent --add-service=http 
> $ sudo firewall-cmd --permanent --add-service=https

> 참고) $ sudo systemctl reload firewalld

- firewalld명령어를 사용하는데 최소설치를 했을 때에는 자동으로 설치 되지 않기 때문에 firewalld 명령어를 사용 할 경우 firewall-cmd: command not found라는 오류 메시지가 발생. 이 오류 메시지는 간단하게 설치만 해주면 해결이되는데, yum을 통해서 설치.


설치된 패키지 확인은 아래의 명령어로 확인 하시면 됩니다.

> $ yum list installed | grep 패키지명

### gitlab 설치 

> $ curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.rpm.sh | sudo bash
> $ sudo yum install gitlab-ce

- gitlab설치 파일을 다운로드 받고 gitlab 설치.

### 설정변경 
- 설정을 바꿔줄 부분은 3가지.
- gitlab페이지가 기본적으로 80포트를 사용하고 인증 관련된 unicorn 부분은 8080포트를 사용. 
- 해당 포트가 Apache와 Tomcat에서 사용시 충돌발생. 
- 이메일을 사용하기 위해 smtp를 설정합니다.

- 아래의 경로의 gitlab설정파일을 vi에디터로 오픈.

> $ vi /etc/gitlab/gitlab.rb
> 11-3

오픈 하자마자 보시면 external_url 항목이 보이게 됩니다.
gitlab페이지가 보여지는 웹사이트 포트번호입니다.
원하시는 포트번호를 입력합니다. 나중에 방화벽에서도 오픈시킬 번호입니다.
external_url ‘http://localhost:포트번호'
인증 및 unicorn 과 관련된 부분이 두군데가 있습니다. 에디터 화면에서 / 입력한후 8080으로 입력하시면 쉽게 찾으실수 있습니다.
8080으로 되어 있는 줄에서 반드시 ‘#’으로된 주석을 제거 하시고 8080 번호를 다른 포트로 변경합니다.
변경하실때 위에서 변경한 포트와 다른 포트로 변경합니다.
내부적으로 인증과 관련한 포트 번호 입니다. 이 포트는 방화벽을 해제할 필요는 없습니다.
11-4 11-5

이제 smtp설정입니다. 이는 gitlab에서 유저 인증이나 각종 알림의 용도로 사용됩니다.
에디터 화면에서 'smtp_enable'라는 글자로 검색을 해봅니다. 검색은 / 명령어 입니다.
11-6

저는 위 설정을 google smtp정보를 입력할 것입니다. 그리고 입력하시고 주석을 제거합니다.
위 설정은 필수는 아닙니다.
설정을 하지 않으면 유저 생성할때 패스워드 생성할때 유저에게 이메일 보내어 인증이 된 사용자에게 패스워드를 설정하게 되는데, 이는 사용자를 생성하고 다시 관리자가 다시 사용자 정보에 재진입하여 패스워드를 설정해주면 됩니다.

구글 smtp설정은 아래 링크를 참조하세요.

https://support.google.com/a/answer/176600?hl=ko

기타 메일 설정은 아래 링크에 더 있습니다.
https://docs.gitlab.com/omnibus/settings/smtp.html

gitlab_rails['smtp_enable'] = true 
gitlab_rails['smtp_address'] = "smtp.gmail.com" 
gitlab_rails['smtp_port'] = 587 
gitlab_rails['smtp_user_name'] = "my.email@gmail.com" 
gitlab_rails['smtp_password'] = "my-gmail-password" 
gitlab_rails['smtp_domain'] = "smtp.gmail.com" 
gitlab_rails['smtp_authentication'] = "login" 
gitlab_rails['smtp_enable_starttls_auto'] = true 
gitlab_rails['smtp_tls'] = false 
gitlab_rails['smtp_openssl_verify_mode'] = 'peer'
변경이 완료되었으면 저장하고 빠져 나옵니다.
이제 방화벽 설정을 합니다. 첫번째로 변경한 gitlab페이지가 보여지는 웹사이트 포트번호만 오픈 하시면됩니다.
$ firewall-cmd --permanent --add-port=변경한포트/tcp 
$ firewall-cmd --reload
그리고 홈페이지에 3번 항목을 실행합니다.

$ sudo gitlab-ctl reconfigure
11-7

이제 설치가 완료되었습니다. 웹브라우저에서 설정변경한 포트로 진입해봅니다.
http://서버아이피:변경한포트번호
입력하고 들어가시면 아래의 화면이 처음 나타납니다.
root 계정의 패스워드 설정화면입니다. 원하시는 암호로 설정하고 root 아이디로 로그인합니다.
11-8

root로 로그인하면 나오는 화면입니다.
11-9

위쪽에 스패너 아이콘이 관리자용 설정 메뉴입니다. 이곳에서 유저 생성이 가능합니다.
11-10

이제 같이 사용하실 유저를 초대 및 생성하시고 프로젝트를 설정하신 후 공동으로 작업이 가능해졌습니다.

설치가 예상보다 많이 편했던듯합니다. 다른 블로그의 글을 보면 예전 버전에는 ruby도 따로 설치에 db설정등 모든것을 수동으로 해주어야했었던듯 한데 이제는 손쉽게 설치를 지원하는 것 같습니다.

gitlab은 github과 ui나 기능들이 많이 흡사하여 사용하기가 편한 것 같습니다.


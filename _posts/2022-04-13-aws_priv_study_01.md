---
layout: single
title:  "[AWS] AWS EC2 연결시 VSCode 사용방법 등 정리"
excerpt: "AWS EC2 개인학습용 자료#1"

categories:
  - aws-study
tags:
  - [AWS]

toc: true
toc_sticky: true
 
date: 2022-04-13
last_modified_at: 2022-04-13
---
# EC2 연결법

## VSCode Remote-ssh 설정 
1. VSCode의 Extension에서 Remote Development를 설치해 줍니다.  

- Remote Development 기능은 SSH, Containers, WSL 3가지 옵션
- SSH를 사용하여 EC2 인스턴스에 VSCode를 연결하도록 하겠습니다. 


2. Remote-SSH Configuration 설정
- VSCode에서 F1을 누른 뒤, configuration을 검색 
- Remote-SSH: Open COnfiguration File기능을 선택

ssh configuration 파일을 다음과 같이 수정합니다. 

Host First-AWS-EC2
    HostName ec2-~~~~~~.compute.amazonaws.com
    User ec2-user
    ForwardAgent yes
    IdentityFile ~/.ssh/******Key.pem

> Host: 접속할 EC2의 별명을 입력. 추후 Host에 입력한 별명으로 EC2를 구분.
> HostName: AWS EC2 인스턴스의 Public IP. 
> User: 리눅스의 경우 ec2-user 을 사용
> IdentifyFile: AWS EC2 인스턴스 pem key의 경로입니다.  

- 윈도우 환경에서는 .ssh 경로의 생성을 위해 ssh-keygen 명령어 실행 
- ssh-keygen 명령어는 git 설치시에 ssh-keygen이 함께 설치.
- cmd를 열고 ssh-keygen 명령어로 공개키와 비밀키 각각을 생성한다.

> ssh-keygen -t rsa

- C:\Users\{사용자계정}\.ssh에 키생성

- ssh-keygen 부연설명

> 키를 저장할 경로 (기본값: $HOME/.ssh/id_rsa)
> passphrase 입력 (추가로 사용할 암호, 기본값 없음)
> 엔터를 누르면 기본값. jenkins상에서 사용시에는 passphrase를 넣으면 안되고 기본값으로 사용.
> 기본값으로 사용하면 자신의 홈 디렉토리 밑에 .ssh 폴더 밑에 id_rsa와 id_rsa.pub 파일이 생성
> 각각 비밀키와 공개키. 
> 기본적으로, 공개키는 공개, 비밀키는 비밀로 자신만 갖고 있어야 됨.


3. Remote-SSH: Connect to Host 

- VSCode에서 F1을 누른 뒤, connect를 검색. 
- Remote-SSH: Connect to Host... 를 입력하면 EC2에 접속. 
- 원격 호스트의 OS를 선택하라고 나오는데, Linux를 선택.

4. EC2 VSCode 연결확인 
- VSCode 좌측 Remote Explorer를 통해 EC2 VSCode에 접속하였음을 확인. 

## putty를 이용한 ssh 연결
1. pem 파일에서 ppk파일 생성방법

- C:\Program Files\PuTTY 에서 puttygen.exe 실행
- pem 파일 load
- RSA Type선택 확인 Save private key 버튼 클릭

2. Putty를 이용한 ssh 접속
- Host Name에 'ec2-user@EC2서버 IP입력', port : 22
  
  > ec2-user@ec2-~~~~.compute.amazonaws.com

- [connect] - [SSH] - [Auth] 메뉴에서 private key file ~~ 에 ppk파일 선택

3. open 클릭 후 연결확인

## NGINX 와 Apache 비교
- Nginx란 Event-driven 구조로 설계되어 비동기 방식으로 처리되는 웹서버
- Nginx를 Apache와 많이 비교하게 되는데, 두개의 가장 큰 차이는 서버의 트래픽 처리방식.
  - Apache는 Thread 기반으로 작동: 서버 요청이 Thread와 1:1로 매치되어 처리되는 방식.
  - Nginx는 Event-driven 방식으로 작동: 여러 요청들을 비동기 방식으로 처리
    동시 접속 요청이 많아도 Thread 생성 비용이 존재하지 않음. (Node.js의 환경과 비슷합니다!)

 >
 > Nginx를 프록시서버로 앞단에 놓고 Node.js를 뒤쪽에 놓는게 버퍼 오버플로에 대한 위협을 일부분 방지.
 > 직접적인 웹서버로의 접근을 차단하고 간접적으로 한 단계를 더 거침으로써 보안적인 부분을 처리 가능
 >


# Amazon Linux 2에 NGINX 설치하기
## 1. Check repo
- 우선 사용 중인 ec2에 repository를 확인

> 
> $ yum info nginx
> 
> Loaded plugins: extras_suggestions, langpacks, priorities, update-motd
> 2 packages excluded due to repository priority protections
> Error: No matching Packages to list
>

- 찾을 수가 없어서 Error가 발생
- 만약 정보가 정상적으로 보이신다면 아래의 2, 3번 skip

## 2. Add repo
- repository를 등록
- vi 편집기로 nginx.repo를 열어 하단의 정보를 입력하고 저장

> 
> $ sudo vi /etc/yum.repos.d/nginx.repo
> [nginx]
> name=nginx repo
> baseurl=http://nginx.org/packages/centos/7/$basearch/
> gpgcheck=0
> enabled=1
> 
 

## 3. Check repo
- 다시 repository를 확인
- 정상확인 가능
```powershell
$ yum info nginx
Loaded plugins: extras_suggestions, langpacks, priorities, update-motd
amzn2-core                                                                                                          | 3.7 kB  00:00:00     
nginx                                                                                                               | 2.9 kB  00:00:00     
nginx/x86_64/primary_db                                                                                             |  72 kB  00:00:01     
Available Packages
Name        : nginx
Arch        : x86_64
Epoch       : 1
Version     : 1.20.2
Release     : 1.el7.ngx
Size        : 790 k
Repo        : nginx/x86_64
Summary     : High performance web server
URL         : https://nginx.org/
License     : 2-clause BSD-like license
Description : nginx [engine x] is an HTTP and reverse proxy server, as well as
            : a mail proxy server.
```
 
## 4. install nginx
- nginx를 설치

> $ sudo yum install nginx

- 간단히 설치가 완료

  >
  > sudo를 사용하는 가장 흔한 이유는 패키지 관리자를 통해 PC에서 프로그램을 추가 또는 제거하기 위해서다. 여기서 언급하는 세 가지 주요 패키지 관리자는 각각 명령 인수와 구문 측면에서 상이하지만 세 가지 기본적인 동작을 수행한다는 면에서는 동일하다. 즉, 패키지 설치, 패키지 제거, 시스템의 모든 패키지 업그레이드다. (참고: 루트로 로그인하지 않은 경우 이러한 명령 앞에 sudo를 사용해야 한다.)
  > 아치(Arch) 리눅스에서 pacman을 사용한 시스템 업그레이드. pacman 명령 앞에 sudo를 사용했음을 볼 수 있다.
  > 
  > yum(레드햇/페도라/센트OS)
  > 패키지 설치: yum install <패키지>
  > 패키지 제거: yum remove <패키지>
  > 시스템 업그레이드: yum update
  > 
  > apt(데비안/우분투/민트)
  > 패키지 설치: apt install <패키지>
  > 패키지 제거: apt remove <패키지>
  > 시스템 업그레이드: apt update 또는 apt upgrade
  > 
  > pacman(아치/만자로)
  > 패키지 설치: pacman -S <패키지>
  > 패키지 제거: pacman -R <패키지>
  > 시스템 업그레이드: pacman -Syu
  > 

## 5. Version Check
- nginx 버전 확인

>
> $ nginx -v
> nginx version: nginx/1.16.1
>

## 6. NGINX 사용하기
- nginx의 기본적인 명령
- start nginx : nginx 기동

> $ sudo systemctl start nginx

  >
  > systemctl(Systemd)
  > 아주 오랫동안 데몬(daemon)이라는 백그라운드 프로그램은 initscript라는 일련의 스크립트를 사용해 시작됐다. 그러나 초보자에게 initscript는 읽고 해석하기도, 변경하기도 어려웠다. 비교적 최근 Systemd라는 서비스 관리 애플리케이션이 initscript를 대체했다. 최신 리눅스 배포판을 사용한다면 필요한 서비스를 시작하는 역할은 Systemd가 맡고 있을 가능성이 높다.
  > Systemd에 대한 가장 큰 불만 중 하나는 할 수 있는 일이 너무 많다는 것이다. (유닉스 프로그램은 보통 한 가지 일을 하되, 아주 잘 하는 것을 목표로 만들어진다.) 
  > 
  > systemctl start <서비스 이름> : 서비스를 시작
  > systemctl restart <서비스 이름> : 서비스가 실패, 구성이 변경된 경우 재시작
  > systemctl stop <서비스 이름> : 서비스를 중지
  > systemctl enable <서비스 이름> : 부팅 시 서비스를 활성화
  > systemctl disable <서비스 이름> :  서비스를 비활성화해서 부팅 시 시작되지 않음
  > 

- stop nginx : nginx 중지

> $ sudo systemctl stop nginx

- status nginx : nginx 확인

> $ sudo systemctl status nginx
```
[0m nginx.service - nginx - high performance web server
   Loaded: loaded (/usr/lib/systemd/system/nginx.service; disabled; vendor preset: disabled)
   Active: active (running) since Thu 2020-03-12 04:38:22 UTC; 43s ago
     Docs: http://nginx.org/en/docs/
  Process: 6452 ExecStart=/usr/sbin/nginx -c /etc/nginx/nginx.conf (code=exited, status=0/SUCCESS)
Main PID: 6453 (nginx)
   CGroup: /system.slice/nginx.service
           6453 nginx: master process /usr/sbin/nginx -c /etc/nginx/nginx.conf
           6455 nginx: worker process


Mar 12 04:38:22 ip.ap-northeast-2.compute.internal systemd[1]: Starting nginx - high performance web server...
Mar 12 04:38:22 ip.ap-northeast-2.compute.internal systemd[1]: PID file /var/run/nginx.pid not readable (yet?) after start.
Mar 12 04:38:22 ip.ap-northeast-2.compute.internal systemd[1]: Started nginx - high performance web server.
```

- 프로세스 확인 명령어로도 확인 가능

```
$ ps -ef | grep nginx
root      6453     1  0 04:38 ?        00:00:00 nginx: master process /usr/sbin/nginx -c /etc/nginx/nginx.conf
nginx     6455  6453  0 04:38 ?        00:00:00 nginx: worker process
ec2-user  6593 27440  0 04:40 pts/0    00:00:00 grep --color=auto nginx
```
 
- 웹서비스 확인
http://hostname:80 or http://hostname


#### 기본 설정 파일
- nginx를 설정할 수 있는 기본 파일의 경로

>
> $ sudo find / -name nginx.conf
> /etc/nginx/nginx.conf
> 
> $ sudo vi /etc/nginx/nginx.conf
> 

nginx.conf를 보면 아래의 default.conf 파일은 include 되어있습니다

> $ sudo vi /etc/nginx/conf.d/default.conf

```
server {
    listen       80; //port 설정
    server_name  localhost;


    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;


    location / {
        root   /usr/share/nginx/html; //자신의 컨테이너 프로젝트 경로를 넣어줍니다
        index  index.html index.htm;
    }


    #error_page  404              /404.html;


    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }


    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}


    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}


    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}
```



## AWS Linux 를 사용하여 Jenkins설치

> $ cat /etc/*release

```
NAME="Amazon Linux"
VERSION="2"
ID="amzn"
ID_LIKE="centos rhel fedora"
VERSION_ID="2"
PRETTY_NAME="Amazon Linux 2"
ANSI_COLOR="0;33"
CPE_NAME="cpe:2.3:o:amazon:amazon_linux:2"
HOME_URL="https://amazonlinux.com/"
Amazon Linux release 2 (Karoo)
```

Jenkins 설치에 앞서 update를 먼저 진행하도록 합니다.

> $ sudo yum update -y

그다음 Jenkins 설치를 진행하려고 합니다. Jenkins 공식 홈페이지에 나와있는 설치가이드 대로 설치해보도록 하겠습니다.

>
> $ sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
> $ sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
> $ yum install -y jenkins
> 

설치후 현재 jenkins의 서비스의 상태를 확인했더니

> $ systemctl status jenkins.service 


다음과 같은 Error로인해 Jenkins 구동에 실패했다는 내용이었다. 이유는 즉 자바가 설치가 안되어있었다.

추가적으로 Java 11 amazon corretto를 설치한다음 restart시켰다.

$ sudo yum install java-11-amazon-corretto
$ systemctl restart jenkins.service
Service가 제대로 올라갔다면 xxx.xxx.xxx.xxx:8080으로 접근시 Jenkins Getting Started화면을 볼 수 있습니다.

하지만 저희는 바로 Jenkins를 사용하지 않고 앞단에 NginX를 두고 reverseProxy를 활용하여 사용하도록 세팅해보도록 하겠습니다.

# nginx를 다운받으려 했으나 sudo amazon-linux-extras install -y nginx1를 사용하여 다운받으라고하였다.
$ sudo yum install -y nginx (x)
$ amazon-linux-extras install -y nginx1(o)

# 설치후 nginx 버전 확인
$ nginx -v
nginx version : nginx/1.18.0

# nginx service 를 시작시킨다.
$ sudo systemctl start nginx.service

#만약 already port 가 더서 위의 명렁어로 올라가지 않는다면 
$ /etc/init.d/apache2 stop  
또는 
$ sudo pkill -f nginx & wait $!
를 통해 80포트를 차지하고 있는 부분을 내려준후 다시 서비스를 올려보길 추천드린다.


다음과 같이 status가 뜬다면 정상 동작한다고 보시면 됩니다.

그럼 nginx 를 설치하였으니 nginx Port 80번에 Jenkins Port 8080을 연결하도록 하겠습니다.

$ vi /etc/nginx/nginx.conf 설정을 연다음

server {

    # 추가할 내용 
    location / {
                proxy_pass http://localhost:8080;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
        }
    ...
}

## 설정 후 
$ sudo systemctl restart nginx.service
location을 추가시켜 ip:80/ 으로 들어왓을때 (jenkins)localhost:8080 으로 proxy pass 하도록 세팅하고 header에 각각의 값을 저장하여 넘기도록 한다.

nginx를 재시작 하였다면 다시한번 ip:80 포트를 통해 접근해보면 localhost:8080 포트였던 Jenkins 로 연결되는 것을 확인할 수 있다.


 
따라서 Jenkins로 접근하는 8080포트를 AWS 보안그룹 인바운드포트에서 제거한후 nginx가 사용할 80포트만 남겨둡니다.

여기까지 했다면 나머지 Jenkins 설정도 마저 해보도록 하겠습니다 .



Jenkins 에서 /var/lib/jenkins/secrets/initialAdminPassword 에 있는 Administrator Password를 입력하라고 합니다 .

# initialAdminPassword안에 들어있는 비밀번호를 복사하여 붙여놓고 실행합니다.
vi /var/lib/jenkins/secrets/initialAdminPassword
그다음 나머지 부분들은 천천히 읽어보고 설정해주시면 됩니다 !!






Gitlab runner 란?, AWS EC2 인스턴스 Gitlab Runner 등록하기
https://nearhome.tistory.com/140


젠킨스 파이프라인을 활용한 배포 자동화
https://velog.io/@sihyung92/%EC%9A%B0%EC%A0%A0%EA%B5%AC2%ED%8E%B8-%EC%A0%A0%ED%82%A8%EC%8A%A4-%ED%8C%8C%EC%9D%B4%ED%94%84%EB%9D%BC%EC%9D%B8%EC%9D%84-%ED%99%9C%EC%9A%A9%ED%95%9C-%EB%B0%B0%ED%8F%AC-%EC%9E%90%EB%8F%99%ED%99%94


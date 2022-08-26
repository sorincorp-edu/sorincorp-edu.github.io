---
layout: single
title:  "[Lecture] - JAVA, Spring 개발환경"
excerpt: "JAVA STS 개발환경정리"

categories:
  - Lecture
tags:
  - [Lecture, Java, Servlet]

toc: true
toc_sticky: true
 
date: 2022-03-05
last_modified_at: 2022-03-05
---

# 기본개발환경
## JAVA, Spring, IDE 개발환경 
1. JDK 버전 : OpenJDK 11.0.2_x64
2. STS 버전 : 4.13.1
3. Spring 버전 : Spring Boot 2.6.4 Spring v5.3.16
4. Spring Security : 5.6.1
5. lombok : 1.18.22
6. Gradle 버전 : 7.4.1
7. Docker : 20.10.12
8. Tomcat 버전 : 9.0.58
9. Database 버전 : MS SQL Server 2019-latest
10. Database Tool : SSMS 18.11.1

## 1. JDK 설치
### 1-1. 다운로드
 - https://jdk.java.net/11/ 접속
 - OpenJDK Archive 항목 클릭
 - Windows / x64 오른쪽의 zip 클릭하여 openjdk-11.0.2_windows-x64_bin.zip 다운로드

### 1-2. 압축해제 및 이동
 - C:\00_Lecture 폴더에 OpenJDK 폴더 생성
 - openjdk-11.0.1_windows-x64_bin.zip 압축해제
 - jdk-11.0.1 폴더를 OpenJDK 폴더 안으로 이동

### 1-3. 시스템 환경변수 및 Path 등록
 - 시스템 환경변수 등록
 - 변수명	값
   JAVA_HOME	C:\00_Lecture\OpenJDK\jdk-11.0.2
 - Path 등록
   %JAVA_HOME%\bin

### 1-4. 확인
```
C:\Windows\System32> echo %JAVA_HOME%
C:\00_Lecture\OpenJDK\jdk-11.0.2\

C:\Windows\System32> javac -version
javac 11.0.2
```

## 2. STS 설치
### 2-1. 다운로드 ( https://spring.io/tools )
- spring-tool-suite-4-4.13.1.RELEASE-e4.22.0-win32.win32.x86_64.self-extracting.jar 파일 압축 풀기
- contents.zip 파일 압축 풀기 (java -jar spring-tool-suite-4-4.13.1.RELEASE-e4.22.0-win32.win32.x86_64.self-extracting.jar)
- sts-4.13.1.RELEASE 폴더를 STS 설치 위치로 이동

### 2-2. STS 실행
- workspaces 폴더 생성
- STS 실행, 실행 시 Workspaces 지정

### 2-3. STS 설정

 - Eclipse Market 에서 web Developer 검색
   > Eclipse Enterprise Java~~~ 설치
 - Eclipse Market 에서 sonarlint 검색
   > Sonarlint For Eclipse 7.3.~ 설치
 - Window - Preperences 에서 이하 설정변경 
   > 찾기란에 enc 입력
   > General - Workspace : Text File Encoding => UTF-8 
   > CSS, HTML, JSP => UTF-8 
 - JAVA - Installed JREs 에서 설치한 JDK 설정
 - 리스타트 후 설정계속

 >
 > D2코딩폰트 : https://github.com/naver/d2codingfont
 >

 #### Code Template, Formatter 적용

 - git에서 프로젝트 파일을 가져왔을때 소스 Root 또는 README 파일에 Code Template, Formatter 파일에 대한 기술이 있을 경우 해당 파일적용
 - Code Template 적용 : [Windows > Preferences > Java > Code Style > Code Templates]
 - Import 버튼 클릭 후 *****code-template-file.xml 선택.
 - Class 주석은 Class 윗부분에 커서를 위치시킨 후 [Shift + Alt + J] 를, Method 주석은 method안에 커서를 위치시킨 후 [Shift + Alt + J]

 - Formatter 적용 : [Windows > Preferences > Java > Code Style > Formatter]
 - Import 버튼 클릭 후 *****formatter-file.xml 선택.
 - 파일에서 [ctrl + a](영역선택), [ctrl + shift + f] 으로 포메팅실행

## 3. lombok설치
1. https://projectlombok.org/
2. Download 1.18.22




# 이하 설정은 개인로컬환경 설정에 필요없을 경우 굳이 안해도 됨.

## 4. GRADLE 설치
- 폐쇄망 개발환경 등에서만 필요

## 5. DOCKER 설치
도커는 컨테이너 기반의 오픈소스 가상화 플랫폼 이다.

### Docker 장점
1) 빠르고 가벼운 가상화 솔루션 
 - 호스트의 운영체제를 공유하여 필요한 최소한의 리소스만 할당받아 동작하는 방식이기때문에 가볍다. 
 - 즉 ,기존 Hypervisor 엔진을 사용하지 않고, Docker Engine을 통해 Guest OS 없이 실행 가능하다. Guest OS가 없기 때문에 가상머신보다 훨씬 빠른 실행 속도를 보장할 수 있다. 
 - 하드웨어 가상화를 하지 않기 때문에, 메모리 엑세스, 파일 시스템, 네트워크 실행 성능도 뛰어나다.

2) 개발언어에 종속되지 않는다.
 - 개발 언어나 툴에 상관없이 어떠한 애플리케이션이라도 만들 수 있으며, Docker에서 만들어진 애플리케이션은 이동성이 뛰어나며 어디서나 실행될 수 있다.

3) 뛰어난 보안성
 - 서비스가 해킹시에도 각 컨테이너들은 격리되어있기 때문에 원래의 서버에 영향을 미치지 않는다.

### Docker Desktop on Windows 설치
- Docker Toolbox Deprecated
- Windows 10부터 Hyper-V(하드웨어 가상화) 기능을 지원, 대부분의 사용자가 Windows 10 버전으로 넘어가면서 Docker는 더 이상 Docker Toolbox를 지원하지 않음. Virtualbox 6.0 이후로 부터는 Hyper-V와 병행해서 실행이 가능해져 Docker와 Virtualbox를 같이 사용할 수도 있게 되었다. Windows Home 유저는 WSL2를 사용할 수 있어 Docker Desktop은 이를 이용해서 Docker Desktop on Windows Home을 제공한다.

https://docs.docker.com/desktop/windows/install/

### WSL 2 활성화
- WSL2를 이용하면 Windows 환경에서도 Linux를 이용할 수 있고 Docker를 사용할 수 있다.

https://docs.microsoft.com/en-us/windows/wsl/install

### powershell 에서 이하 커맨드 실행
- Linux용 Windows 하위 시스템 활성화
> PS C:\Windows\system32> dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
> 
> 배포 이미지 서비스 및 관리 도구
> 버전: 10.0.19041.844
> 
> 이미지 버전: 10.0.19044.1586
> 
> 기능을 사용하도록 설정하는 중
> [==========================100.0%==========================]
> 작업을 완료했습니다.

- 가상머신 기능 활성화
> PS C:\Windows\system32> dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
> 
> 배포 이미지 서비스 및 관리 도구
> 버전: 10.0.19041.844
> 
> 이미지 버전: 10.0.19044.1586
> 
> 기능을 사용하도록 설정하는 중
> [==========================100.0%==========================]
> 작업을 완료했습니다


- Linux 커널 업데이트 패키지 다운로드

https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi

- WSL2를 기본 버전으로 설정
> PS C:\Windows\system32> wsl --set-default-version 2
>
> WSL 2와의 주요 차이점에 대한 자세한 내용은 https://aka.ms/wsl2를 참조하세요
> 작업을 완료했습니다.

### Docker 설치확인

> docker -v

### Docker Run 해보기 
> docker run hello-world
> docker ps -a


## 6. Docker MSSQL 설치 
### 6-1. Docker MSSQL - pull
```
docker pull mcr.microsoft.com/mssql/server:2019-latest
```
 
### 6-2. Docker MSSQL 설치 - run

```
docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=m2makstp!' -p 11433:1433 --name m2m-mssql -d mcr.microsoft.com/mssql/server:2019-latest
```

### 6-3. SA 암호 변경

```
docker exec -it m2m-mssql /opt/mssql-tools/bin/sqlcmd -S > localhost -U SA -P 'm2makstp!' -Q 'ALTER LOGIN SA WITH PASSWORD="m2makstp!"'
```
 
### 6-4. Container 진입

```
docker exec -it m2m-mssql "bash"
```
 
### 6-5. MSSQL 접속

```
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "m2makstp!"
```

### 6-6. DATABASE 생성 및 사용자 계정 생성, 권한 부여 등 
1. DB 생성
```
1> CREATE DATABASE m2mDemoDB
2> GO
```

2. DB설정
```
1> USE m2mDemoDB
2> GO
```

3. 사용자 계정 생성
```
1> CREATE LOGIN m2mDev WITH PASSWORD='m2mDev!@'
2> GO
```

```
1> CREATE USER m2mDev FOR LOGIN m2mDev;
2> GO  
```

4. 계정 권한 할당
```
1> exec sp_addrolemember 'db_owner', 'm2mDev';
2> GO  
```

```
1> exec sp_defaultdb @loginame='m2mDev', @defdb='m2mDemoDB' 
2> GO 
```

```
PS C:\WINDOWS\system32> docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=m2makstp!' -p 11433:1433 --name m2m-mssql -d mcr.microsoft.com/mssql/server:2019-latest
57a41f4c6582f93b93ec7a9b8c2ab44615f4752dd948f9ecc798e69202e892a0
PS C:\WINDOWS\system32> docker exec -it m2m-mssql /opt/mssql-tools/bin/sqlcmd -S > localhost -U SA -P 'm2makstp!' -Q 'ALTER LOGIN SA WITH PASSWORD="m2makstp!"'
PS C:\WINDOWS\system32> docker exec -it m2m-mssql "bash"
mssql@57a41f4c6582:/$
mssql@57a41f4c6582:/$ /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "m2makstp!"
1> CREATE DATABASE m2mDemoDB
2> GO
1>
2> USE m2mDemoDB
3> GO
Changed database context to 'm2mDemoDB'.
1>
2> CREATE LOGIN m2mDev WITH PASSWORD='m2mDev!@'
3> GO
1>
2> CREATE USER m2mDev FOR LOGIN m2mDev;
3> GO
1>
2> exec sp_addrolemember 'db_owner', 'm2mDev';
3> GO
1>
2> exit
mssql@57a41f4c6582:/$
```

## 7. SSMS 설치 
### 7-1. 설치

https://docs.microsoft.com/ko-kr/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15

### 7-2. 설치 후 접속 
  - Server Name : 127.0.0.1,11433
  - Login : m2mDev
  - password : m2mDev!@

### 7-3. 테스트용 테이블생성 
```SQL
 CREATE TABLE members (
     MEMBER_NO INT IDENTITY (1, 1) NOT NULL
   , MEMBER_ID NVARCHAR(20) NOT NULL
   , FIRST_NAME NVARCHAR(40) NOT NULL
   , LAST_NAME NVARCHAR(40) NOT NULL
   , ADDRESS NVARCHAR(100) NULL
   , CITY NVARCHAR(40) NULL
   , STATE NVARCHAR(40) NULL
   , PHONE NVARCHAR(40) NULL
   , USE_YN NVARCHAR(2) DEFAULT 'N' NULL
   , FIR_RG_DTM DATETIME DEFAULT(GETDATE())
   , FIR_RG_ID NVARCHAR(20) NULL
   CONSTRAINT PK_members PRIMARY KEY(MEMBER_NO)
 )
; 
 
GRANT SELECT, INSERT, DELETE, UPDATE ON members TO m2mDev
;
 
INSERT INTO dbo.members (MEMBER_ID, FIRST_NAME, LAST_NAME, ADDRESS, CITY, STATE, PHONE, USE_YN, FIR_RG_DTM, FIR_RG_ID) VALUES ('100001', 'FNAME1', 'LNAME_TESTER01', 'AA 1-1-1', 'Seoul', 'GW', '01011112222', null, GETDATE(), 'SYS_REG')
;

INSERT INTO dbo.members (MEMBER_ID, FIRST_NAME, LAST_NAME, ADDRESS, CITY, STATE, PHONE, USE_YN, FIR_RG_DTM, FIR_RG_ID) VALUES ('100002', 'FNAME2', 'LNAME_TESTER02', 'AA 1-1-2', 'Seoul', 'GW', '01011113333', null, GETDATE(), 'SYS_REG')
;

INSERT INTO dbo.members (MEMBER_ID, FIRST_NAME, LAST_NAME, ADDRESS, CITY, STATE, PHONE, USE_YN, FIR_RG_DTM, FIR_RG_ID) VALUES ('100003', 'FNAME3', 'LNAME_TESTER03', 'AA 1-1-3', 'Seoul', 'GW', '01011114444', null, GETDATE(), 'SYS_REG')
;

GO
```

## REDIS 설치(feat. Docker)
### 레디스 이미지 받아오기
> docker image pull redis

- 버전 지정해서 레디스 이미지 가져오기
> docker pull redis:5.0.3
>
> 5.0.3: Pulling from library/redis
> ...
> Status: Downloaded newer image for docker.io/redis:5.0.3

### 레디스 이미지 확인하기
> docker images

### Docker network 구성
- 바로 서버를 run하면 되지만, redis-cli도 같이 구동해서 통신해야하므로 2개의 컨테이너를 실행하여야하며, 그 두개의 컨테이너의 연결을 위하여 docker network 구성을 해야한다.
> docker network create redis-net 

- 네트워크 리스트 확인 
> docker network ls

### Redis 실행(서버)
> docker run -d --name m2m-redis -p 6379:6379 --network redis-net redis 
> ( docker run --name m2m-redis -d -p 6379:6379 redis )

### Docker의 redis-cli로 접속하기
> docker run -it --link m2m-redis:redis --net redis-net --rm redis redis-cli -h redis -p 6379
>
> redis:6379> set key value
> OK
> redis:6379> get key
> "value"
> redis:6379> exit

### Redis-cli로 직접 접속하기: 연결된 6379 포트를 사용한다.
- exec 를 써서 redis 서버가 실행중인 서버에 접근 (컨테이너 안으로 들어와서 접근가능)
- redis-cli 로 접근 불가X (컨테이너 밖에 있기 때문에....) 
- -it 옵션 : -it 를 붙여줘야 명령어를 실행 한 후 계속 명령어를 적을 수 있다.


docker ps


> docker exec -it bf94cb09bcb1 redis-cli -p 6379
>
> 127.0.0.1:6379> keys *
> 1) "key"
> 127.0.0.1:6379> get key
> "value"
> 127.0.0.1:6379> exit
>


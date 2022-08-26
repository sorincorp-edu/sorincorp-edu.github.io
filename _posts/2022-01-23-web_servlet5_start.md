---
layout: single
title:  "[WEB.] - Apache Tomcat 10 + Jakarta Servlet 5.0"
excerpt: "Java + Apache Tomcat 10 + Jakarta Servlet 5.0 + JSP で Hello World"

categories:
  - ETC
tags:
  - [Servelt 5.0]

toc: true
toc_sticky: true
 
date: 2022-01-21
last_modified_at: 2022-01-21
---

## 개요
* Jakarta Servlet (Java Servlet) 및 JSP가 포함 된 WAR 파일을 Gradle로 작성
* Apache Tomcat 10 설치
* WAR 파일을 Apache Tomcat 10에 배포

## 환경
* Apache Tomcat 10.0.2 (Jakarta Servlet 5.0, JSP 3.0)
* Java 15 (AdoptOpenJDK 15.0.2+7)
* Gradle 6.8.1
* macOS 10.15.7 Catalina

## Apache Tomcat 10 정보
* Apache Tomcat 10.0.2는 Apache Tomcat 10 시리즈의 첫 번째 안정 버전입니다.
* Apache Tomcat 10에서 Java EE에서 Jakarta EE로 마이그레이션
* API 패키지 이름이 javax.*에서 jakarta.*로 변경되었습니다.

> 톰캣 10.0.2 출시
> 2021-02-02
> 
> Apache Tomcat 프로젝트는 Apache Tomcat 버전 10.0.2 릴리스를 발표하게 된 것을 자랑스럽게 생각합니다. 이 릴리스는 10.0.x 시리즈의 첫 번째 안정적인 릴리스이며 Jakarta EE 9를 대상으로 합니다.
> 
> Tomcat 10 이상 사용자는 Java EE를 Eclipse Foundation으로 이전하는 과정에서 Java EE에서 Jakarta EE로 이동한 결과, 구현된 모든 API의 기본 패키지가 javax.*에서 jakarta로 변경되었음을 알아야 합니다. .*. 이것은 응용 프로그램이 Tomcat 9 및 이전 버전에서 Tomcat 10 이상으로 마이그레이션할 수 있도록 하는 코드 변경이 거의 확실하게 필요합니다. 이 프로세스를 지원하기 위한 마이그레이션 도구가 개발 중입니다.
> 

## 빌드용·기동용의 Java VM
* 환경 변수 JAVA_HOME 및 PATH를 설정합니다.

```powershell
$ export JAVA_HOME=/Library/Java/JavaVirtualMachines/adoptopenjdk-15.jdk/Contents/Home

$ PATH=${JAVA_HOME}/bin:${PATH}

$ java -version
openjdk version "15.0.2" 2021-01-19
OpenJDK Runtime Environment AdoptOpenJDK (build 15.0.2+7)
OpenJDK 64-Bit Server VM AdoptOpenJDK (build 15.0.2+7, mixed mode, sharing)
```

## Servlet 및 JSP가 포함 된 WAR 파일을 Gradle로 작성
* 소스 코드를 넣을 디렉토리를 준비
  - 임의의 디렉토리에 mywebapp라는 디렉토리를 작성하고 그 안에 간단한 샘플 코드를 준비한다.

```powershell
$ mkdir mywebapp

$ cd mywebapp
```

* 파일 목록
mywebapp
├── build.gradle
└── src
    └── main
        ├── java
        │   └── com
        │       └── example
        │           └── MyServlet.java
        └── webapp
            ├── WEB-INF
            │   └── web.xml
            └── myjsp.jsp


#### build.gradle
```gradle                
    plugins {
    id 'war'
    }

    repositories {
    mavenCentral()
    }

    dependencies {
    // Jakarta Servlet 5.0 API
    // https://mvnrepository.com/artifact/jakarta.servlet/jakarta.servlet-api
    providedCompile 'jakarta.servlet:jakarta.servlet-api:5.0.0'
    }

    // Java 15
    sourceCompatibility = 15
    targetCompatibility = 15

    // Application
    version = '1.0'
```

#### src/main/java/com/example/MyServlet.java
```java
package com.example;

// Jakarta Servlet 5.0 API では
// パッケージ名が javax.servlet から jakarta.servlet へ変更された
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/myservlet")
public class MyServlet extends HttpServlet {

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
    res.setContentType("text/html; charset=utf-8");
    try (PrintWriter out = res.getWriter()) {
      out.println("<html><body>");
      out.println("サーブレット: Hello Servlet World!<br>");
      out.println(getServletContext().getServerInfo());
      out.println("</body></html>");
    }
  }
}
```

#### src/main/webapp/myjsp.jsp
```jsp
<%@ page contentType="text/html; charset=utf-8" %><html><body>
JSP: Hello JSP World!<br>
<%= pageContext.getServletContext().getServerInfo() %><br>
java.vm.name: <%= System.getProperty("java.vm.name") %><br>
java.vm.vendor: <%= System.getProperty("java.vm.vendor") %><br>
java.vm.version: <%= System.getProperty("java.vm.version") %><br>
</body></html>
```

#### src/main/webapp/WEB-INF/web.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>

<!-- Web Application Deployment Descriptor (Jakarta Servlet 5.0) -->
<web-app
  xmlns="https://jakarta.ee/xml/ns/jakartaee"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee
  https://jakarta.ee/xml/ns/jakartaee/web-app_5_0.xsd"
  version="5.0">

  <servlet>
    <servlet-name>myjsp</servlet-name>
    <jsp-file>/myjsp.jsp</jsp-file>
  </servlet>

  <servlet-mapping>
    <servlet-name>myjsp</servlet-name>
    <url-pattern>/myjsp</url-pattern>
  </servlet-mapping>

</web-app>
```

## WAR 파일 만들기
* Gradle 빌드 태스크에서 WAR 파일을 작성하십시오.

```
$ gradle build
```

* WAR 파일이 생성되었는지 확인합니다.

```powershell
$ file build/libs/mywebapp-1.0.war
build/libs/mywebapp-1.0.war: Zip archive data, at least v1.0 to extract
```

## Apache Tomcat 10 설치
### 설치할 디렉토리 준비
* 임의의 디렉토리에 tomcat10이라는 디렉토리를 작성하고 그 안에 설치한다.

```powershell
$ mkdir tomcat10

$ cd tomcat10
```

### Apache Tomcat 10 다운로드 및 배포
* Apache Tomcat® - Apache Tomcat 10 소프트웨어 다운로드

```powershell
$ wget https://downloads.apache.org/tomcat/tomcat-10/v10.0.2/bin/apache-tomcat-10.0.2.tar.gz

$ tar xf apache-tomcat-10.0.2.tar.gz
```

### Apache Tomcat 10이 시작되는지 확인
* startup.sh에서 Apache Tomcat 10을 시작합니다.

```powershell
$ ./apache-tomcat-10.0.2/bin/startup.sh 
Using CATALINA_BASE:   /Users/foo/tomcat10/apache-tomcat-10.0.2
Using CATALINA_HOME:   /Users/foo/tomcat10/apache-tomcat-10.0.2
Using CATALINA_TMPDIR: /Users/foo/tomcat10/apache-tomcat-10.0.2/temp
Using JRE_HOME:        /Library/Java/JavaVirtualMachines/adoptopenjdk-15.jdk/Contents/Home
Using CLASSPATH:       /Users/foo/tomcat10/apache-tomcat-10.0.2/bin/bootstrap.jar:/Users/foo/tomcat10/apache-tomcat-10.0.2/bin/tomcat-juli.jar
Using CATALINA_OPTS:   
Tomcat started.
```

* curl로 액세스하고 시작했는지 확인합니다.

```powershell
$ curl --include -s http://localhost:8080/ | head -15
HTTP/1.1 200 
Content-Type: text/html;charset=UTF-8
Transfer-Encoding: chunked
Date: Wed, 03 Feb 2021 23:34:17 GMT


<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Apache Tomcat/10.0.2</title>
        <link href="favicon.ico" rel="icon" type="image/x-icon" />
        <link href="tomcat.css" rel="stylesheet" type="text/css" />
```

* shutdown.sh에서 Apache Tomcat 10을 중지합니다.

```powershell
$ ./apache-tomcat-10.0.2/bin/shutdown.sh
```

## WAR 파일을 Apache Tomcat 10에 배포

* WAR 파일을 Apache Tomcat 10의 webapps 디렉토리에 설치

```powershell
$ cp mywebapp/build/libs/mywebapp-1.0.war tomcat10/apache-tomcat-10.0.2/webapps/mywebapp.war
```

* Apache Tomcat 10 시작

```powershell
$ ./tomcat10/apache-tomcat-10.0.2/bin/startup.sh
```

* Servlet 및 JSP에 액세스
curl로 서블릿에 액세스하여 동작을 확인합니다.

```powershell
$ curl --include http://localhost:8080/mywebapp/myservlet
HTTP/1.1 200 
Content-Type: text/html;charset=utf-8
Content-Length: 94
Date: Wed, 03 Feb 2021 23:40:23 GMT

<html><body>
サーブレット: Hello Servlet World!<br>
Apache Tomcat/10.0.2
</body></html>
```

* curl로 JSP에 액세스하여 동작을 확인합니다.

```powershell
$ curl --include http://localhost:8080/mywebapp/myjsp
HTTP/1.1 200 
Set-Cookie: JSESSIONID=A2983AEBEC5A144E1D24059263B734A9; Path=/mywebapp; HttpOnly
Content-Type: text/html;charset=utf-8
Content-Length: 203
Date: Wed, 03 Feb 2021 23:40:45 GMT

<html><body>
ジェイエスピー: Hello JSP World!<br>
Apache Tomcat/10.0.2<br>
java.vm.name: OpenJDK 64-Bit Server VM<br>
java.vm.vendor: AdoptOpenJDK<br>
java.vm.version: 15.0.2+7<br>
</body></html>
```
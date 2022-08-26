---
layout: single
title:  "[Redis] - Redis 서비스 Architecture 고려사항"
excerpt: "SpringBoot 버전에 따른 Redis구성 고려사항"

categories:
  - Redis
tags:
  - [Redis, Spring Boot]

toc: true
toc_sticky: true
 
date: 2022-01-23
last_modified_at: 2022-01-23
---

# Redis Object 서비스 Architecture 고려사항
   * project에서 사용하고 있는 Java 버전은 SpringBoot 1.5.6.RELEASE입니다.
   * 내부에 사용하는 Redis관련 Library는 아래와 같습니다.   
```   
   spring-boot-starter-data-redis-1.5.6.RELEASE.jar
          ㄴspring-data-redis-1.8.8.RELEASE.jar
              ㄴjedis-2.9.0.jar
```
   * 참고로 Redis Sequence는 Lettuce 4.4.0.Final
   
## 1. 문제점
 * 성능 테스트 결과, Write Data(set) 뿐만 아니라, Read Data (get)도 오직 Primary Node(Master)에서만 서비스를 제공함.   
   - Replica Node(Slave)는 단지 backup의 의미만 존재함
 * spring-data-redis 의 Document를 살펴본 결과, spring-data-redis 2.1.0.M1버전에서 [5.3.4. Write to Masterm,read from Slave]를 지원함 (only Lettuce)[참고](https://docs.spring.io/spring-data/redis/docs/2.1.0.M1/reference/html/#redis:write-to-master-read-from-slave)
   
## 2. spring-boot-starter-data-redis-1.5.6이하에서의 Redis Cluster 구성방향
 * Replica Node(Slave)는 Shard당 Max5개까지 구성할 수 있으나, Backup이상의 의미가 없음.
 * ElastiCache(Redis)는 Max 15개의 Shard(Node Group)을 가질 수 있음.
 * 따라서 **성능관점에서 문제가 된다면, Shard의 갯수를 늘려야 하고, Replica Node(Slave)의 갯수는 최소로 구성해야 함.**
   - ex) 3 Shard  * 2 Node(1Master, 1Slave)
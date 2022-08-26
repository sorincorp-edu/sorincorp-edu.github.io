---
layout: single
title:  "[Redis] - 레디스 클러스터에 관한 간단한 정리"
excerpt: "Redis cluster, failover, node"

categories:
  - Redis
tags:
  - [Redis]

toc: true
toc_sticky: true
 
date: 2022-01-24
last_modified_at: 2022-01-24
---

# 레디스 클러스터에 관한 간단한 정리
 * 아래의 내용은 6.0.9 버전의 redis를 이용하였습니다.

## 1. redis cluster?
 * cluster 구성은 v3.0부터 가능합니다.
 * 1000대의 노드까지 확장 가능합니다.
 * 각 노드 별로 중지, 추가, 삭제가 가능하며 cluster를 중지할 필요가 없습니다.
 * 16383개의 slot을 가지고 있으며 0~16382의 번호를 가지고 있습니다.
 * 각 node는 slot을 나누어 가집니다.
 * 최소 3개의 master node가 필요합니다.
 * cluster 사용 시 0번 DB만 사용 가능합니다.
 * 장애 복구 시나리오가 필요합니다.
 * 왜? [링크](http://redisgate.kr/redis/cluster/cluster_introduction.php)

## 2. cluster 구성시 알아야 할 점
 * redis cluster 구성 시에 TCP port의 기본 값은 6379이며, +1000(16379) port를 이용하여 cluster를 구성합니다.
 * 1번째 port(6379)는 client에서 주로 접근하는 port입니다.
 * 2번째 port는(16379) cluster node 간의 장애 감지, 구성 정보 업데이트, 상태 체크 등에 사용됩니다. 이를 'cluster bus port'라고 합니다.
 * 앞서 말한 두 종류의 port 모드 접근이 가능해야 cluster가 정상 구성이 가능합니다.
 * 데이터가 없는 node만 cluster에 추가 가능합니다.


## 3. failover 처리
### cluster-require-full-coverage
cluster-require-full-coverage를 no로 설정하였더라도 절반 이상의 node가 down 되면 cluster가 중지됩니다.  
이를 방지하기 위해선 `forget`을 이용하여 자동으로 cluster 사이즈를 줄여주어야 합니다.  
만약 4개의 node로 구성된 cluster에서 2개가 down 됐을 경우 1개의 node를 자동으로 제외해 주어야 cluster 중지를 막을 수 있습니다.
```
7000>cluster forget {node id}

ex)
7000>cluster forget 2708cfa1af06f102a8e11ca9b4c2a897012da463

```
아래 방법도 가능 합니다.
```
redis-cli -p 7000 cluster forget 2708cfa1af06f102a8e11ca9b4c2a897012da463
```

forget으로 node를 cluster에서 제거했다면, 제거한 node의 slot을 다른 node에게 할당해 주어야 합니다.
```
redis-cli -p 7000 cluster addslots {1100..16383}
```
### slaver 서버가 구성 되어 있을경우
master node가 down 되면 이에 대응하는 slave node가 자동으로 master로 승격됩니다.  
down된 node를 다시 복구하면 nodes.conf 파일에서 새로운 master가 지정된 것을 확인하고 slave로 cluster 구성에 추가됩니다.

### nodes.conf를 이용하여 복구
nodes.conf 파일이 관리되어 있을 경우, 해당 파일을 copy 하여 새로운 redis에 추가하여 복구할 수 있습니다.  
nodes.conf에는 node의 구성 정보가 기록되어 있으므로, 새로 시작한 redis node는 자신이 이전 node의 자리에 참여합니다.

## 4. cluster를 구성해 보자
###  cluster 구성시 필요한 기본 설정 (redis.conf)
* **cluster-enabled** : yes로 설정할 경우 cluster 모드를 사용합니다. yes로 설정되어 있을 때만 cluster로 시작하는 옵션을 설정 가능합니다.
* **cluster-config-file** : cluster의 node 구성이 기록되는 파일입니다. 해당 파일은 자동으로 관리됩니다. 임의로 수정 시에 정확한 확인이 필요합니다.
* **cluster-node-timeout** : cluster 구성원인 node를 failover 상태로 인식하는 최대 시간입니다.  
단위는 ms를 사용하며, node의 과반수가 down 상태로 체크할 경우 slave를 master로 승격하는 failover 처리를 시작합니다.  
명령어의 실행 시간을 생각해 3초 정도를 추천하며, 기본값인 15초를 튜닝 하는 것을 추천합니다.
* **cluster-slave-validity-factor** : cluster는 master nodd 다운 시 해당 노드의 slave node를 master로 변경하는 장애 조치(failover)를 시작합니다.  
이때 master와 slave node 간의 체크가 오랫동안 단절된 상태면 해당 slave는 승격 대상에서 제외됩니다. 이때 승격 대상에서 제외하는 판단 기준의 시간을 설정합니다.  
계산식 : (cluster-node-timeout * cluster-slave-validity-factor) + repl-ping-slave-period
* **cluster-migration-barrier** : master에 연결되어 있어야 하는 최소 slave의 수 (기본값=1)
* **cluster-require-full-coverage** : cluster의 일부 node가 다운되어도 운영할 방법을 설정
    * yes : slave가 없는 master가 다운되면 cluster 전체가 중지
    * no : slave가 없는 mster가 다운되더라도 cluster는 유지합니다. 다운된 master의 슬롯에서만 에러가 발생합니다.
    * 일부 데이터가 유실돼도 괜찮으면 no, 데이터의 정합성이 중요하다면 yes를 선택하면 됩니다.
    * no로 설정하더라도 절반 이상의 node가 down 되면 cluster는 중지됩니다.
* **appendonly** : 데이터를 append only file에 쓸지 여부를 정합니다.(기본값=no)  
redis의 장애 발생 시 ram에 기록된 데이터가 증발하는데 이때 복구가 가능하도록 데이터 crud마다 디스크에 쓰기 작업을 합니다.  
파일명은 **appendfilename**에서 지정 합니다.
    * **appendfilename** : AOF 처리할 파일의 이름을 지정합니다.
    * **appendfsync** : 디스크에 데이터를 기록할 시점을 지정합니다.
        * always : 명령어 실행 시마다 기록합니다.
        * everysec : 데이터를 모아 1초마다 디스크에 기록합니다.
        * no : os에 쓰기 시점 처리를 위임합니다.
* **dir** : 지정된 파일 이름으로 이 디렉토리에 기록됩니다.
* **dbfilename** : dir에서 지정한 경로에 여기서 설정한 이름의 파일로 기록됩니다.

### cluster 준비
클러스터는 최소 3개의 node를 필요로 합니다.
port 7000 ~ 7005를 이용하여 master-slave를 구성해 보겠습니다.
```
mkdir 7000 7001 7002 7003 7004 7005
```
### redis.conf
redis.conf 파일을 각 dir로 복사해 줍니다.
```
cp redis.conf {7000~7005 디렉토리 경로}
```

cluster 구성의 가장 기본 설정만으로 시작해 보겠습니다.
아래의 설정을 각 port의 redis.conf 파일에 설정해 줍니다.
```
port 7000
daemonize yes
logfile /path/to/logfile/filename
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 3000
appendonly yes
dir /path/to/7000
```

### redis 실행
이제 아래의 명령어를 이용하여 redis를 실행하면 됩니다.
```
$redis-server ./7000/redis.conf

25822:C 01 Jan 2021 00:38:26.377 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
25822:C 01 Jan 2021 00:38:26.377 # Redis version=6.0.9, bits=64, commit=00000000, modified=0, pid=25822, just started
25822:C 01 Jan 2021 00:38:26.377 # Configuration loaded
25822:M 01 Jan 2021 00:38:26.379 * Increased maximum number of open files to 10032 (it was originally set to 1024).
25822:M 01 Jan 2021 00:38:26.380 * No cluster configuration found, I'm d6a275651d1baaa736181c36893b468faaa0e0f8
                _._                                                 
           _.-``__ ''-._                                             
      _.-``    `.  `_.  ''-._           Redis 6.0.9 (00000000/0) 64 bit
  .-`` .-```.  ```\/    _.,_ ''-._                                   
 (    '      ,       .-`  | `,    )     Running in cluster mode
 |`-._`-...-` __...-.``-._|'` _.-'|     Port: 7000
 |    `-._   `._    /     _.-'    |     PID: 25822
  `-._    `-._  `-./  _.-'    _.-'                   supervised                
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |           http://redis.io        
  `-._    `-._`-.__.-'_.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |                                  
  `-._    `-._`-.__.-'_.-'    _.-'                                   
      `-._    `-.__.-'    _.-'                                       
          `-._        _.-'                                           
              `-.__.-'                                               

25822:M 01 Jan 2021 00:38:26.386 # Server initialized
25822:M 01 Jan 2021 00:38:26.386 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
25822:M 01 Jan 2021 00:38:26.387 * Ready to accept connections

```
실행 과정에서 생기는 warn에 대한 처리는 [블로그의 글](https://steady-hello.tistory.com/68?category=829726)을 참고해 주세요.

위 로그를 자세히 보면 아래와 같은 메시지가 나옵니다.
```
No cluster configuration found, I'm d6a275651d1baaa736181c36893b468faaa0e0f8
```
지금은 nodes.conf 파일을 찾지 못하여 나오는 문구이지만, cluster 구성을 완료하여 nodes.conf 파일을 찾으면 'Node configuration loaded' 메시지가 출력 됩니다.
또한 이때 출력된 고유한 Node Id를 통해 node를 구분합니다.

아래의 문구는 cluster 모드로 시작했을 때 확인 가능합니다.
```
Running in cluster mode
```

### cluster 시작
이제 모든 node를 실행시켰으니 각 node를 cluster로 묶어 보겠습니다. [명령어 링크](http://redisgate.kr/redis/cluster/redis-cli-cluster.php)
```
redis-cli --cluster create 127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 --cluster-replicas 1
```
이때 cluster에 구성되는 node의 ip가 동일하다면 입력된 순서대로 master와 slave가 정해집니다.


```
$ redis-cli --cluster create 127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 --cluster-replicas 1
>>> Performing hash slots allocation on 6 nodes...
Master[0] -> Slots 0 - 5460
Master[1] -> Slots 5461 - 10922
Master[2] -> Slots 10923 - 16383
Adding replica 127.0.0.1:7004 to 127.0.0.1:7000
Adding replica 127.0.0.1:7005 to 127.0.0.1:7001
Adding replica 127.0.0.1:7003 to 127.0.0.1:7002
>>> Trying to optimize slaves allocation for anti-affinity
[WARNING] Some slaves are in the same host as their master
M: d6a275651d1baaa736181c36893b468faaa0e0f8 127.0.0.1:7000
   slots:[0-5460] (5461 slots) master
M: 2708cfa1af06f102a8e11ca9b4c2a897012da463 127.0.0.1:7001
   slots:[5461-10922] (5462 slots) master
M: 7ae3219bec4908d50e0a378a48b5e6172bcb5585 127.0.0.1:7002
   slots:[10923-16383] (5461 slots) master
S: 2a0491064e143a4aceda085b95ac622acea72618 127.0.0.1:7003
   replicates d6a275651d1baaa736181c36893b468faaa0e0f8
S: c0539d5c612e5f8dbd2db642b94a9969956cc126 127.0.0.1:7004
   replicates 2708cfa1af06f102a8e11ca9b4c2a897012da463
S: 9e1fcbbc484d0580d773c6a1acffdf614dc83889 127.0.0.1:7005
   replicates 7ae3219bec4908d50e0a378a48b5e6172bcb5585
Can I set the above configuration? (type 'yes' to accept): yes
>>> Nodes configuration updated
>>> Assign a different config epoch to each node
>>> Sending CLUSTER MEET messages to join the cluster
Waiting for the cluster to join
.
>>> Performing Cluster Check (using node 127.0.0.1:7000)
M: d6a275651d1baaa736181c36893b468faaa0e0f8 127.0.0.1:7000
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
S: 2a0491064e143a4aceda085b95ac622acea72618 127.0.0.1:7003
   slots: (0 slots) slave
   replicates d6a275651d1baaa736181c36893b468faaa0e0f8
S: c0539d5c612e5f8dbd2db642b94a9969956cc126 127.0.0.1:7004
   slots: (0 slots) slave
   replicates 2708cfa1af06f102a8e11ca9b4c2a897012da463
S: 9e1fcbbc484d0580d773c6a1acffdf614dc83889 127.0.0.1:7005
   slots: (0 slots) slave
   replicates 7ae3219bec4908d50e0a378a48b5e6172bcb5585
M: 7ae3219bec4908d50e0a378a48b5e6172bcb5585 127.0.0.1:7002
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
M: 2708cfa1af06f102a8e11ca9b4c2a897012da463 127.0.0.1:7001
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.

```

이제 `redis-cli`를 이용해 특정 node로 접근한 다음 아래 명령어를 이용해 cluster 상태를 확인해 보면 됩니다.
```
cluster info        ->  cluster 상태 정보
cluster nodes       -> cluster node의 상태 정보
```


## 5.  node down 테스트
node가 down 되는 상황에 대해 살펴 겠습니다.

### node crash
아래와 같이 `debug segfault`를 이용하여 crash 시킬 수 있습니다.
```
7002> debug segfault
Could not connect to Redis at 127.0.0.1:7002: Connection refused
```
7002 node를 죽였으므로 아래와 같이 node 구성이 바뀌게 됩니다.
```
7000> cluster nodes
2a0491064e143a4aceda085b95ac622acea72618 127.0.0.1:7003@17003 slave d6a275651d1baaa736181c36893b468faaa0e0f8 0 1609485361000 1 connected
c0539d5c612e5f8dbd2db642b94a9969956cc126 127.0.0.1:7004@17004 slave 2708cfa1af06f102a8e11ca9b4c2a897012da463 0 1609485361942 2 connected
d6a275651d1baaa736181c36893b468faaa0e0f8 127.0.0.1:7000@17000 myself,master - 0 1609485361000 1 connected 0-5460
9e1fcbbc484d0580d773c6a1acffdf614dc83889 127.0.0.1:7005@17005 master - 0 1609485361000 7 connected 10923-16383
7ae3219bec4908d50e0a378a48b5e6172bcb5585 127.0.0.1:7002@17002 master,fail - 1609485186349 1609485184841 3 disconnected
2708cfa1af06f102a8e11ca9b4c2a897012da463 127.0.0.1:7001@17001 master - 0 1609485361440 2 connected 5461-10922
```

### node restart
이번엔 7002 node를 다시 복구해 보겠습니다.
```
$redis-server ./7002/redis.conf 
$ redis-cli -c -p 7002

7002> cluster nodes
7ae3219bec4908d50e0a378a48b5e6172bcb5585 127.0.0.1:7002@17002 myself,slave 9e1fcbbc484d0580d773c6a1acffdf614dc83889 0 1609485506000 7 connected
d6a275651d1baaa736181c36893b468faaa0e0f8 127.0.0.1:7000@17000 master - 0 1609485507000 1 connected 0-5460
2a0491064e143a4aceda085b95ac622acea72618 127.0.0.1:7003@17003 slave d6a275651d1baaa736181c36893b468faaa0e0f8 0 1609485507058 1 connected
9e1fcbbc484d0580d773c6a1acffdf614dc83889 127.0.0.1:7005@17005 master - 0 1609485507862 7 connected 10923-16383
2708cfa1af06f102a8e11ca9b4c2a897012da463 127.0.0.1:7001@17001 master - 0 1609485507561 2 connected 5461-10922
c0539d5c612e5f8dbd2db642b94a9969956cc126 127.0.0.1:7004@17004 slave 2708cfa1af06f102a8e11ca9b4c2a897012da463 0 1609485507000 2 connected
```
7002 node가 slave로 cluster 구성에 다시 추가됨을 확인할 수 있습니다.

## 6.  node 추가
node를 추가할 때 master로 추가하는 경우, slave로 추가하는 경우의 2가지 방법으로 나눌 수 있습니다.

### master node 추가
7006 node의 conf 파일을 구성하여 실행한 뒤,  cluster에 추가하면 됩니다.
```
$ redis-server ./7006/redis.conf 
$ redis-cli --cluster add-node 127.0.0.1:7006 127.0.0.1:7000
...중략...
[OK] All nodes agree about slots configuration.
[OK] All 16384 slots covered.
[OK] New node added correctly.
```

지금은 7006이 cluster에 추가되었지만 slot 할당이 안 되어있습니다.  
`reshard` 명령을 이용하여 slot을 resharding 해 보겠습니다.  
아래의 순서대로 입력합니다.  
(1) 이동하고자 하는 slot의 수  
(2) slot을 받을 node의 id  
(3) slot을 건네줄 node의 id (all 입력 시 골고루)  
(4) yes 입력
```
$ redis-cli --cluster reshard 127.0.0.1:7000

>>> Performing Cluster Check (using node 127.0.0.1:7000)
M: d6a275651d1baaa736181c36893b468faaa0e0f8 127.0.0.1:7000
M: fe2e78f987a3d41f9f93b6990afcd240992f176f 127.0.0.1:7006
S: 2a0491064e143a4aceda085b95ac622acea72618 127.0.0.1:7003
   replicates d6a275651d1baaa736181c36893b468faaa0e0f8
S: c0539d5c612e5f8dbd2db642b94a9969956cc126 127.0.0.1:7004
   replicates 2708cfa1af06f102a8e11ca9b4c2a897012da463
M: 9e1fcbbc484d0580d773c6a1acffdf614dc83889 127.0.0.1:7005
   slots:[10923-16383] (5461 slots) master
S: 7ae3219bec4908d50e0a378a48b5e6172bcb5585 127.0.0.1:7002
   replicates 9e1fcbbc484d0580d773c6a1acffdf614dc83889
M: 2708cfa1af06f102a8e11ca9b4c2a897012da463 127.0.0.1:7001
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
How many slots do you want to move (from 1 to 16384)? {옮기고자 하는 slot의 수}
What is the receiving node ID? {node의 id}
...중략...
Source node #1: {source node의 id}
...중략...
Do you want to proceed with the proposed reshard plan (yes/no)? yes
...중략...
Moving slot 11088 from 127.0.0.1:7005 to 127.0.0.1:7006: 
```

### slave node 추가
```
redis-cli --cluster add-node 127.0.0.1:7006 127.0.0.1:7000 --cluster-slave --cluster-master-id d6a275651d1baaa736181c36893b468faaa0e0f8
```

## 7. node 제거
`redis-cli`의 `del-node`를 이용하여 node를 삭제 가능합니다.
전체 명령어는 아래와 같습니다.
```
redis-cli --cluster del-node {cluster 구성 nodeip}:{port} {제거할 node의 id}
```

master node를 제거하기 위해서는 slot이 비어 있어야 하기 때문에 먼저 resharding 작업을 해주어야 합니다.
```
redis-cli --cluster del-node 127.0.0.1:7000 fe2e78f987a3d41f9f93b6990afcd240992f176f
>>> Removing node fe2e78f987a3d41f9f93b6990afcd240992f176f from cluster 127.0.0.1:7000
[ERR] Node 127.0.0.1:7006 is not empty! Reshard data away and try again.
```

resharding 작업을 진행 후 다시 제거를 시도하면 성공하게 됩니다.
```
redis-cli --cluster del-node 127.0.0.1:7000 fe2e78f987a3d41f9f93b6990afcd240992f176f
>>> Removing node fe2e78f987a3d41f9f93b6990afcd240992f176f from cluster 127.0.0.1:7000
>>> Sending CLUSTER FORGET messages to the cluster...
>>> Sending CLUSTER RESET SOFT to the deleted node.
```

##### 출처 : [컨닝페이퍼](https://steady-hello.tistory.com/128)
---
layout: single
title:  "[Redis] - Redis 서비스 구현방법"
excerpt: "Redis Object Caching, Sequence, Session 서비스"

categories:
  - Redis
tags:
  - [Redis, Spring Boot]

toc: true
toc_sticky: true
 
date: 2022-01-23
last_modified_at: 2022-01-23
---

# Redis 서비스 예제
 * Redis Object Caching 서비스
   - RedisManager를 활용하여 Redis에 Object 데이터 저장
   - 그룹으로 분리하여 업무별로 분산처리하여 redis 병목현상 최소화 필요

 * Redis Sequence(채번) 서비스
   - redis sequence(채번)를  사용하기 위한 설정

 * Redis Session 서비스
   - 로그인 세션정보

## 1. Redis Object 서비스 개발 가이드
 * 빠른 성능을 위한 Caching 서비스를 구현하기 위하여 ElastiCache(Redis)를 이용
 * Caching용도이므로 해당 key 값이 없어질 수 있으므로 유의필요
 * 주의: String을 포한한 Primitive외의 일반 Object는 반드시 Serializable 구현하거나 상속필요.

```java 
   - 예제) public class Board implements Serializable {
```

### 1-1. Object Key 생성규칙

 * 이하 내용을 조합하여 key가 중복되지 않게 구성한다.

 ```
    프로젝트명 :   m2m-api
    파트명     :   dpart
    서비스명(영문) : board
    업무 영문명(기능 영문명) : notice
    key(채번용 필드명(영문) : num

      예제) m2m-api:dpart:board:notice:num    => 해당 글번호의 Board를 저장
```

 * prefix 는 필히 변수명으로 분리하여 작성 되어야 한다 .

```java 
    public static final String  NOTICE_OBJECT="m2m-api:dpart:board:notice:num";
```    

### 1-2. 시작 준비
 * 프로젝트 소스에 공통구현소스 이외에 RedisManager.java, RedisConfig.java가 존재한다면 삭제하여야 한다.
 * pom.xml  : Redis Object를 사용하기 위한 dependency injection을 한다. 

```xml
    <!-- 공통라이브러리에 포함되어야 함, 일단은 jedis로 대체 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
```

 * application.yml  : Redis Object를 위한 ElastiCache(Redis)연결정보를 설정한다.
 * 해당 key값이 변경될수 있으므로, local 개발시에도 터널링등을 사용하여, 개발용 ElastCache(Redis)를 사용하여야 한다.

```yaml
    spring:
    redis:
        #오브젝트용
        object:
        host: [해당 End Point]  #rc-was-object.xxxxx.xx.0001.apn.cache.amazonaws.com
        port: 5402
        database: 2
        timeout: 50
```

### 1-3. Redis Object 모듈 사용법
 * 해당 서비스는 값인출(get), 값저장(set), 값삭제(delete)의 메소드로 구성되어 있다.
 *  1.Redis Sequence(채번) 서비스를 사용할 서비스에서 공통 채번 모듈을 DI한다.

```java
    //Redis Object 서비스 DI.
    @Autowired
    private RedisManager redisManager;
```

 * 2. Redis Object 서비스 메소드

```java
    /* 1. 값을 인출 */
    public Object getValue(String key)
    //예제) Board board = (Board) redisManager.getValue(noticeKey);
 
    /* 2. List값을 인출 */
    public List<Object> getListValue(String key)
    //예제) List<Board> lst = redisManager.getListValue(noticeKey+"lst");
 
    /* 3. 값을 저장 (timeout시간만큼 저장되고, timeout이후에 자동 삭제됨) */
    public void put(String key, Object val, long timeout, TimeUnit timeUnit)
    //예제) redisManager.put(noticeKey, seq, 20, TimeUnit.SECONDS);
 
    /* 4. List값을 저장 (timeout시간만큼 저장되고, timeout이후에 자동 삭제됨) */
    public void putList(String key, List<Object> list, long timeout, TimeUnit timeUnit)
    //예제) redisManager.putList(noticeKey+"lst", lst, 20, TimeUnit.SECONDS);
 
    /* 5. 값을 삭제 */
    public void delete(String key)
    //예제) redisManager.delete(noticeKey+"lst_delete");  
```

 * 4. Redis Object 활용 
   - RedisManager 이용한 Redis  get/set/delete ( ServiceImpl 에서 구현한다)

```java
    public static final String  NOTICE_REDIS_PREFIX="m2m-api:dpart:board:notice:";
    
    @Autowired
    private RedisManager<Board> redisManager;
    
    //set
    redisManager.put(NOTICE_REDIS_PREFIX + num, board, 30, TimeUnit.MINUTES);
    
    //get
    redisManager.getValue(NOTICE_REDIS_PREFIX + num);
    
    //delete
    redisManager.delete(NOTICE_REDIS_PREFIX + num);
```


### 1-4. 참고소스 
 * RedisObjectConfig.java   : 환경설정 소스

```java
    @Configuration
    public class RedisObjectConfig {
        @Autowired
        protected RedisObjectProperties redisObjectProperties;
        
        @Bean
        public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
            return new PropertySourcesPlaceholderConfigurer();
        }
        
        @Bean(name="redisObjectConnectionFactory")
        public JedisConnectionFactory jedisConnectionFactory() {
            if (redisObjectProperties.getCluster() != null) {  //Cluster 모드
                System.out.println("RedisManager Object - redisClientType : CLUSTER");
                    
                return new JedisConnectionFactory(
                        new RedisClusterConfiguration(redisObjectProperties.getCluster().getNodes()));
        
            } else if (!"localhost".equals(redisObjectProperties.getHost())) {  //Single 모드
                System.out.println("RedisManager Object - redisClientType : SINGLE");
                    
                JedisConnectionFactory factory = new JedisConnectionFactory();
                factory.setHostName(redisObjectProperties.getHost());
                factory.setPort(redisObjectProperties.getPort());
                factory.setDatabase(redisObjectProperties.getDatabase());
                factory.setTimeout(redisObjectProperties.getTimeout() * 1000); //milliseconds이므로 seconds로변환
                factory.setUsePool(true);
                factory.afterPropertiesSet();
                return factory;
                    
            } else { //redis Object 사용안함
                System.out.println("RedisManager Object - redisClientType : NONE");
                    
                JedisConnectionFactory factory = new JedisConnectionFactory();
                factory.setHostName("Not Exists");
                factory.setPort(9999);
                return factory;
        
            }
        }
        
        @Bean(name="redisObjectTemplate")
        public RedisTemplate redisObjectTemplate() {   
            RedisTemplate<String, Object> redisTemplate = new RedisTemplate<String, Object>();
            redisTemplate.setKeySerializer(new StringRedisSerializer());
            // redisTemplate.setValueSerializer(new StringRedisSerializer());
            redisTemplate.setConnectionFactory(this.jedisConnectionFactory());
            return redisTemplate;
        }
    }
```    
    
 * RedisManager.java   : 메인 서비스 소스
    
```java
    @Repository
    public class RedisManager<Object> {
        private Logger log = LoggerFactory.getLogger(getClass());
     
        @Autowired
        @Qualifier("redisObjectTemplate")
        private RedisTemplate redisTemplate;
        @Resource(name = "redisObjectTemplate")
        private ValueOperations<String, Object> valueOps;
        @Resource(name = "redisObjectTemplate")
        private ValueOperations<String, List<Object>> valueOpsList;
     
        public RedisManager() {}
     
        public Object getValue(String key) {
            try {
                log.info("redisManager getValue --- key:"+key);
                return valueOps.get(key);
                 
            } catch (Exception e) {
                log.error("redisManager getValue error : " ,e);
                return null;
            }
        }
     
        public List<Object> getListValue(String key) {
            try {
                log.info("redisManager getListValue --- key:"+key);
                return valueOpsList.get(key);
            } catch (Exception e) {
                log.error("redisManager getListValue error : ",e);
                return null;
            }
        }
     
        @SuppressWarnings("unchecked")
        public void put(String key, Object val, long timeout, TimeUnit timeUnit) {
            try {
                valueOps.set(key, val, timeout, timeUnit);
                log.info("redisManager put --- key:"+key);
            } catch (Exception e) {
                log.error("redisManager put error : ",e);
            }
        }
        public void putList(String key, List<Object> list, long timeout, TimeUnit timeUnit){
            try {
                valueOpsList.set(key, list, timeout, timeUnit);
                log.info("redisManager putList --- key:"+key);
            } catch (Exception e) {
                log.error("redisManager putListerror : ",e);
            }
        }
     
        @SuppressWarnings("unchecked")
        public void delete(String key) {
            try {
                redisTemplate.delete(key);
                log.info("redisManager delete --- key:"+key);
            } catch (Exception e) {
                log.error("redisManager delete error : ",e);
            }
        }
    }
```


## 2. Redis Sequence(채번) 개발 가이드
 * 위 서비스 개발과 유사
 * 해당 서비스를 호출시, 현재값(int)을 +1해서 update한 후, update한 int값을 리턴한다. ( 리턴값(int) = 현재값(int) + 1 )
 * 동작방식은 RDB(oracle,mysql)의 sequence(next_val)와 같이 호출시마다 값을 1씩 증가시켜서 리턴.
 * (서비스 호출시, 해당 key값이 없는 최초에는 현재값을 자동으로 0으로 초기화하고 1 증가한 값(int)을 리턴한다.<리턴값(int)은 1임)

### 2-1. application.yml
 * Redis sequence(채번)을 위한 ElastiCache(Redis)연결정보를 설정한다.

```yaml
    spring:
    redis:
        #채번용
        sequence:
        host: [해당 End Point]  #rc-was-object.xxxxxx.xx.0001.apn2.cache.amazonaws.com
        port: 5402
        timeout: 50
```

### 2-2. Redis Sequence(채번) 서비스를 사용할 서비스에서 공통채번모듈 DI.

```java
    // sequence(채번) 서비스 import
    import com.~~~.core.spring.redis.RedisSequence;
    
    //sequence(채번)서비스 DI.
    @Autowired
    private RedisSequence redisSequence;               
```

### 2-3. Redis Sequence(채번) 서비스 메소드 구현

```java
    //해당 sequence(채번) 사용을 위한 상수 선언
    private static final String  NOTICE_SEQUENCE="api:wt:board:notice";     
    
    @Override
    public ModelX insertXXX(ModelX modelX) throws Exception {
        ...    
        //해당 sequence(채번)서비스에서 리턴값(int)받아서 사용한다. (리턴값(int) = 현재값(int) + 1 )
        int seq = redisSequence.getSequence(NOTICE_SEQUENCE);      
        ...
    }
```

 * Redis Sequence(채번) 서비스 메소드 설명

```java 
    /* 1. 해당 sequence(채번)값을 리턴한다. (해당 key가 없으면 1을 리턴함)  */
    public int getSequence(String key) throws Exception ;
    //예제) int seq = redisSequence.getSequence(NOTICE_SEQUENCE);    
        
    /* 2. 해당 sequence(채번)값을 리턴 && 값이 입력Max값보다 크면 1을 리턴한다. (cycling)
    @param maxValue: 해당 key가 가질 수 있는 최대값. 넘으면 1을 리턴한다.*/
    public int getSequenceMax(String key, int maxValue) throws Exception ;
    //예제) int seq = redisSequence.getSequenceMax(NOTICE_SEQUENCE, 999999);    
```

### 2-4. 초기 Sequence(채번) 값 조정
 * 개발이 진행중인 상태에서, 이미 채번값을 RDB-sequence, max Record등으로 사용중인 경우,  채번값이 1로 초기화되면 곤란하다.
 * Redis Desktop Manager등의 툴을 이용하여 해당 초기채번값을 수정하거나 신규 등록하면 된다.
 * Redis Desktop Manager 등을 사용할 때, Connection - Advanced Setting화면에서 Namespace separator를 삭제하여야 보기가 편하다.
   (Namespace separator의 디폴트 값은 ":"이지만 경우에 따라 값이 깨진것 처럼 보인다.)

   
### 2-5. Sequence(채번)관련소스
 * RedisSequenceConfig.java   : 환경설정 소스
   
```java
   @Configuration
   public class RedisSequenceConfig {
       private Logger log = LoggerFactory.getLogger(getClass());
    
       private RedisClientType redisClientType = RedisClientType.NONE;
       private List<RedisURI> nodes = new ArrayList<RedisURI>();
        
       @Autowired
       protected RedisSequenceProperties redisSequenceProperties;
        
        
       //Redis 서버의 종류를 판가름함
       private void setClientType() {
           if (redisSequenceProperties != null ) {
               if (redisSequenceProperties.getCluster() != null) {
                   redisClientType = RedisClientType.CLUSTER;
               } else if (!"localhost".equals(redisSequenceProperties.getHost())) {
                   redisClientType = RedisClientType.SINGLE;
               }
           }
       }
        
       @Bean(name = "redisSequenceClientResources", destroyMethod = "shutdown")
       ClientResources clientResources() {
           return DefaultClientResources.create();
       }
    
       @Bean(name = "redisSequenceRedisClient", destroyMethod = "shutdown")
       RedisClient redisClient() {
           //redisClusterClient를 사용하지 않는이유는 cluster관련 명령을 사용하지 않고, 가볍게 사용하기 위함.
           RedisClient client = RedisClient.create(this.clientResources());
           client.setDefaultTimeout(Duration.ofNanos(TimeUnit.SECONDS.toNanos(redisSequenceProperties.getTimeout())));
           return client;
       }
    
       //lettuce는 내부적으로 thread로 실행되므로 pool이 필요없음
       @Bean(name = "redisSequenceConnection", destroyMethod = "close")
       StatefulRedisMasterSlaveConnection<String,String> connection() {
           setClientType(); //Redis 서버의 종류를 판가름함
           RedisURI radisURI;
            
           System.out.println("Redis Sequence - redisClientType :" + redisClientType);
           if (redisClientType.equals(RedisClientType.CLUSTER)) {
               List<String> nodeList = redisSequenceProperties.getCluster().getNodes();
               for (int i = 0; i < nodeList.size() ; i++) {
                   String host_port = nodeList.get(i);
                   System.out.println("Redis Sequence - host_port :" + host_port);
                   radisURI    = RedisURI.Builder.redis(StringUtils.substringBefore(host_port, ":")
                                                      , Integer.parseInt(StringUtils.substringAfter(host_port, ":")))
                                                 .withDatabase(redisSequenceProperties.getDatabase())
                                                 .build();
                   nodes.add(radisURI);
               } //for
           } else if (redisClientType.equals(RedisClientType.SINGLE)) {
               radisURI    = RedisURI.Builder.redis(redisSequenceProperties.getHost()
                                                  , redisSequenceProperties.getPort())
                                             .withDatabase(redisSequenceProperties.getDatabase())
                                             .build();
               nodes.add(radisURI);
           } else {
               return null;
           }
    
           StatefulRedisMasterSlaveConnection<String,String> connection = MasterSlave
                   .connect(this.redisClient(), new StringCodec(), nodes);
           connection.setReadFrom(ReadFrom.MASTER_PREFERRED);
           return connection;
       }
   }
```

 * RedisSequence.java   : 메인서비스 소스

 ```java
   /**
    * 공통 Redis 공통채번
    */
   @Repository
   public class RedisSequence {   
    
       @Autowired
       @Qualifier("redisSequenceConnection")
       private StatefulRedisMasterSlaveConnection<String,String> connection;
        
       /**
        * 해당 sequence(채번)값을 리턴한다.
        * @param key : 채번에 사용되는 key값
        * @return 리턴값(int) = 현재값(int) + 1
        * @throws Exception
        */
       public int getSequence(String key) throws Exception {
           return this.connection.sync().incr(key).intValue();
       }
   }
```   
   
 * Redis Atomic Increment 참조

## 3. Redis Session
### 3-1. Redis Session 환경 세팅(Spring Boot + Spring Session )
 * 환경별 운영모드 
   - 모드     
      local/dev    :  single 모드
      tst /stg/prd :  cluster 모드

   - endpoint
      dev endpoint : dev, 1개의 endpoint 로 운영 
      tst/stg/prd  : session, object, sequence 별로 운영

 * application.yml

```yaml
    local
    ---------
    spring:
        redis:
            session:
            host: 127.0.0.1
            port: 6479 #터널링 포트  
            timeout: 50
    
    dev
    ---------
    spring:
        redis:
            session:
            host: wt-dev-biz-redis.xxxxxx.0001.apn2.cache.amazonaws.com #end-point
            port: 6379
            timeout: 50
    
    tst/stg/prd
    --------
    spring:
        redis:
            session:
                timeout: 50
                cluster:
                    nodes:
                    - wt-tst-biz-clust.xxxxxx.clustercfg.apn2.cache.amazonaws.com:5402 #end-point
```

### 3-2. RedisSessionConfig 생성
 * 프로젝트의 config 패키지에 RedisSessionConfig.java  생성
 * RedisSessionConfig.java

```java
    @Configuration
    public class RedisSessionConfig extends RedisHttpSessionConfiguration {
        
        @Bean
        public CookieSerializer cookieSerializer(@Value("${pattern.domain}") String domainPattern) {            
            DefaultCookieSerializer serializer = new DefaultCookieSerializer();
            serializer.setCookieName("JSESSIONID");
            serializer.setCookiePath("/");

            serializer.setDomainNamePattern("^.+?\\.(" +domainPattern + ")$");   // BO
            // cookieSerializer.setDomainNamePattern("^.+?\\.(\\w+\\.[a-z]+)$"); // MO/FO 용

            return serializer;
        }

        @Override
        @Bean(name = "sessionRedisTemplate")
        public RedisTemplate<Object, Object> sessionRedisTemplate(
                @Qualifier("httpSessionConnectionFactory") RedisConnectionFactory connectionFactory) {
            RedisTemplate<Object, Object> template = new RedisTemplate<Object, Object>();
            template.setKeySerializer(new StringRedisSerializer());
            template.setHashKeySerializer(new StringRedisSerializer());
            template.setConnectionFactory(connectionFactory);
            return template;
        }  
    }
```    

 * SessionTimeOut 설정

```yaml
    공통
    --------
    server:
        session:
            timeout: 3600
```        

   - 위의 설정은 @EnableRedisHttpSession(maxInactiveIntervalInSeconds=3600) 에 해당함 
   - 이하 설정을 추가

```java
    @Value("${server.session.timeout}")
    private Integer maxInactiveIntervalInSeconds;
    
    @PostConstruct
    public void init() {   
        super.setMaxInactiveIntervalInSeconds(this.maxInactiveIntervalInSeconds);
        super.setCookieSerializer(this.cookieSerializer);
        super.init();
    }
```


### 참고 1. Java 호출예제
```java
    // RedisTemplatet 선언부 추후 eccore에 데이터 템플릿 변경후 변경될 수 있습니다.
    @Autowired
    RedisTemplate<String, Object> redisObjectTemplate;

    // key 선언 so는 마지막에 sousers로 변경하시면 됩니다.
    private String redisKey = "bc:bfb:usermapping:bouser";


    // 전체 조회
    void findAll(){
    // bo-lib의 UserMappingModel 객체를 초기화 해주셔야 합니다.
    redisObjectTemplate.setHashValueSerializer(new Jackson2JsonRedisSerializer<UserMappingModel>(UserMappingModel.class));
    Map<Object, Object> users = redisObjectTemplate.opsForHash().entries(redisKey);

    for (Map.Entry<Object, Object> entry : users.entrySet()) {
        UserMappingModel value = (UserMappingModel) entry.getValue();
        System.out.println(value.getUserNo() + "-->" + value.getUserId());
    }
    }
    // 단건 조회
    void findOne(){
    redisObjectTemplate.setHashValueSerializer(new Jackson2JsonRedisSerializer<UserMappingModel>(UserMappingModel.class));

    Object user = redisObjectTemplate.opsForHash().get(redisKey, userNo);
    System.out.println("findOne " + userNo + "=>" + ((UserMappingModel) user).getUserId());
    }
    // 여러개 조회
    void multiGet(){
    Collection keySet = new ArrayList();
    keySet.add("I0000000832");
    keySet.add("I0000000155");
    keySet.add("I0000002059");
    keySet.add("I0000000923");
    keySet.add("I0000000295");

    List<Object> info = redisObjectTemplate.opsForHash().multiGet(redisKey, keySet);

    for(int i  =0 ; i < info.size(); i ++){
        System.out.println("multiGet=>" + ((UserMappingModel)info.get(i)).getUserId());
    }

    }
```

### 참고 2. RedisHttpSessionCacheConfig 구현소스
```java
    @Configuration
    @Profile({"local", "dev", "prj"})
    public class RedisHttpSessionCacheConfig {
        private static final Logger log = LoggerFactory.getLogger(RedisHttpSessionCacheConfig.class);
        
        @Autowired
        protected RedisHttpSessionProperties redisHttpSessionProperties;

        @Value("${spring.redis.object.max-pooling:100}")
        private int maxPooling;
        
        @Value("${spring.redis.object.min-pooling:20}")
        private int minPooling;

        @Primary
        @Bean(name = {"httpSessionConnectionFactory"})
        @Profile({"awsredis"})
        public RedisConnectionFactory httpSessionConnectionFactory() {
            if (this.redisHttpSessionProperties.getCluster() == null) {
            log.debug("RedisManager Object - redisClientType : NONE");
            // 커넥션풀링
            JedisConnectionFactory factory = new JedisConnectionFactory(httpSessionJedisPoolConfig());
            factory.setHostName(this.redisHttpSessionProperties.getHost());
            factory.setPort(this.redisHttpSessionProperties.getPort());
            factory.setDatabase(this.redisHttpSessionProperties.getDatabase());
            factory.setTimeout((int)(this.redisHttpSessionProperties.getTimeout().toMillis() * 1000L));
            factory.setUsePool(true);
            factory.afterPropertiesSet();
            return factory;
            } 
            log.debug("RedisManager Object - redisClientType : CLUSTER");
            // 클러스터링
            JedisConnectionFactory factory = new JedisConnectionFactory(new RedisClusterConfiguration(this.redisHttpSessionProperties.getCluster().getNodes()));
            
            factory.setTimeout((int)(this.redisHttpSessionProperties.getTimeout().toMillis() * 1000L));
            return factory;
        }
        
        @Bean
        @Profile({"awsredis"})
        public static ConfigureRedisAction httpSessionConfigureRedisAction() { return ConfigureRedisAction.NO_OP; }
        
        @Bean
        public JedisPoolConfig httpSessionJedisPoolConfig() {
            JedisPoolConfig jedisPoolConfig = new JedisPoolConfig();
            jedisPoolConfig.setMaxIdle(this.maxPooling);
            jedisPoolConfig.setMinIdle(this.minPooling);
            jedisPoolConfig.setTestOnBorrow(true);
            jedisPoolConfig.setTestOnReturn(true);
            return jedisPoolConfig;
        }
        
        @Bean(name = {"httpSessionRedisObjectTemplate"})
        @Profile({"awsredis"})
        public RedisTemplate httpSessionRedisObjectTemplate() {
            RedisTemplate<String, Object> redisTemplate = new RedisTemplate<String, Object>();
            StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
            redisTemplate.setKeySerializer(stringRedisSerializer);
            redisTemplate.setValueSerializer(stringRedisSerializer);
            redisTemplate.setHashKeySerializer(stringRedisSerializer);
            redisTemplate.setHashValueSerializer(stringRedisSerializer);
            redisTemplate.setDefaultSerializer(stringRedisSerializer);
            redisTemplate.setConnectionFactory(httpSessionConnectionFactory());
            return redisTemplate;
        }
    }
```

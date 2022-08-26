---
layout: single
title:  "[JAVA] - OXM Jackson 정리 (feat. Converter 사용 시 주의점)"
excerpt: "OXM(Object to XML) Jackson 관련 Timestamp, Converter관련오류 정리"

categories:
  - Java Lib
tags:
  - [Jackson, Spring Boot, OXM]

toc: true
toc_sticky: true
 
date: 2022-01-21
last_modified_at: 2022-01-21
---

# Jackson 라이브러리
## 1. Jackson
 * Spring에서 json 데이터 구조 및 xml의 오브젝트 맵핑을 처리. 
 * Spring에서 json, XML <---> Java Object Mapping 담당.
   - 직렬화, serializing, marshal : java 객체 -> json
   - 역직렬화, deserializing, umarshal : json -> java 객체
 * Spring 3.0 이후부터, Jacskon 관련 API제공
   - Jackson 이전에는 GSON or SimpleJSON 방식(직접 키와 벨류를 셋팅) 사용

## 2. Jackson 동작방식
 * Spring3.0 이후 컨트롤러가 @RequestBody 형식이면 Spring은 MessageConverter 를 통해 반환객체를 후킹.
 * Jackson은 JSON데이터를 출력하기 위한  MappingJacksonHttpMessageConverter를 제공.
   - 스프링 MessageConverter를 MappingJacksonHttpMessageConverter으로 등록
   - 자바 리플렉션 사용하여 컨트롤러가 리턴하는 객체를 정보를 취득
   - Jackson의 ObjectMapper API로 json 객체를 생성 후, 출력하여 json데이터를 완성.
 * Spring 3.1 이후 클래스패스에 Jackson 라이브러리가 존재하면 자동적으로 MessageConverter가 등록.

```java
  @RequestMapping("/json")
  @ResponseBody()
  public Object printJSON() {
    Person person = new Person("Mommoo", "Developer");
    return person;
  }
```

## 3. 기본지식
 * Jackson은 기본적으로 프로퍼티로 동작(Getter, Setter를 기준)
  - **멤버변수명과는 상관없음**
  - Jackson을 사용한다면, Getter에 주의.
 * Getter가 아닌 멤버변수로 하고 싶다면?
  - @JsonProperty 어노테이션 API 사용

```java
    public class Person {
      @JsonProperty("name")
        private String myName = "Mommoo";
      }
```

## 4. 데이터 매핑 법칙 변경
 * Jackson은 매핑법칙 변경관련 @JsonAutoDetect API 제공.
 * 멤버변수 기준 Jackson 변환.

```java
  @JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
  public class Person {
    private String myName = "Mommoo";
  }
```

 * 제외범위를 설정 : Getter정책으로 private 만 데이터 바인딩에 제외

```java
  @JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY, getterVisibility = JsonAutoDetect.Visibility.NON_PRIVATE)
  public class Person {
    private String myName = "Mommoo";
    
    public String getJob() {
        return "Developer";
    }
  }
```

## 5. 데이터 상태에 따른 포함 관계 설정
 * NULL값 과 같은 특정 데이터 상태인 경우 제외 시 @JsonInclude 사용.
   - 클래스 위 또는 프로퍼티에 선언가능.

```java
  @JsonInclude(JsonInclude.Include.NON_NULL)
  public class Person {
    private String myName = "Mommoo";
    
    public String getJob() {
        return "Developer";
    }
  }
  ​
  public class Person {
    private String myName = "Mommoo";
    
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public String getJob() {
        return "Developer";
    }
  }
```

## 6. Read + Write Annotations 정리
### @JsonIgnore
 * Jackson이 해당 프로퍼티를 무시하도록 하는 역할을 한다.
 
```java
  public class Test {
      @JsonIgnore
      public long id = 0;
      public String name = null;
  }
  <-->

  {"name":"circlee"}
```

### @JsonIgnoreProperties
 * @JsonIgnore 와 같은 기능, 해당 클래스의 여러 필드리스트를 무시하기 위해 사용한다.

```java
  @JsonIgnoreProperties({"firstName", "lastName"})
  public class PersonIgnoreProperties {

      public long    personId = 0;

      public String  firstName = null;
      public String  lastName  = null;

  }
  <-->

  {"firstName":"circlee7","lastName":"eldie"}
```

### @JsonIgnoreType
 * JsonIgnoreType 은 해당타입이 사용되는 모든곳에서 무시되도록 한다.

```java
    public class User {
      public int id;
      public Name name;

      @JsonIgnoreType
      public static class Name {
          public String firstName;
          public String lastName;
      }
  }

  @Test
  public void whenSerializingUsingJsonIgnoreType_thenCorrect()
    throws JsonProcessingException, ParseException {

      User.Name name = new User.Name("John", "Doe");
      User user = new User(1, name);

      String result = new ObjectMapper()
        .writeValueAsString(user);

      assertThat(result, containsString("1"));
      assertThat(result, not(containsString("name")));
      assertThat(result, not(containsString("John")));
  }
```

### @JsonBackReference
 * 부모자식 관계의 자식쪽에 작성함으로써 순환참조관계의 serialize 시 직렬화/역직렬화시 참조하여 동작한다. [참고](https://stackoverflow.com/questions/37392733/difference-between-jsonignore-and-jsonbackreference-jsonmanagedreference)

### @JsonManagedReference
 * 부모자식 관계의 부모쪽에 작성함으로써 순환참조관계의 serialize 시 직렬화/역직렬화시 참조하여 동작한다. [참고](https://stackoverflow.com/questions/37392733/difference-between-jsonignore-and-jsonbackreference-jsonmanagedreference)

```java
  public class ItemWithRef {
      public int id;
      public String itemName;

      @JsonManagedReference
      public UserWithRef owner;
  }

  public class UserWithRef {
      public int id;
      public String name;

      @JsonBackReference
      public List<ItemWithRef> userItems;
  }


  @Test
  public void whenSerializingUsingJacksonReferenceAnnotation_thenCorrect()
    throws JsonProcessingException {
      UserWithRef user = new UserWithRef(1, "John");
      ItemWithRef item = new ItemWithRef(2, "book", user);
      user.addItem(item);

      String result = new ObjectMapper().writeValueAsString(item);

      assertThat(result, containsString("book"));
      assertThat(result, containsString("John"));
      assertThat(result, not(containsString("userItems")));
  }
```

### @JsonAutoDetect
 * JsonAutoDetect는 특정접근제한자의 필드들을 추가하라고 Jackson에게 알려주는 역할을 한다.

```java
  @JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY )
  public class PersonAutoDetect {

      private long  personId = 123;
      public String name     = null;

  }
```

 * JsonAutoDetect.Visibility 는 접근레벨에 맞는 상수가 정의되어있다.
      ANY
    , DEFAULT
    , NON_PRIVATE
    , NONE
    , PROTECTED_AND_PRIVATE
    , PUBLIC_ONLY

## @JsonView
 * JsonView 는 어노테이션 인자로 넘겨진 View 에 해당하는 클래스로 구분되어 직렬화/역직렬화 시 설정된 JsonView 에 따라 매칭되는 프로퍼티들이 역/직렬화 대상에 포함된다.

```java
    @AllArgsConstructor
    public @Data class Person {
      private String name;
      
      @JsonView(PersonView.NORMAL.class)
      private String gender;
      
      @JsonView(PersonView.PRIVATE.class)
      private int age;
      
      @JsonView(PersonView.ADDITIONAL.class)
      private String address;
      
      @JsonView({PersonView.ADDITIONAL.class, PersonView.HOBBIES.class})
      private String hobbies;
      
      public static class PersonView {  
        interface NORMAL{}
        interface ADDITIONAL extends NORMAL{}
        interface PRIVATE extends NORMAL{}
        interface HOBBIES extends NORMAL{}
      }
    }
```

 * 실행: ObjectMapper writer/reader를 사용시 원하는 View를 지정한다.
  
```java 
    ObjectMapper om = new ObjectMapper();
    Person p = new Person("eldi", "male", 10, "seoul", "basketball");
    System.out.println(om.writeValueAsString(p));
    System.out.println(om.writerWithView(PersonView.NORMAL.class).writeValueAsString(p));
    System.out.println(om.writerWithView(PersonView.ADDITIONAL.class).writeValueAsString(p));
    System.out.println(om.writerWithView(PersonView.PRIVATE.class).writeValueAsString(p));
    System.out.println(om.writerWithView(PersonView.HOBBIES.class).writeValueAsString(p));
```

 * 출력:
  {"name":"eldi","gender":"male","age":10,"address":"seoul","hobbies":"basketball"} 
    - view 지정 하지 않는경우 전체 프로퍼티가 직렬화된다.

  {"name":"eldi","gender":"male"}
    - NORMAL 로 직렬화시에는 JsonView를 지정하지 않은 name과 view 와 매칭되는 gender 만 노출된다.

  {"name":"eldi","gender":"male","address":"seoul","hobbies":"basketball"} 
    - ADDITIONAL 로 직렬화 시에는 NORMAL 을 상속받았기 때문에 NORMAL, ADDITIONAL 해당하는 전체를 포함한다.

  {"name":"eldi","gender":"male","age":10}
    - 위와 마찬가지로 PRIVATE 와 부모인 NORMAL 에 해당하는 프로퍼티를 포함한다.

  {"name":"eldi","hobbies":"basketball"}
    - hobbies 프로퍼티는 ADDITIONAL 과 HOBBIES VIEW 가 복수개로 정의되어 있어서 두개의 VIEW 모두에 포함된다.

## 7. Read Annotations (Json Object to Java Object : Deserialize)
### @JsonSetter
 * Jackson은 Json Data와 Class 의 프로퍼티 이름이 일치해야 하지만 JsonSetter 를 사용하여, Json Data의 특정 프로퍼티 이름으로 Class의 Setter 메소드에 지정할수있다.

```java  
  {
    "id"   : 1234,
    "name" : "John"
  }

  <-->

  public class Bag {
      private Map<String, Object> properties = new HashMap<>();

      @JsonAnySetter
      public void set(String fieldName, Object value){
          this.properties.put(fieldName, value);
      }

      public Object get(String fieldName){
          return this.properties.get(fieldName);
      }
  }
```

### @JsonAnySetter
 * JSON Object 의 모든 setter 메소드를 인지할수 없는 필드에 대해 JsonAnySetter 어노테이션을 통해 Map<String, Object> 변수로 담을 수 있습니다.

```java  
    {
      "id"   : 1234,
      "name" : "John"
    }

    <-->

    public class Bag {
        private Map<String, Object> properties = new HashMap<>();

        @JsonAnySetter
        public void set(String fieldName, Object value){
            this.properties.put(fieldName, value);
        }

        public Object get(String fieldName){
            return this.properties.get(fieldName);
        }
    }
```

### @JsonCreator
 * JsonCreater 는 생성자메소드에 지정되어 JSON Object 의 필드 와 메소드의 파라미터 매칭을 통해 Java Object를 생성가능하게 한다.
 * @JsonSetter를 사용할수 없거나, 불변객체이기 때문에 setter 메소드가 존재하지 않을때 초기화 데이터 주입을 위해 유용하다.

```java 
    {
      "id"   : 1234,
      "name" : "John"
    }
    <-->
    public class PersonImmutable {

        private long   id   = 0;
        private String name = null;

        @JsonCreator
        public PersonImmutable(
                @JsonProperty("id")  long id,
                @JsonProperty("name") String name  ) {

            this.id = id;
            this.name = name;
        }

        public long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

    }
```

### @JacksonInject
 * JacksonInject 어노테이션은 Jackson 에의해 역직렬화된 Java Object에 공통정인 값을 주입할 수 있는 java Object의 프로퍼티를 지정한다.
 * 예를들어 여러 소스에서 Person Json Object를 파싱할때에 , 이 Json Object 의 소스가 어디인지 주입을 통해 저장할수 있다.

```java 
    public class PersonInject {
        public long   id   = 0;
        public String name = null;

        @JacksonInject
        public String source = null;
    }

    --- 

    InjectableValues inject = new InjectableValues.Std().addValue(String.class, "jenkov.com");
    PersonInject personInject = new ObjectMapper().reader(inject)
                            .forType(PersonInject.class)
                            .readValue(new File("data/person.json"));
```

 * inject 리더가 지정된 ObjectMapper 를 이용하여 파싱하게 되면 jacksonInject 어노테이션을 확인하여 필드의 타입기반 매칭으로 값을 주입한다.

### @JsonDeserialize
 * JsonDeserialize 는 필드가 커스텀한 Deserializer class를 사용할수 있도록 한다. 

```java 
    public class PersonDeserialize {
        public long    id      = 0;
        public String  name    = null;

        @JsonDeserialize(using = OptimizedBooleanDeserializer.class)
        public boolean enabled = false;
    }

    ---

    public class OptimizedBooleanDeserializer extends JsonDeserializer<Boolean> {

      @Override
      public Boolean deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JsonProcessingException {
        String text = jsonParser.getText();
        if("0".equals(text)) return false;
        return true;
      }      
    }
```

 * JsonDeserializer<T t> 를 상속을 통해 구현할때 필드에 맞는 genericType을 지정하여 상속받고, desirialze 메소드를 작성한다.

## 8. Write Annotations (Java Object to Json Object : Serialize)
### @JsonInclude
 * JsonInclude 는 특정한 상황? 상태? 의 필드만 Json Object 변경시 포함되도록 지정할수 있다. 

```java 
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public class PersonInclude {

        public long  personId = 0;
        public String name     = null;

    }
```

 * JsonInclude.Include 는 아래와 같은 include 상수들이 지정되어 있고 NON_EMPTY의 경우 not null과 not empty를 의미한다. java8 Optional 타입의 isAbsent 도 체크한다.
 *  ALWAYS
  , NON_NULL
  , NON_ABSENT
  , NON_EMPTY
  , NON_DEFAULT
  , USE_DEFAULTS

### @JsonGetter
 * @JsonSetter 와 반대로 setter메소드에 지정되며 해당하는 이름으로 Json Object 의 data field 가 생성된다.

```java 
    public class PersonGetter {
        private long  personId = 0;

        @JsonGetter("id")
        public long personId() { return this.personId; }

        @JsonSetter("id")
        public void personId(long personId) { this.personId = personId; }
    }
```

### @JsonAnyGetter
 * @JsonAnySetter 와 반대 역할로써 Key, Value 형식의 Map을 리턴하는 메소드에 지정함으로써  Json Object의 프로퍼티로 작성되게끔 한다.

```java 
    public class PersonAnyGetter {

        private Map<String, Object> properties = new HashMap<>();

        @JsonAnyGetter
        public Map<String, Object> properties() {
            return properties;
        }
    }

    <-->

    {
       "map.key1" : "map.key1.value"
      ,"map.key2" : map.key2.value
    ...
    }
```

### @JsonPropertyOrder
 * JsonPropertyOrder는 Java Object가 Json 으로 직렬화 될때 필드의 순서를 지정할 수 있다. (일반적으로 Jackson은 class 에서 필드를 발견하는 순서대록 직렬화 해버림)

```java
    @JsonPropertyOrder({"name", "personId"})
    public class PersonPropertyOrder {
        public long  personId  = 0;
        public String name     = null;
    }
```

### @JsonRawValue
 * JsonRawValue 는 특정필드에 지정되어, 해당 필드의 값이 raw하게 Json Output이 되도록 할 수 있습니다.

```java 
    public class PersonRawValue {
        public long   personId = 0;
        public String address  = "$#";
    }

```

 * 일반적으로 문자열은 Json Output 시에 쌍따옴표로 감싸진체 출려됩니다.

```java 
    {"personId":0,"address":"$#"}

    --- 
    
    public class PersonRawValue {
        public long   personId = 0;

        @JsonRawValue
        public String address  = "$#";
    }
```

   - @JsonRawValue를 사용하면 쌍따움표 없이 그대로 출력됩니다. {"personId":0,"address":$#} 하지만, 이것은 잘못된 Json형식입니다.

 * @JsonRawValue 는 Raw Json 문자열을 String 타입변수에 담아 출력할때 사용될수 있습니다.
 
```java
  public class PersonRawValue {

      public long   personId = 0;

      @JsonRawValue
      public String address  =
              "{ \"street\" : \"Wall Street\", \"no\":1}";

  }
  {"personId":0,"address":{ "street" : "Wall Street", "no":1}}
```

### @JsonValue
 * @JsonValue 를 지정함으로써 Jackson이 객체자체를 직렬화하지 않고 JsonValue 가 지정된 메소드를 호출하는것으로 대체할 수 있습니다.

```java
  public class PersonValue {

    public long   personId = 0;
    public String name = null;

    @JsonValue
    public String toJson(){
        return this.personId + "," + this.name;
    }

  }
  출력 : 
  "0,null"
  쌍따옴표는 Jackson에 의해 붙여지게 됩니다. 
  반환된 문자열내의 쌍따옴표는 모두 이스케이프 처리됩니다.
```

### @JsonSerialize
 * JsonSerialize를 이용하여 특정필드에 커스텀 serialzer를 지정할 수 있다.

``` java
  public class PersonSerializer {

      public long   personId = 0;
      public String name     = "John";

      @JsonSerialize(using = OptimizedBooleanSerializer.class)
      public boolean enabled = false;
  }
  public class OptimizedBooleanSerializer extends JsonSerializer<Boolean> {

      @Override
      public void serialize(Boolean aBoolean, JsonGenerator jsonGenerator, 
          SerializerProvider serializerProvider) 
      throws IOException, JsonProcessingException {

          if(aBoolean){
              jsonGenerator.writeNumber(1);
          } else {
              jsonGenerator.writeNumber(0);
          }
      }
  }
```

* 날짜타입의 클래스도 Jackson 레벨에서 특정패턴의 날짜형식으로 처리가 가능하나 날짜 Converter의 사용시 TimeZone문제 발생가능


# JAVA TimeZone 문제
 * 시간에 대한 API  및 BO Model 데이터 type은  timestamp일 경우 발생,  String에서는 발생하지 않음 

## 이슈 원인
 * Timestamp를 사용하게 되면 기본적으로 time-zone 이 default로 치환 
   - 다음과 같이 될수 있음 
   DB :  2018-02-08 09:10:45 →  timestamp  2018-02-08 00:10:45 
 * API 에서 BO 로 리턴시 만약 위와 같이 설정시 jackson.time-zone: Asia/Seoul json 변환시 정상적으로 2018-02-08 09:10:45 반환
 * 하지만 BO 에서도 jackson.time-zone: Asia/Seoul 설정 되어있다면 
 model의 @ 설정에 따라 최종적으로 Front에 전달시 2018-02-08 18:10:45 로 될수도 있음
 * 반대로 Front에서 datetime을 설정후 DB 저장시 model의 @ 설정에 따라 +9 +9 될수도 있음
 * 또한 API, BO  layer에서 model의 getXXX()를 가져올때 -9 시간의 데이터가 있을 가능성이 있어
 비지니스 로직 수행시 잘못된 데이터 처리가 발생할수도 있음
 * **이런 timestamp 의 단점을 보완하기 위해서 java8에서 java.time 클래스가 추가됨**
 **Timestamp 대신 LocalDateTime 클래스를 쓰기를 권장**
 * java의 Date, Calendar  클래스는 사용에 있어 문제가 많은점 발견, 이를 보완한 jodatime 라이브러리가 사용되었으며 jodatime의 기능을 jdk8 java.time이 수용해서 발표 

## 이슈 해결
 * pom.xml 에 아래 라이브러리를 추가한다 

``` xml
  <dependency>
      <groupId>com.fasterxml.jackson.datatype</groupId>
      <artifactId>jackson-datatype-jsr310</artifactId>
      <version>2.9.4</version>
  </dependency>
  
  <!--mybatis에서 java8 time 변환-->
  <dependency>
      <groupId>org.mybatis</groupId>
      <artifactId>mybatis-typehandlers-jsr310</artifactId>
      <version>1.0.2</version>
  </dependency>
```

 * application.yml아래 사항을 삭제및 추가

```yaml
  ##변경전 
  spring:
      jackson:
          time-zone: Asia/Seoul
  
  
  #변경후
  spring:
    jackson:   
      serialization:     
        write_dates_as_timestamps: false
```


 * Model 클래스의 Timestamp를 다음과 같이 변경

```java
  ## 변경전
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private Timestamp writeDate;
  
  
  ## 변경후
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime writeDate;
  
  
  ## 만약 페이지에서 time 정보를 받아 Model에 세팅 할경우 (@DateTimeFormat 추가 해주면 된다 )
  @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime writeDate;
```

 * ObjectMapper 를 사용하여 model → json 또는  json → model , map → model  등으로 convert 할경우 오류가 발생할수 있음 
   - ** 해결 방법 : ObjectMapper 를 new 하지 말고 @Autowired 해서 사용해야 한다** 

```java
  ## 변경전
  ObjectMapper mapper = new ObjectMapper();
  mapper.convertValue(map, Board.class); 
  
  ##변경후
  @Autowired
  private ObjectMapper mapper;
  mapper.convertValue(map, Board.class);

```


 ## Thymeleaf  java.time  formatter 오류 나는 경우 해결 방법 
 다음과 같이 #dates.format 사용할 경우 오류가 발생할수 있음 ( Thymeleaf  페이지에서 format 없거나 String으로  내려받을경우는 오류 없음)

 ### 오류 발생
```html 
  <td width="80" th:text="${#dates.format(board.writeDate, 'yyyy-MM-dd HH:mm:ss')}"></td>
```

 ### 해결 방법 
  * pom.xml  변경 
```xml
  <!--  주석 또는 삭제한다
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-thymeleaf</artifactId>
      </dependency>
  -->
  
  <!--아래 사항을 추가한다 -->
  <dependency>
      <groupId>org.thymeleaf</groupId>
      <artifactId>thymeleaf</artifactId>
      <version>3.0.9.RELEASE</version>
  </dependency>
  
  <dependency>
      <groupId>org.thymeleaf</groupId>
      <artifactId>thymeleaf-spring4</artifactId>
      <version>3.0.9.RELEASE</version>
  </dependency>

  <dependency>
      <groupId>org.thymeleaf.extras</groupId>
      <artifactId>thymeleaf-extras-java8time</artifactId>
      <version>3.0.1.RELEASE</version>
  </dependency>
```

 * java8 time 을 대응하기 위해서는 thymeleaf 3 이상이 필요
 * 참고로 spring-boot 1.5.6 의 spring-boot-starter-thymeleaf 는 2.x.x 를 사용
 * spring-boot-starter-thymeleaf 를 주석 또는 삭제하고 버전업
 * 아래와 같이 #temporals.format() 를 사용

```html 
<td width="80" th:text="${#temporals.format(board.writeDate, 'yyyy-MM-dd HH:mm:ss')}"></td>
```

 * Thymeleaf Dialect를 사용한 프로젝트의 경우 Thymeleaf 3 이상 설정시 몇 가지 더 세팅이 필요


## API 또는 BO 에서  Serialization/Deserialization 못찾는 경우 
 * API 는 정상인데 BO 에서 Serialization/Deserialization 못찾는 경우 이하와 비슷한 에러가 발생

```txt
  java.lang.NoSuchMethodError: com.fasterxml.jackson.databind.DeserializationContext.wrongTokenException(Lcom/fasterxml/jackson/core/JsonParser;Ljava/lang/Class;Lcom/fasterxml/jackson/core/JsonToken;Ljava/lang/String;)Lcom/fasterxml/jackson/databind/JsonMappingException;
      at com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer.deserialize(LocalDateTimeDeserializer.java:141)
      at com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer.deserialize(LocalDateTimeDeserializer.java:39)

```

 * 위와 같이 발생할 경우 해결 방법

```java
  @JsonSerialize(using = LocalDateTimeSerializer.class)  //추가
  @JsonDeserialize(using = LocalDateTimeDeserializer.class) //추가
  @JsonFormat( pattern="yyyyMMddHHmmss")
  private LocalDateTime rgstDttm;
```

 * 위와 같이 model에 Serialization/Deserialization 를 명시적으로 선언해 주면 해결
 * 모든 model에 @JsonSerialize/@JsonDeserialize 를 추가해 주어야하므로 근본적으로 에러 원인을 찾아 해결 해야함
 * 가이드대로 진행한 경우 에러가 발생하지 않지만 위의 에러가 발생하는 경우는 추가적으로 Custom Serialization/Deserialization 를 추가 했을 경우 발생
 * API 의 WebConfig.java 에 다음과 같이 추가 등록한 경우 발생가능

 ```java
  에러 발생 코드
  --------------
  
  @Override
  public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
      converters.add(mappingJackson2XmlHttpMessageConverter());
      converters.add(mappingJackson2HttpMessageConverter());
  }
  
  private MappingJackson2XmlHttpMessageConverter mappingJackson2XmlHttpMessageConverter() {
      return new MappingJackson2XmlHttpMessageConverter(
              new Jackson2ObjectMapperBuilder().createXmlMapper(true).propertyNamingStrategy(new NamingStrategy()).build());
  }
  
  private MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
      ObjectMapper mapper = new ObjectMapper();
      mapper.registerModule(new SimpleModule().addDeserializer(Timestamp.class, new TimestampDeserializer()));
      mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES , false);
      mapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY , true);
      return new MappingJackson2HttpMessageConverter(mapper);
  }
 ```
 
```java
  에러 해결 코드
  ------------
 
  @Override
  public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
      converters.add(mappingJackson2XmlHttpMessageConverter());
      //converters.add(mappingJackson2HttpMessageConverter()); //사용하지 않는다
  }
  
  private MappingJackson2XmlHttpMessageConverter mappingJackson2XmlHttpMessageConverter() {
      return new MappingJackson2XmlHttpMessageConverter(
              new Jackson2ObjectMapperBuilder().createXmlMapper(true).propertyNamingStrategy(new NamingStrategy()).build());
  }
  
  /*
  필요없을 경우 삭제한다
  private MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
      ObjectMapper mapper = new ObjectMapper();
      mapper.registerModule(new SimpleModule().addDeserializer(Timestamp.class, new TimestampDeserializer()));
      mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES , false);
      mapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY , true);
      return new MappingJackson2HttpMessageConverter(mapper);
  }
  */
```
 * 즉 에러 원인은 아래와 같이 TimestampDeserializer() 를 등록 했기 때문에 발생했다 

```java
  mapper.registerModule(new SimpleModule().addDeserializer(Timestamp.class, new TimestampDeserializer()));
```

 * API model에는 LocalDateTime 타입으로 선언되었지만 Timestamp 타입으로 Deserializer 되어 있고 이를 json 으로  BO 전달 되었다 ( API 에는 에러가 발생하지 않을수 있다)
 * BO에서는  LocalDateTime 타입을 찾았으나 Timestamp 타입이 발견되어 위와 같은 에러가 발생하게 되었다 
 * 따라서 위의 커스텀 Jackson2HttpMessageConverter 를 삭제하면 에러가 해결된다 
 * 이를 등록한 개발자는 다른 프로젝트에서 사용한 사항을 정확한 이해없이 copy & paste로 등록 했기 때문에 발생했다 
 * 가이드 내용외에 커스텀 Jackson2HttpMessageConverter를 추가할 경우에는 필히  이해하고서 추가해야 할 것이다 

---
layout: single
title:  "[Spring Batch] - commit-interval, skip-limit"
excerpt: "chunk 방식에서의 커밋과 재처리, 그에따른 유의사항"

categories:
  - Spring Batch
tags:
  - [Spring Batch]

toc: true
toc_sticky: true
 
date: 2022-01-23
last_modified_at: 2022-01-23
---

# 1. commit-interval
## 1-1. commit-interval 설명
 * Spring Batch Job 중 chunk방식 설정 시 commit-interval 이라는 값을 지정가능
 * 스프링 배치 문서
  > The number of items that will be processed before commit is called for the transaction.  
  > Either set this or the chunk-completion-policy but not both. Can be specified as an expression
  > that will be evaluated in the scope of the step (e.g. "#{jobParameters['commit.interval']}").
  >
  >
  > 트랜잭션 커밋이 호출되기 전 처리되어야 하는 아이템들의 갯수.
  > 이것을 설정하거나 chunk-completion-policy를 설정할 수 있으나 둘 다 할 수는 없다.
  > "#{jobParameters['commit.interval']}" 와 같이 스텝 스코프의 표현식으로도 지정될 수 있다.
  >

 * 설정방법 1. commit-interval 지정

```xml
    <job id="testJob">  
        <step id="testJob-step1">  
            <tasklet>  
                <chunk reader="testReader" processor="testProcessor" writer="testWriter" commit-interval="100"/>  
            </tasklet>  
        </step>  
    </job>  
```

 * 설정방법 2. Java Config 설정

```java
    @Bean  
    public Job testJob() {  
        return jobBuilderFactory.get("testJob")  
            .start(testStep())  
            .build();  
    }  
    
    @Bean  
    public Step testStep() {  
        return stepBuilderFactory.get("testStep")  
            .<String, String>chunk(100)  
            .reader(testReader)  
            .processor(testProcessor)  
            .writer(testWriter)  
            .build();  
    }  
```

 * chunk메소드 chunkSize 인자로 입력되는 값이 commit-interval 값.

## 1-2. commit-interval 의미

 * reader가 읽고 processor가 처리해서 writer에 넘겨지는 갯수를 의미. 
 * 트랜잭션 설정이 되어있다면 이 단위로 트랜잭션 커밋이 발생. 
 * 스프링 배치는 reader가 읽고나서 processor가 처리한 갯수가, commit-interval개 만큼 쌓이면 writer에 item들을 보내서 write 실행.
   - [스프링 배치 문서참고](https://docs.spring.io/spring-batch/reference/html/configureStep.html)
    ```java
        List items = new Arraylist();  
        for (int i = 0; i < commitInterval; i++){  
            Object item = itemReader.read()  
            Object processedItem = itemProcessor.process(item); 

            items.add(processedItem);  
        }  
        itemWriter.write(items);
    ```

   - reader에서 읽은 item의 타입과 processor가 받는 input item의 타입이 동일
   - writer는 processor의 output 타입의 item을 List로 받음.

 * Spring Batch에서 chunk처리 시 ItemReader, ItemProcessor 인터페이스의 메소드는 단 건 처리 
 * ItemWriter 인터페이스의 메소드는 List를 처리.

## 1-3. ItemReader 에서 복수 item을 취득했을 경우
 * IbatisPagingItemReader와 같은 여러 건을 한번에 읽는 reader를 사용하여 ItemReader가 단수 읽어오는게 아닌 경우
   > 예를 들어 commit-interval이 100으로 설정되어 있고 IbatisPagingItemReader에서 100건씩 페이징 처리하여 읽고 있다면, 
   > 실제로는 reader의 1번에 취득건수 100건 * 커밋인터발 100 으로 동작하여 
   > 10000건을 읽은 후에야 writer에 item들이 전달되는 것이 아닐까?
   > 하지만 그렇게 되어 있지는 않고 reader 내부에 데이터를 적재해두고 read가 호출될 때마다 1건씩 리턴해주는 방식으로 되어있다.
   > 적재한 데이터가 다 없어지면 새로 쿼리를 실행하고 리턴해준다. 

 * 참고 1. AbstractPagingItemReader
   - IbatisPagingItemReader가 상속하고 있는 페이징처리 reader 추상클래스

```java
    protected T doRead() throws Exception {  
    
        synchronized (lock) {  
    
            if (results == null || current >= pageSize) { // #1
                if (logger.isDebugEnabled()) {  
                    logger.debug("Reading page " + getPage());  
                }  

                doReadPage();  

                page++;  
                if (current >= pageSize) {  
                    current = 0;  
                }  
            }  

            int next = current++;  // #2
            if (next < results.size()) {  
                return results.get(next);  
            }  
            else {  
                return null;  
            }  
    
        }  
    }  
```
   - #1 처음 호출되는 것이거나 가지고 온 갯수를 넘어갔다면 doReadPage 메소드를 호출
   - #2 데이터가 있거나 새로 읽어왔다면 results에서 한개를 꺼내서 리턴한다.(results는 List<T> 타입의 멤버 변수)

 * 참고 2. IbatisPagingItemReader doReadPage 메소드.

```java
    @Override  
    @SuppressWarnings("unchecked")  
    protected void doReadPage() {  
        Map<String, Object> parameters = new HashMap<String, Object>();  

        if (parameterValues != null) {  
            parameters.putAll(parameterValues);  
        }  

        parameters.put("_page", getPage());  
        parameters.put("_pagesize", getPageSize());  
        parameters.put("_skiprows", getPage() * getPageSize());  

        if (results == null) {  
            results = new CopyOnWriteArrayList<T>();  
        }  
        else {  
            results.clear();  
        }  

        results.addAll(sqlMapClientTemplate.queryForList(queryId, parameters));  // #1
    }  
```

   - _page, _pagesize 등의 파라미터는 파라메터로 쿼리에 직접 설정한 값.
   - #1 : SqlMapClientTemplate을 이용해 쿼리를 실행해서 results에 추가.

## 1-4. 정리
 * reader 내부에서 데이터를 어떻게 가져오는지는 reader에서 구현하기 나름.
 * reader 에서 힌번에 몇건의 item을 취득하던 관계없이 doRead 메소드에서는 1건만을 리턴.
 * 즉, **commit-interval 건수는 reader의 취득건수와는 관계없음.**

# 2. skip-limit
## 2-1. Spring Batch skip 동작 방식
 * chunk 단위 처리할 때 skip-limit에 설정된 횟수만큼은 예외가 발생해도 예외를 skip하고 계속해서 job 수행

## 2-2. writer에서의 오류발생시 재처리
 * 1개 단위로 처리, 예외발생시 7번까지 skip하고 진행하는 chunk 처리
```xml
    <chunk reader="itemReader" processor="itemProcessor" writer="itemWriter" 
                                commit-interval="1" skip-limit="7">
        <skippable-exception-classes>
            <include class="java.lang.Exception"/>
        </skippable-exception-classes>

    </chunk>
```

 * processor에서 예외가 발생한 경우 예외가 발생한 item은 skip, 다음 item 처리진행.
 * writer에서 예외가 발생한 경우 skip되지 않고 같은 item이 다시 processor부터 다시한 번 재처리.

## 2-3. writer에서의 오류발생시 processor 재처리 상세
 * item 하나씩 처리하는 reader, processor에 비해 writer는 commit-interval 설정 값만큼 list로 받아서 처리.
 * reader, processor 는 처리 중이었던 item을 skip. 
 * writer 는 list의 item 중 어떤 것을 처리하다가 예외가 발생했는지 알 수 없음
 * **list의 item 하나씩 processor, writer를 다시 수행** (이처리를 위해 commit-interval을 일시적으로 1로 변경)
   - 에러가 발생하지 않은 item은 성공할 때마다 커밋
   - 재수행하면서 에러가 발생했던 item은 에러가 발생, 그리고 skip-limit까지 재수행.
   - 재수행 시 에러가 발생할 때마다 skip count가 증가.
 * 에러난 item들의 재처리가 끝나고 난 뒤에는 commit-interval 값은 원래 설정값으로 원복.
 * commit-interval = 1의 경우, 예외발생 때 마다 처리 중이던 1개의 item이 다시 processor부터 재수행.

## 2-4. writer에서의 오류발생시 processor 재처리 제외방법
 * processor에도 DB처리가 있을 수 있어 writer에서 에러발생시 트랜잭션 롤백으로 인해 processor에서 수행했던 DB처리들도 롤백.
 * processor에서 DB 작업이 없다면 굳이 processor부터 재수행할 필요없음.
 * **processor-transactional="true" 설정을 추가하면 writer부터 재수행**
   - 설정을 추가하면 processor 결과를 캐싱해두고 그것을 이용해서 writer부터 재수행

## 주의
 * 재수행되면 DB 작업은 롤백으로 기존에 했던 작업은 취소되지만 DB 작업 이외의 작업들은 같은 작업이 두 번 수행될 수 있다는 점 유의필요

#### 출처:  [Spread your wings](https://sheerheart.tistory.com/entry/Spring-Batch-commitinterval에-대한-정리?category=929972)
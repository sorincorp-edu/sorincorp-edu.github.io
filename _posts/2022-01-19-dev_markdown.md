---
layout: single
title:  "[.md] - MarkDown파일 작성방법 (feat. Jekyll)"
excerpt: "jekyll에서 해석가능한 md파일 작성방법"

categories:
  - Blog
tags:
  - [Markdown, Jekyll]

toc: true
toc_sticky: true
 
date: 2022-01-19
last_modified_at: 2022-01-19
---

# Markdown (.md 파일)
## 1. 마크다운(markdown)은

  일반 텍스트 문서의 양식을 편집하는 문법이다. 
  README 파일이나 온라인 문서, 혹은 일반 텍스트 편집기로 문서 양식을 편집할 때 사용
  마크다운을 이용해 작성된 문서는 쉽게 HTML 등 다른 문서형태로 변환이 가능하다.

## 2. 사용법
### 1)제목
 * 제목을 정할 때는 '#'을 이용해서 강조
 * '#'과 제목사이의 간격을 띄워야 변환. 최대 6개까지 지원

```text
  # 가장큰 크기의 text로 변환
  ## 그다음 작은 크기위 text로 변환
  ### 그다음 작은 크기의 text로 변환
  #### 그다음 작은 크기의 text로 변환
  ##### 그다음 작은 크기의 text로 변환
  ###### 그다음 작은 크기의 text로 변환
```

 * 출력화면
> # 가장큰 크기의 text로 변환
> ## 그다음 작은 크기위 text로 변환
> ### 그다음 작은 크기의 text로 변환
> #### 그다음 작은 크기의 text로 변환
> ##### 그다음 작은 크기의 text로 변환
> ###### 그다음 작은 크기의 text로 변환

### 2) source 코드삽입
 * 방법 1. tab을 이용해서 코드블럭 만들기
   - 코드 블럭 시키고 싶은 내용 앞뒤로 enter
```
      code 1

          code 2 // code block 할 내용
 
      code 3 // 정상적으로 출력
```

>  code 1
>
>      code 2 // code block 할 내용
>
>  code 3 // 정상적으로 출력

 * 방법 2. ``` 과 ``` 사이 코드 삽입

  ```text
    '``java
      public class Test {
        @JsonIgnore
        public long id = 0;
        public String name = null;
      }
    '``
  ```

 * 출력화면

> ```java
>     public class Test {
>       @JsonIgnore
>       public long id = 0;
>       public String name = null;
>     }
> ```

### 3) BlockQuote 사용하기(인용구)

  ```text
    > 테스트문구 1
    > > 테스트문구 2
    > > > 테스트문구 3
  ```  

 * 출력결과

  > 테스트문구 1
  > > 테스트문구 2
  > > > 테스트문구 3

### 4) 숫자 목록 츨력

1. 안녕하세요
2. 오늘하루도
3. 행복하세요


### 5) 순서 없는 목록 출력 (글머리 기호)
 * +, *, -  총 3가지의 기호사용
 * tab을 사용해 소속을 만들 수 있습니다.

### 6) 구분선, 수평선 만들기

  ```text
    테스트문구 1
    ------------
    테스트문구 2
  ```

 * 출력화면

> 테스트문구 1
> ------------
> 테스트문구 2

### 7) 링크(Link)
  ```text
    * 유형 1. : `설명어`를 클릭하면 URL로 이동 [테스트 블로그](https://m2mkwt.github.io "마우스를 올려놓으면 말풍선이 나옵니다.")  
    * 유형 2. : URL 보여주고 `자동연결` <https://m2mkwt.github.io>  
    * 유형 3. : 동일 파일 내 `문단 이동`  [동일파일 내 문단 이동](# Markdown (.md 파일))  
  ```

 * 출력화면

  * 유형 1. : `설명어`를 클릭하면 URL로 이동 [테스트 블로그](https://m2mkwt.github.io "마우스를 올려놓으면 말풍선이 나옵니다.")  
  * 유형 2. : URL 보여주고 `자동연결` <https://m2mkwt.github.io>  
  * 유형 3. : 동일 파일 내 `문단 이동`  [동일파일 내 문단 이동](# Markdown (.md 파일))  

### 8) 표그리기(table)
 * 파이프(|), 하이픈(-) 을 이용하여 column들과 헤더를 생성 및 구분할 수 있다.
 * 테이블 양쪽 끝에 있는 파이프(|) 는 없어도 된다. (하지만 있는 게 더 보기 쉽다.)
 + 셀 너비는 내용에 맞게 알아서 정해지므로 굳이 Markdown 소스 상에서 맞추지 않아도 된다.
 * 헤더를 구분할 때는 - 를 각 column에 3개 이상 사용해야한다.

 * 작성 방법

  ```text
    |First Header|Second Header|
    |---|---|
    |Content Cell| Content Cell  |
    |Content Cell| Content Cell  |
  ```

 |First Header|Second Header|
 |---|---|
 |Content Cell|Content Cell|
 |Content Cell|Content Cell|


 * 표 내부 서식 및 정렬 방법
   - 표 내에서도 링크, 인라인 코드, 텍스트 스타일 사용가능

 * 작성 방법

  ```text
    | Command      | Description |
    |---|---|
    | `git status` | List all *new or modified* files |
    | `git diff`   | Show file differences that **haven't been** staged |
  ```

 |Command|Description|
 |---|---|
 |`git status`|List all *new or modified* files|
 |`git diff`|Show file differences that **haven't been** staged|


 * 헤더 행의 하이픈-의 오른쪽, 왼쪽, 양쪽에 콜론:을 포함시켜서 오른쪽, 왼쪽, 중앙 정렬할 수 있다.

 * 작성 방법

  ```text
    | Left-aligned | Center-aligned | Right-aligned |
    |:---|:---:|---:|
    | git status   |   git status   |    git status |
    | git diff     |    git diff    |      git diff |
  ```

 | Left-aligned | Center-aligned | Right-aligned |
 |:---|:---:|---:|
 | git status   |   git status   |    git status |
 | git diff     |    git diff    |      git diff |

 * 파이프를 셀 내용에 포함시키려면 이스케이프\를 사용하면 된다.

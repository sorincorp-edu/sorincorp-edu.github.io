---
layout: single
title:  "[Modern Java] 람다식 및 예제"
excerpt: "람다식(Lambda Expressions) 사용법 및 예제"

categories:
  - Java
tags:
  - [Modern Java]

toc: true
toc_sticky: true
 
date: 2022-04-08
last_modified_at: 2022-04-08
---
# 람다식
자바8에서 '람다식(Lambda Expression)'이 지원되면서 자바는 완전히 새로운 언어처럼 보이기 시작했다. 지네릭스(Generics)가 자바을 크게 변화시킨 것처럼 람다식 역시 자바를 어마어마하게 변화시켰다. 람다식의 등장으로 자바는 객체지향 언어의 특징과 함께 함수형 언어의 특성을 갖추게 되었다.

## 람다식(Lambda expression)
람다식은 1930년대 알론조 처치(Alonzo Church)라는 수학자가 처음 제시한 함수의 수학적 표기방식인 '람다 대수(lambda calculus)'에 그 뿌리를 두고 있다. 람다식을 이용하면 코드가 간결해지고, 지연 연산 등을 통해서 성능 향상을 도모할 수 있다. 반면 모든 엘리먼트를 순회하는 경우에는 성능이 떨어질 수도 있고, 코드를 분석하기 어려워 질 수 있다는 단점도 존재한다.

람다식은 다음과 같은 형태를 가지고 있다.

> (매개변수, ...) -> { 실행문 }

화살표(->)를 기준으로 왼쪽에는 람다식을 실행하기 위한 매개변수가 위치하고, 오른쪽에는 매개변수를 이용한 실행 코드 혹은 실행 코드 블럭이 온다. 

예를 들어 두 정수를 입력 받아서 합을 구해주는 'sum()'이라는 메소드를 생각해보자.

```java
  public int sum(int a, int b) {
      return a + b;
  }
```

이 메소드를 사용하기 위해서는 클래스를 정의하고, 클래스에 메소드를 정의해야한다. 단순히 두 정수를 더하는 메소드를 만들기 위해서 불필요한 클래스 정의를 해야한다. 

sum() 메소드를 람다식으로 표현해보면 다음과 같이 작성할 수 있다.

```java
  (a, b) -> a + b;
```

두 정수 a와 b를 입력받아 두 값을 더하는 하나의 식이다. 한줄로 의도하는 동작을 명확하게 정의할 수 있다. 람다식으로 정의하면 불필요한 클래스의 정의도 필요없다. 메소드의 리턴 타입도 없고, 메소드의 이름도 없다. 이 때문에 람다식을 '익명함수(Anonymous Function)'라고 부르기도 한다.

사실 명확하게 보면 자바의 람다는 '익명 클래스(Anonymous class)'로 생각할 수 있다. 위에서 봤던 람다식은 다음 익명 클래스와 동일하게 생각할 수 있다.

```java
  new Object() {
      int sum(int a, int b) {
            return a + b;
      }
  }
```

소스코드에서는 람다식으로 간결하게 사용하지만 자바 컴파일러가 람다식을 익명 클래스처럼 해석해준다. 람다식이 곧 익명 클래스 객체이기 때문에 다른 메소드의 인자로 일반 객체를 넘기듯이 람다를 넘겨줄 수도 있다. 반대로 메소드의 리턴 값으로 람다를 넘겨 받을 수도 있다. 함수형 프로그래밍 언어에서 말하는 '고계함수(High-order Function)'를 자바에서는 익명 클래스를 통해서 자연스럽게 지원하고 있다.

## 람다식 문법(Lambda expression syntax)
자바에서 람다식을 사용하는 문법을 자세히 들여다보자. 자바에서 람다식은 다음과 같이 사용할 수 있다.

> (매개변수 목록) -> { 람다식 바디 }

람다식의 시작 부분에는 파라미터들을 명시할 수 있다. 비교적 엄격한 타입 제한을 두고 있는 자바이지만 람다식의 파라미터를 추론할 수 있는 경우에는 타입을 생략할 수 있다. (매개변수의 타입을 추론할 수 없는 경우에는 메소드의 매개변수처럼 타입을 명시해줘야한다.)

매개변수가 하나인 경우 괄호를 생략할 수 있다. 예를 들어 제곱을 구하는 람다식을 다음처럼 정의할 수 있다.

> a -> a * a

매개변수가 하나라서 괄호를 생략했다. 더 깔끔한걸 확인할 수 있다.

람다식의 바디부분에 하나의 표현식만 오는 경우에는 중괄호를 생략할 수 있다. 위에서 봤던 더하기, 제곱을 구하는 람다는 모두 식이 하나라서 중괄호를 생략할 수 있었다. 중괄호가 생략된 람다식에서는 세미콜론(;)을 붙이지 않는다.

한가지 예외가 있는데 람다식의 바디에 'return' 문이 있는 경우 중괄호를 생략할 수 없다. 예를 들어

> (a, b) -> { return a > b ? a : b }

이런 람다식을

> (a, b) ->  return a > b ? a : b 

이렇게 바꾸면 에러가 발생한다. 중괄호를 쓰고 싶지 않으면, 

> (a, b) ->  a > b ? a : b 

이렇게 하나의 표현식으로 써주면 된다.

### 예제) 람다를 이용한 Runnable 구현
자바에서 멀티 쓰레드 프로그램을 작성할 때, Runnable 인터페이스를 구현한 클래스가 필요하다. 간단하게 run() 메소드만 구현하면 되기 때문에 대부분의 코드에서 익명 객체를 이용해 구현한다.

예를 들어 

```java
  Thread thread = new Thread(new Runnable() {

      @Override
      public void run() {
            System.out.println("Start Thread");
            Thread.sleep(1000);
            System.out.println("End Thread");
    }
  });
```
이렇게 쓰레드에서 실행할 코드를 구현하곤 한다. 이런 코드는 람다식을 이용해 구현하면 더 간단해진다.

```java
  Thread thread = new Thread(() -> {
            System.out.println("Start Thread");
            Thread.sleep(1000);
            System.out.println("End Thread");
  });
```

### 예제) 람다를 이용한 컬렉션 순회
람다를 이용해서 짧게 작성할 수 있는 코드 중에 가장 흔한 종류가 컬렉션과 같이 사용하는 경우다. List<> 인터페이스에 추가된 forEach() 메소드를 이용하면 리스트 컬렉션에 들어있는 각 엘리먼트들의 내용을 입력받은 람다식을 수행할 수 있다.

다음 코드를 살펴보자. 

```java
  List<String> list = new ArrayList();
  list.add("Element1");
  list.add("Element2");
  list.add("Element3");

  list.forEach(x -> System.out.println(x))
// 위 코드는 list.forEach(System.out::println) 으로 축약할 수 있음
```

리스트의 각 엘리먼트를 순회하면서 System.out.println()을 호출하는 코드가 굉장히 간단해졌다.

## 함수형 인터페이스 (Functional Interface)
람다식은 익명 객체라고 했다. 익명 객체는 메소드의 인자로 넘겨 줄 수도 있고, 메소드의 리턴 값으로 넘겨 받을 수도 있다. 따라서 익명 객체인 람다를 다룰 수 있는 인터페이스가 필요하다. Object 타입으로 람다를 다루기에 람다 관련 기능을 Object 클래스에 넣어야 하는 부담이 있었다.

람다식을 저장할 수 있는 변수는 '함수형 인터페이스(functional interface)' 타입이어야 한다.

> FunctionalInterface myLambda = (a, b) -> a + b;

FunctionalInterface는 하나의 추상 메소드만을 갖는 인터페이스다. 그 추상 메소드의 시그니처(매개변수 개수와 타입, 리턴타입)와 동일한 시그니처를 갖는 람다함수를 할당해서 사용할 수 있다. (Functional Interface의 static 메소드와 default 메소드의 개수에는 제약이 없다)

### 함수형 인터페이스 정의
함수형 인터페이스를 정의하고 '@FunctionalInterface' 애너테이션을 붙여주면 자바 컴파일러가 함수형 인터페이스의 정의를 검증해준다.

예를 들어

```java
  @FunctinalInterface
  interface MySum {
      public int sum(int a, int b);
  }
```
이런 인터페이스를 정의하면 두 숫자를 더하는 람다를 다음과 같이 사용할 수 있다. 

```java
  public static void main(String []args) {

      MySum func = (a, b) -> a + b;

      System.out.println(func.sum(10, 11));
  }
```
이 코드를 실행하면 21이라는 숫자가 출력된다. 

### java.util.function 패키지
자바에서는 자주 사용되는 함수형 인터페이스들을  'java.util.function' 패키지에 미리 정의해놨다. 이 패키지에 정의된 인터페이스를 사용하고 없는 경우에만 정의해서 사용하는게 좋다.

가장 기본적인 함수형 인터페이스는 다음과 같다. 

|:---:|:---:|
| 함수형 인터페이스 | 메서드 |
|:---:|:---:|
| java.lang.Runnable | void run(); |
| Supplier<T> | T get(); |
| Consumer<T> | void accept(T t); |
| Function<T, R> | R apply (T t); |
| Predicate<T> | boolean test(T t); |

파라미터가 두 개인 함수형 인터페이스는 다음과 같다. 

|:---:|:---:|
| 함수형 인터페이스 | 메서드 |
|:---:|:---:|
| BiConsumer<T, U> | void accept(T t, U u); |
| BiPredicate<T, U> | boolean test(T t, U u); |
| BiFunction<T, U, R> |	R apply(T t, U u); |

파라미터가 세 개 이상인 함수형 인터페이스의 경우 직접 정의해서 사용해야한다. 대부분의 람다식은 단순하기 때문에 두 개의 파라미터만으로도 충분히 정의가 되기 때문에 이들만 패키지에 포함되어 있다.

하나의 파라미터를 받고 동일한 타입을 리턴하는 함수형 인터페이스들도 있다.

|:---:|:---:|
| 함수형 인터페이스 | 메서드 |
|:---:|:---:|
| UnaryOperator<T> |	T apply(T t); |
| BinaryOperator<T> | T apply(T t1, T t2); |

제네릭을 사용하는 함수형 인터페이스는 기본형(Primitive Type)을 사용할 때, 래퍼(Wrapper) 클래스를 사용해야하는 비효율이 있었다. 따라서 기본형(Primitive Type)을 사용하는 함수형 인터페이스들도 제공된다. 

|:---:|:---:|
| 함수형 인터페이스 | 메서드 |
|:---:|:---:|
| IntFunction<R>, LongFunction<R>, DoubleFunction<R> | R apply(int value), R apply(long value), R apply(double value) |
| ToIntFunction<T>, ToLongFunction<T>, ToDoubleFunction<T> | int applyAsInt(T t), long applyAsLong(T t), double applyAsDouble(T t) |

함수형 인터페이스의 이름을 살펴보면 어떤 기본 타입과 연관되어있는지 쉽게 알 수 있다. 이 밖에 IntToLongFunction, DoubleToIntFunction, ObjIntConsumer<T> 등의 함수형 인터페이스도 존재한다. 이들은 이름만 잘 살펴보면 쉽게 사용방법을 알 수 있다. 

마지막으로 컬렉션과 함께 사용할 수 있는 함수형 인터페이스도 있다.

|:---:|:---:|:---:|
| 인터페이스 | 메서드 | 설명 |
|:---:|:---:|:---:|
| Collection | boolean removeIf(Predicate<E> filter); | 조건에 맞는 엘리먼트를 삭제 |
| List | void replaceAll(UnaryOperator<E> operator); | 모든 엘리먼트에 operator를 적용하여 대체(replace) |
| Iterable | void forEach(Consumer<T> action); | 모든 엘리먼트에 action 수행 |


|:---:|:---:|:---:|
| 인터페이스 | 메서드 | 설명 |
|:---:|:---:|:---:|
| Map | V compute(K key, BiFunction<K, V, V> f); | 지정된 키에 해당하는 값에 f를 수행 |
| Map | V computeIfAbsent(K key, Function<K, V> f); |	지정된 키가 없으면 f 수행후 추가 |
| Map | V cumputeIfPresent(K key, BiFunction<K, V, V> f); |	지정된 키가 있을 때, f 수행 |
| Map | V merge(K key, V value, BiFunction<V, V, V> f); |	모든 엘리먼트에 Merge 작업 수행, 키에 해당하는 값이 있으면 f 수행해서 병합후 할당 |
| Map | void forEach(BiConsumer<K, V> action); | 모든 엘리먼트에 action 수행 |
| Map | void replaceAll(BiFunction<K, V, V> f); |	모든 엘리먼트에 f 수행후  대체 |

이 패키지에 정의된 함수형 인터페이스만 잘 써도 큰 어려움은 없을 것이다. 

## Function의 합성
함수형 언어의 재미있는 특성은 함수들을 합성할 수 있다는 것이다. 중학교 수업시간을 돌아보면, 학교 수학 시간에 함수의 합성에 대해서 들어본 적이 있을 것이다. f(x) 함수와 g(x) 함수가 있을 때, 이 두 함수를 연결하여 f(g(x)) 라는 합성 함수를 만들어 낼 수 있다. g(x)의 결과를 다시 f(x) 함수의 인자로 넣어주는 것이다. 

Function 인터페이스에는 이런 함수 합성을 지원하는 디폴트 메소드가 있다. 

|:---:|
| default <V> Function <T, V> andThen (Function <? super R, ? extends V> after); |
| default <V> Function <V, R> compose(Function <? super V, ? extends T> before); |
| static <T> Function<T, T> identity(); |

f.andThen(g) 를 수행하면 f 함수를 실행한 결과 값을 다시 g 함수의 인자로 전달하여 결과를 얻는 새로운 함수를 만들어 내게 된다. 이 때, f 함수의 리턴 타입이 g 함수의 파라미터 타입과 호환되어야 한다. 반대로 f.compose(g) 를 수행하면 g 함수를 먼저 적용하고 f를 나중에 적용하는 함수를 만들어 내게 된다. 마찬가지로 먼저 적용되는 함수의 리턴 타입과 나중에 적용되는 함수의 파라미터 타입이 맞아야 한다. 

identity() 메소드는  "항등함수"를 만들어 낼 때 사용된다. 항등함수는 잘 사용되는 편은 아니며 스트림의 map()으로 변환 작업할 때 변환 없이 그대로 처리할 때 사용된다.

## Predicate 결합
Predicate 함수형 인터페이스는 boolean 값을 리턴하는 함수를 다룬다. 따라서 여러개의 Predicate을 논리 연산자(&&, ||, !)를 이용해 연결해서 하나의 Predicate으로 얻어 낼 수도 있다. 이를 Predicate 결합이라고 한다.

Prediate을 결합할 때 사용하는 디폴트 메소드는 다음과 같다.

|:---:|
| default Predicate<T>    and (Predicate<? super T> other) ; |
| default Predicate<T>  or (Predicate<? super T> other); |
| default Predicate<T>  negate (); |
| static <T> Predicate<T> isEqual(Object targetRef); |

예를 들어서 

```java
  Predicate <Integer> greater = x -> x > 10;
  Predicate <Integer> less = x -> x < 20;
```

이런 Predicate 이 있을 때

```java
  Predicate between = greater.and(less);
```

이런 식으로 Predicate을 결합하면 10 < x < 20 인지를 판단하는 Predicate 함수를 얻어낼 수 있다. or() 메소드와 negate() 메소드도 비슷하게 사용하면 된다. 

isEqual() 메소드는 인자로 받은 객체와 같은지 판단해주는 새로운 함수를 만들어 준다. 예를 들어 

```java
  String nation = "korea"
  Predicate<String> checkKorea = Predicate.isEqual(nation);

  boolean isKorea = checkKorea.test(newNation);
```

isEqual() 메소드를 이용해서 만들어진 함수는 "korea"라는 문자열과 같은지 판단해주는 함수가 된다.

## 메소드 참조
익명 객체의 메서드를 간결하게 표현해 주는 람다를 더 간결하게 표현할 수 있다. 

```java
  Function<String, Integer> f = (String s) -> Integer.parseInt(s);
```

이런 람다의 경우 하나의 인자와 하나의 식으로 구성된 굉장히 간단한 형태다. 이런 메소드 호출의 경우 메소드 참조를 이용해서 다음과 같이 더욱 간결하게 줄일 수 있다.

```java
  Function<String, Integer> f = Integer :: parseInt;
```

람다식의 문법에서 많은 부분이 생략되었지만 자바 컴파일러는 함수형 인터페이스의 지네릭 타입으로부터 원래 형태의 람다를 유추해낼 수 있다. 따라서 소스코드를 더욱 간결하게 작성할 수 있게 된 것이다. 

두 개의 인자를 입력으로 받는 BiFunction의 경우를 생각해보자. 

```java
  BiFunction<String, String, Boolean> f = (s1 , s2) ->  s1.equals(s2);
```

이런 함수는 

```java
  BiFunction<String, String, Boolean> f = String::equals;
```

이렇게 간단히 바꿀 수 있다. 사용하다보면 손에 익게 되고 IDE 에서 더 간단하게 쓸 수 있다고 체크해주기도 한다.

마지막으로 이미 생성된 객체를 람다식에서 사용한 경우를 생각해보자.

```java
  Function<String, Boolean> f = x -> obj.equals(x);
```

위 람다식은

```java
  Function <String, Boolean> f = obj :: equals;
```
이렇게 줄여서 쓸 수 있다.

## 생성자의 메소드 참조
객체를 생성하는 생성자의 경우에도 메소드 참조로 변환할 수 있다. 앞에서 봤던 미리정의된 함수형 인터페이스인 Supplier를 사용하는 예제를 보자. 

```java
  Supplier <TestClass> s = () -> new TestClass();
```

Supplier 함수를 실행시키면 새로운 TestClass 객체를 만들어 리턴해준다. 이 람다는 다음과 같이 축약해서 사용할 수 있다. 

```java
  Supplier <TestClass> s = TestClass::new;
```

하나의 인자를 받는 생성자의 경우를 생각해보자. 다음 두 함수형 인터페이스는 동일하다. 

```java
  Function<Integer, TestClass> f = (i) -> new TestClass(i);
  Function<Integer, TestClass> f = TestClass::new;
```

두개의 인자를 받는 생성자의 경우도 마찬가지다. 

```java
  BiFunction<Integer, String, TestClass> bf = (i, s) -> new TestClass(i, s);
  BiFunction<Integer, String, TestClass> bf = TestClass::new;
```

배열을 생성할 때를 생각해보자. 다음 두 코드는 동일하다. 

```java
  Function<Integer, int[]> f = x-> new int[x];
  Function<Integer, int[]> f = int[] :: new;
```

자바가 람다와 함수형 인터페이스를 지원하면서 함수형 프로그래밍을 어느정도 지원하기 시작했다. 물론 동일한 동작을 하는 코드를 전통적인 방법으로 작성할 수도 있다. 하지만 람다의 간결함을 이용하여 좀 더 유지보수하기 좋은 코드를 작성하는 것도 의미 있다.

## 변수 범위
자바에서 람다를 사용할 때 변수의 범위(scope)와 관련해서 알아둬야 할 것들이 있다. 다음 코드를 살펴보자. 

```java
  import java.util.function.Function;

  public class Example {
      public static Function<String, String> getFunction(String str) {
          return (x) -> x.concat(str);
      }

      public static void main(String []args) {
          Function<String, String> getConcat = getFunction("_suffix");
          System.out.println(getConcat.apply("name"));
      }
  }

```

getDouble()이라는 메소드를 실행하면 인자로 준 문자열을 뒤에다 붙여주는 람다를 리턴해준다. main 메소드를 실행시켜보면 다음 결과를 얻을 수 있다.

#### name_suffix
만약 getFunction 함수내에서 str 변수를 수정하려고 하면 "Variable used in lambda expression should be final or effectively final" 라는 에러를 발생시킨다.
람다 정의에서 파라미터로 받은 대상이 아닌 외부 변수를 참조하는 경우, 외부 변수는 final 이거나 'effectively final' 이어야 한다는 의미다. 즉, final로 선언되어 변하지 않음이 보장되어야 람다 내부에서 사용할 수 있다는 의미다.

#### effectively final
오라클 문서에 'effectively final'은 다음과 같이 정의되어 있다. 

> "A variable or parameter whose value is never changed after it is initialized is effectively final"

final 키워드를 붙여서 선언하지는 않았지만 초기화 된 이후로 값의 할당이 변경되지 않는 변수를 'effectively final'이라고 하는 모양이다. 키워드를 붙이지 않아도 코드 패스에서 변하지 않는 변수는 자바 컴파일러가 final로 간주하여  람다 내부에서 쓸 수 있게 허용하는 모양.

#### 변수의 섀도잉 (Variable Shadowing) 
https://en.wikipedia.org/wiki/Variable_shadowing

다음 코드를 살펴보자. 

```java
  public static class Example {
      int number = 10;

      public Supplier<Integer> getFunction1() {
            return () -> number * 10; 
      }

      public Supplier<Integer> getFunction2(int number) {
            return () -> number * 10;
      }

      public Supplier<Integer> getFunction3() {
            int number = 20;
            return () -> number * 10;
      }
  }
```

getFunction1()로 얻어진 함수는 100을 리턴하고, getFunction2()는 인자로 주어진 값에 10을 곱한 값, getFunction3()은 200을 리턴한다. 각 메소드에서 리턴하는 함수가 참조하는 number 변수는 마찬가지로 effectively final 이어야 한다.

#### this 키워드 
람다의 몸통에서 this 키워드를 사용하는 경우를 생각해보자. 

```java
  public class Example {
      private String name = "Dave";

      public Supplier<String> getNameFunction() {
            return () -> this.name;
      }
  }
```

getNameFunction() 메소드로 얻어진 함수는 "Dave"라는 문자열을 리턴한다. 그렇다면 다음 코드는 어떨까?

```java
  public class Example {
  private String name = "Dave";

      public Supplier<String> getNameFunction() {

          Supplier<String> getNamer = new Supplier<String>() {

              @Override
              public String get() {
                  return this.name;
              }
          };
          return getNamer;
      }
  }
```

이 코드는 컴파일 에러가 발생한다. this.name 이라는 변수를 찾을 수 없기 때문이다. 람다만의 특징은 아니지만 함수형 인터페이스를 사용할 때 자주 볼 수 있는 패턴이기 때문에 설명하고 넘어가자.

컴파일 에러를 해결하기 위해서는 this.name을 Example.this.name으로 바꿔야 한다.

```java
  public class Example {
    private String name = "Dave";

        public Supplier<String> getNameFunction() {
            Supplier<String> getNamer = new Supplier<String>() {
              
                @Override
                public String get() {
                    return Example.this.name;
                }
            };
            return getNamer;
        }
  }
```

Supplier<String> 함수를 구현한 익명 클래스에서의 this는 익명 클래스 자체를 의미하기 때문에 name이라는 멤버가 존재하지 않는 것이다. 익명 클래스가 정의된 클래스의 멤버를 접근하려면 Example.this 처럼 클래스 이름을 주고, 그 뒤에 this를 붙여줘야 한다.


# 사용예제
## ■ 자바의 람다식
- ✓ 람다식(lambda)
  - 자바에서는 함수를 메서드라고 부르고 메서드의 형태로 존재
  - 자바 람다식의 구조

   . (argument) -> { body } 구문을 사용하여 작성

- 자바의 람다식 구조
  - ＠매개변수 리스트
    - 함수에 전달되는 매개변수들이 나열
    - 매개변수를 생략하면 컴파일러가 추론 기능을 이용하여 알아서 처리
    - 매개변수가 하나인 경우 괄호를 생략 가능

  - @애로우 토큰
    - 매개변수 리스트와 함수 코드를 분리시키는 역할
    - "->" 기호: 매개변수들을 전달하여 함수 바디 { }에 작성된 코드를 실행

  - @함수 바디
    - 함수의 코드
    - 중괄호 ({ })로 둘러싸는 것이 일반적이지만, 한 문장인 경우 중괄호({ })를 생략 가능
    - 한 문장이더라도 return 문이 있으면 반드시 중괄호로 둘러싸야함


- 자바에서 람다식은 함수형 인터페이스에 선언된 추상 메서드를 구현하는 방식으로 작성
- 함수형 인터페이스(functional interface) 작성

   . 추상 메서드 하나만 있는 인터페이스
```java   
  @FunctionalInterface
  interface MyFunction { // 함수형 인터페이스
      int calc(int x, int y); // 추상 메소드
  }
```

- @FunctionalInterface
  컴파일러에게 함수형 인터페이스임을 알리는 annotation
 => 컴파일러에게 인터페이스가 추상 메서드가 1개만 있는 함수형 인터페이스인지 확인하도록 하여,
      처음부터 잘못된 인터페이스 작성을 막는 장점

###### 인자 x, y를 받아들여 x+y를 리턴하는 람다식 만들기
```java   
  package practice;
  
  //인자 x, y를 받아들여 x+y를 리턴하는 람다식 만들기
  //함수형 인터페이스
  @FunctionalInterface
  interface MyFunction {
      int calc(int x, int y);
  }
  
  public class LambdaEx {
      public LambdaEx() {
          MyFunction f1 = (x, y) -> {return x+y;};
          System.out.println("f1의 결과: " + f1.calc(22, 100));
          
          MyFunction f2 = (x, y) -> {return x-y;};
          System.out.println("f2의 결과: " + f2.calc(99, 9));
      }
      public static void main(String[] args) {
          new LambdaEx();
      }
  }
```

###### 인자 x를 받아들여 제곱을 리턴하는 람다식 만들기
```java
  package practice;
  
  //인자 x를 받아들여 제곱을 리턴하는 람다식 만들기
  //함수형 인터페이스
  @FunctionalInterface
  interface Myfunction2 {
      int calc(int x);
  }

  public class LambdaEx2 {   
      public LambdaEx2() {
          Myfunction2 fsquare = (x) -> {return x*x;};
          System.out.println("fsquare의 결과: "+fsquare.calc(5));
      }

      public static void main(String[] args) {
          new LambdaEx2();
      }
  }
```   

###### 매개변수가 없는 람다식 만들기
```java
  package practice;

  //매개변수가 없는 람다식 만들기
  //함수형 인터페이스
  @FunctionalInterface
  interface MyFunction3 {
      void print();
  }
  public class LambdaEx3 {
      public LambdaEx3() {
          MyFunction3 fprint = () -> {System.out.println("Yoon's Dev");};
          fprint.print();
      }
      public static void main(String[] args) {
          new LambdaEx3();
      }
  }
```  

###### 메서드의 인자로 람다식 전달
```java
  package practice;
  
  //메소드의 인자로 람다식 전달
  //함수형 인터페이스
  @FunctionalInterface
  interface MyFunction4 {
      int calc(int x, int y);
  }
  
  public class LambdaEx4 {
      //메소드 정의 (메소드의 인자로 람다식 전달)
      static void printMultiply(int x, int y, MyFunction4 f) {
          System.out.println("실행 결과: " + f.calc(x, y));
      }
      public LambdaEx4() {
          printMultiply(100, 100, (x, y) -> {return x * y;});
      }
      public static void main(String[] args) {
          new LambdaEx4();
      }
  }
```

###### 제네릭을 이용한 함수형 인터페이스
```java   
  package practice;
  
  //제네릭을 이용한 함수형 인터페이스
  @FunctionalInterface
  interface MyFunction5<T>{
    void println(T x);
  }
  
  public class lambdaEx5 {
      public lambdaEx5() {
        MyFunction5<String> f1 = x -> {System.out.println(x.toString());};
        f1.println("String Generic 사용 람다식");
        f1.println("Yoon's Dev");
          
        MyFunction5<Integer> f2 = x -> {System.out.println(x.toString());};
        f2.println(Integer.valueOf(100));
      }

      public static void main(String[] args) {
        new lambdaEx5();
      }
  }
```
 
---
layout: single
title:  "[Lecture] - Docker 및 GIT 정리"
excerpt: "Docker의 기본개념 및 git 정리"

categories:
  - Lecture
tags:
  - [Lecture, Java, Servlet]

toc: true
toc_sticky: true
 
date: 2022-03-05
last_modified_at: 2022-03-05
---
# Git

## Git이란?
- git 은 소스 코드 버전 관리 시스템으로 로컬에서 변경 사항을 추적하고 원격 리소스에서 변경 사항을 푸시하거나 가져올 수 있다.

## GitHub란?
- Github는 공개적으로 사용 가능한 무료 서비스로 모든 코드를 공개해야 함
- EveryBody! 푸시한 코드를 보고 개선을 위한 제안 제공, 오픈소스 역할
- Github는 수만 개의 오픈 소스 프로젝트를 위한 소스 코드를 호스팅

## GitLab 이란?
- Gitlab은 개인 또는 조직이 Git repository 의 내부 관리를 제공하는데 상용할 수 있는 Github, 즉 비공개된 Github

## GitLab 의 사용 이유?
- GitLab은 중앙 서버에서 Git 저장소를 관리하는 좋은 방법
- GitLab은 리포지토리 또는 프로젝트를 완벽하게 제어 할 수 있으며, 공개 또는 비공개 여부를 무료로 결정가능

## GitLab과 GitHub, 실무에서의 차이?

![GitLab과 GitHub](./../../images/lecture/gitlab_vs_github.png)

## 구축
- GitHub, GitLab 라이센스마다 가격 및 기능이 다양.
- GitHub의 경우 기본적으로 SaaS 형태로 제공, 유저당 월 $21 비용이 드는 Enterprise를 선택하셔야만 설치 버전 사용가능.
- GitLab의 경우에는 모든 Tier에서 SaaS형, 설치형을 선택적으로 사용가능.

## 지원 서비스
GitLab과 GitHub 모두 라이센스에 따라 받으실 수 있는 지원이 옵션이 다양.

![GitHub지원 서비스](./../../images/lecture/github_service.png)


- GitHub의 경우 티켓 발행과 전화 모두 영어로만 가능.
- GitLab은 한국어, 영어를 포함한 7개의 언어로 티켓 발행이 가능.

## 실무 워크플로우
- GitLab과 GitHub 모두 Git Repository를 중심으로 개발 업무를 진행하는 것은 동일
- GitLab의 경우 개발 영역뿐만 아니라 모든 라이프사이클을 커버하기 때문에 GitHub보다 많은 편의를 제공.
- 관리부터 이슈를 트래킹하고 결국에는 모니터링과 보호까지 GitLab으로 가능.
- 프로젝트 산출물에 재사용성을 높여 기업의 자산 및 부가가치를 만드는데 기여.
- 완전한 CI/CD를 통한 DevOps 환경을 구축가능.
  >  - CI/CD는 애플리케이션 개발 단계를 자동화하여 애플리케이션을 보다 짧은 주기로 고객에게 제공하는 방법
  >  - CI/CD의 기본 개념은 지속적인 통합, 지속적인 서비스 제공, 지속적인 배포
  >  - CI/CD는 새로운 코드 통합으로 인해 개발 및 운영팀에 발생하는 문제(일명 "인테그레이션 헬(integration hell)")을 해결하기 위한 솔루션
  > - CI/CD는 애플리케이션의 통합 및 테스트 단계에서부터 제공 및 배포에 이르는 애플리케이션의 라이프사이클 전체에 걸쳐 지속적인 자동화와 지속적인 모니터링을 제공. 

![GitHub-Gitlab CI/CD Comparison](./../../images/lecture/github_comparison.png)

- GitLab의 경우 CI/CD의 많은 부분을 커버하는 것은 물론 컨테이너 레지스트리에서도 차이를 나타내고 있다.
- 컨테이너 레지스트리는 쿠버네티스, DevOps, 컨테이너 기반 애플리케이션 개발을 위한 컨테이너 이미지를 저장하는 데 사용되는 리포지토리 또는 리포지토리 컬렉션이다.
- 컨테이너 이미지는 컨테이너(애플리케이션을 구성하는 파일 및 구성 요소를 담은 컨테이너)의 사본으로서, 이 이미지를 복사해 빠르게 스케일 아웃하거나 필요에 따라 다른 시스템으로 이동할 수 있다. 생성된 컨테이너 이미지는 일종의 템플릿이 되며, 새로운 애플리케이션을 만들거나 기존 애프리케이션을 확대 및 확장할 때 이 템플릿을 사용할 수 있다.

## Git 사용이유
- 개발을 하다 보면 어떤 기능을 빼고 더하고 등 수정하는 과정은 필수.
- 이전의 기능을 다시 되돌리고 싶을 때도 있고 만들어둔 기능이 없던 전 버전으로
되돌리고 싶을 때 등의 경우를 위해 기능의 추가와 같이 save등의 기능요구.
- git은 내 코드 혹은 다른 개발자의 코드가 변경된 이력을 쉽게 확인할 수 있고, 특정 시점에 저장된 버전과 비교할 수 있으며 특정 시점으로 복원가능.

## Git 이용시 협업을 통한 생산성향상
- 여러 명의 개발자가 역할을 나눠 동시작업이 필요한 프로젝트 진행 시 해당 프로젝트를 테스트해보고 싶다면 각자 맡았던 파일들을 하나의 폴더에 모아야 하는데 git을 사용한다면 내 코드와 다른 사람의 코드를 합치는 게 쉽고 내 코드와 다른 사람의 코드가 충돌한다면 코드들을 합칠 수 없도록 경고 메시지를 통해 어떤 부분에서 충돌이 났는지 고지.

## git은 원격 저장소와 로컬 저장소 두 종류의 저장소를 제공.
- 원격 저장소(Remote Repository): 파일이 원격 저장소 전용 서버에서 관리되며 여러 사람이 함께 공유하기 위한 저장소.
- 로컬 저장소(Local Repository): 내 PC에 파일이 저장되는 개인 전용 저장소.

- 작업은 보통 내 PC의 로컬 저장소에서 진행. 작업이 끝나면 혹은 작업 내용을 공유하고 싶다면 로컬에 있는 작업 내용을 원격 저장소에 업로드. 혹은 원격 저장소에 있는 다른 개발자의 작업 내용 또한 취득가능.

- 협업을 할시에는 원격 저장소에 있는 대표 프로젝트 파일을 모든 개발자가 개인의 로컬에 가져온 뒤 각자 맡은 기능 개발을 진행. 마찬가지로 작업이 끝나면 혹은 작업 내용을 공유할 때 원격 저장소에서 각자의 코드들을 업로드.

## 내 컴퓨터에 로컬 저장소를 만드는 두 가지 방법.
### 1. 첫번째 방법은 저장소를 새로 만들어서 사용.

> git init
>
> Start a new git repository

### 2. 다른 하나는 원격 저장소를 복제하는 방법.
- GitHub(혹은 GitLab, Bitbucket 등)를 이용 원하는 프로젝트를 Fork 및 Clone으로 내 로컬로 가져올 수 있음.

> 원격 저장소를 복제하면 내 컴퓨터에 해당 저장소의 로컬 버전이 생성되어 원래 코드베이스에 영향을 주지 않고 내 컴퓨터에서 개발을 진행가능.

![git local_remote](./../../images/lecture/git_pull.png)

- 원격 저장소를 복제하는 방법은 추가로 개발한 내용을 원격 저장소에 업로드할 수 있고 반대로 원격 저장소 즉, 원본에 내용이 추가 및 삭제로 변경된다면 원본에 해당하는 내용을 가져올 수 있어 효율적으로 개발을 진행할 수 있고 이는 협업에서도 매우 큰 장점으로 작용합니다.

### git push git pull

![git process](./../../images/lecture/git_image.png)

- git clone '저장소url' : 해당 url의 원격저장소를 clone하여 local 환경에 추가.
- git remote add '저장소별칭 저장소url' : 로컬 저장소와 원격 저장소를 연결합니다.
- git remote -v : 원격 저장소와의 연결 상태를 확인합니다. 연결된 저장소들의 별칭과 url을 확인.
- git pull '원격저장소별칭 로컬브랜치' : 원격저장소를 로컬 브랜치로 가져와 병합.
- git push '원격저장소별칭 로컬브랜치' : 지정한 로컬 브랜치를 원격 저장소로 push.

> working directory 혹은 working tree는 말 그대로 개발을 진행하는 폴더라는 개념입니다.

- git의 커밋 작업은 작업 저장소(working directory)에 있는 변경 내용을 저장소에 바로 기록하지 않음.
- staging area 혹은 Index라는 가상의 공간에 기록하고자 하는 변경사항을 git add 명령어를 통해 추가해야만 가능. 이러한 작업을 스테이징-stage라고 표현.
- 가상의 공간에 추가해준 변경 사항들만이 commit을 통해 추가가 가능.

> 반대로 원하지 않는 변경 사항들은 제외하고 commit 가능.

- git status : 저장소의 상태 확인.
- git add <파일> : 해당 파일을 staging area에 추가.
- git add . 을 사용하면 수정한 모든 file 을 추가.
- git commit -m '커밋 메시지' : staging area에서 local repo로 최종적으로 짧은 메시지를 포함해 저장.
- 커밋(commit)을 하게 되면 이전 커밋 상태부터 현재 상태까지의 변경 이력이 기론된 커밋이력이 생성.
- 커밋은 시간순으로 차례대로 저장되기 때문에 과거 변경 이력과 내용을 파악가능.
- 영문과 숫자로 이루어진 40자리의 해당 고유의 이름으로 각 커밋을 구분.

```
git config --global user.name "m2mkwt"
git config --global user.email "wontae_k@m2mglobal.co.kr"

//로컬 깃 저장소 생성(.git 폴더 생성)
$ git init

//Working directory -> Staging Area
$ git add [directory]
$ git add .

//Staging Area -> repository(.git)
$ git commit -m "commit message"

//원격저장소와 연결
$ git remote add origin [원격저장소 주소]
$ git remote add origin https://github.com/m2mkwt/spring-mvc-demo.git

//브랜치 명 바꾸기
$ git branch -M [branch name(main)]
$ git branch -m [현재 branch name] [바꾸고싶은 branch name]

//(선택) README.md가 있다면 : push 보다 pull 먼저
$ git pull origin [branch name(main)]

//로컬 레포지토리 -> 원격 레포지토리
$ git push -u origin [branch name(main)]

//파일 수정 및 추가 이후 : 다음번 commit & push
$ git pull origin [branch name] (선택:다른 장소에서 작업한게 없으면 안해도 됨)
$ git add [directory]
$ git commit -m "commit message"
$ git push -u origin [branch name]
```
---
layout: single
title:  "[WEB] - Gitlab과 Github"
excerpt: "Gitlab 과 Github 비교"

categories:
  - web-4
tags:
  - [Gitlab, Github]

toc: false
toc_sticky: false
 
date: 2022-08-26
last_modified_at: 2022-08-26
---
# Git

## Git이란?
- git 은 소스 코드 버전 관리 시스템으로 로컬에서 변경 사항을 추적하고 원격 리소스에서 변경 사항을 푸시하거나 가져올 수 있다.

## Git 사용이유
- 개발을 하다 보면 어떤 기능을 빼고 더하고 등 수정하는 과정은 필수.
- 이전의 기능을 다시 되돌리고 싶을 때도 있고 만들어둔 기능이 없던 전 버전으로
되돌리고 싶을 때 등의 경우를 위해 기능의 추가와 같이 save등의 기능요구.
- git은 내 코드 혹은 다른 개발자의 코드가 변경된 이력을 쉽게 확인할 수 있고, 특정 시점에 저장된 버전과 비교할 수 있으며 특정 시점으로 복원가능.

## Git 이용시 협업을 통한 생산성향상
- 내 코드와 다른 사람의 코드를 합치는 게 쉽고 내 코드와 다른 사람의 코드가 충돌한다면 코드들을 합칠 수 없도록 경고 메시지를 통해 어떤 부분에서 충돌이 났는지 고지.
- 커밋 이력 및 merge request를 통한 소스품질관리 가능

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
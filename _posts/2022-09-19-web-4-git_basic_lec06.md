---
layout: single
title:  "[GIT] - GIT 교육자료 6"
excerpt: "GitFlow"

categories:
  - web-4
tags:
  - [GIT]

toc: false
toc_sticky: false
 
date: 2022-09-19
last_modified_at: 2022-09-19
---
# GitFlow
- git을 효과적으로 사용하기 위한 git 브랜치전략
- 브랜치전략
  - 다수 개발자가 하나의 저장소를 사용하는 환경에서 저장소를 효과적으로 활용하기 위한 work-flow.
  - 브랜치의 생성, 삭제, 병합 등 git의 유연한 구조를 활용 각 개발자들의 혼란을 최대한 줄이며 다양한 방식으로 소스를 관리하는 역할.
  - 즉, **브랜치 생성에 규칙을 만들어 협업을 유연하게 하는 방법론**.

![gitflow](./../../images/sr_web/66ee6852-7375-48ff-b81a-a83ba8f27cf3.png)

## GitFlow 의 구성
GitFlow 는 아래와 같은 branch 들로 구성되어 있습니다.

- master  : 기준이 되는 브랜치로 제품을 배포하는 브랜치. 
- develop : 개발 브랜치로 개발자들이 이 브랜치를 기준으로 각자 작업한 기능들을 Merge. 
- feature : 단위 기능을 개발하는 브랜치로 기능 개발이 완료되면 develop 브랜치에 Merge.
- release : 배포를 위해 master 브랜치로 보내기 전에 먼저 QA(품질검사)를 하기위한 브랜치. 
- hotfix  : master 브랜치로 배포를 했는데 버그가 생겼을 떄 긴급 수정하는 브랜치.

**branch 를 merge 할 때는 항상 --no-ff 옵션을 붙여서 branch 에 대한 기록이 사라지는 것을 방지하는 것을 원칙으로 합니다.**

![gitflow](./../../images/sr_web/b23e620b-ea65-443d-a25c-690c4b2747d7 (1).png)

> 처음에는 master와 develop 브랜치가 존재합니다. 물론 develop 브랜치는 
> master에서부터 시작된 브랜치입니다. develop 브랜치에서는 상시로 버그를 수정한 
> 커밋들이 추가됩니다. 새로운 기능 추가 작업이 있는 경우 develop 브랜치에서 
> feature 브랜치를 생성합니다. feature 브랜치는 언제나 develop 브랜치에서부터 
> 시작하게 됩니다. 기능 추가 작업이 완료되었다면 feature 브랜치는 develop 브랜치로 merge 됩니다.
> develop에 이번 버전에 포함되는 모든 기능이 merge 되었다면 QA를 하기 위해 develop 
> 브랜치에서부터 release 브랜치를 생성합니다. QA를 진행하면서 발생한 버그들은 release 브랜치에
> 수정됩니다. QA를 무사히 통과했다면 release 브랜치를 master와 develop 브랜치로 merge 합니다.
> 마지막으로 출시된 master 브랜치에서 버전 태그를 추가합니다.

### branches - develop / master
- GitFlow 는 develop 과 master 를 나누는 아이디어가 가장 핵심. 
- 다른 version 관리 방식과의 차별점.
- 나머지 feature, release, hotfix branches 는 develop 과 master 를 나눈 결정에 따라 자연스럽게 발생.

- master : 현재 production 의 상태와 일치하는 branch.
- develop : 현재 개발이 완료된 상태와 일치하는 branch.

### branches - feature
- develop 을 현재 개발 완료 상태와 일치시키면서도 협업 중 다른 동료와 conflict 가 생기지 않도록 작업하기 위해 feature branches 를 이용.

- develop 에서 feature branch 를 생성해서 새로운 작업을 시작.
  - ex. feature/ISSUE-101
  - feature branch 에서 작업이 끝나면 최신 develop 에 merge, merge 후에는 해당 브랜치 삭제.

### fork 와 Pull Request

![gitflow](./../../images/sr_web/one_of_the_git_flow.png)

- “fork”를 통해 타인의 원본 레포지토리를 가져와 내 레포지토리에 생성.
  - Fork : 타인 소유의(또는 공동 소유의) 프로젝트 소스와 commit 내역, branch 등 원본 Remote Repository의 구조를 그대로 복사하여 내 소유의 새로운 Remote Repository로 생성하는 기능

- “clone”을 통해 fork한 내 레포지토리를 로컬에 뵥제.
- 로컬에서 작업 후 “add” -> “commit” -> “push”를 통해 내 레포지토리에 작업내용을 반영.
- “Pull Request”를 통해 내 작업내용을 원본 레포지토리에 반영해달라고 요청.
  - Pull Request : 내가 수정한 Commit들을 원본 Repository에 반영(Pull)해줄 것을 요청(Request)하는 작업

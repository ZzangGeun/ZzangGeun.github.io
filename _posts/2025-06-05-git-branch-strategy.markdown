---
layout: post
title: "Git 브랜치 전략: Git Flow vs GitHub Flow"
date: 2025-06-05 14:30:00 +0900
categories: git development
---

팀 프로젝트에서 효율적인 Git 브랜치 관리는 매우 중요합니다. 오늘은 대표적인 두 가지 브랜치 전략을 비교해보겠습니다.

## Git Flow

Git Flow는 복잡한 프로젝트에 적합한 브랜치 전략입니다.

### 주요 브랜치

- **master**: 배포 가능한 상태의 코드
- **develop**: 개발 중인 코드의 통합 브랜치  
- **feature**: 새로운 기능 개발
- **release**: 배포 준비
- **hotfix**: 긴급 버그 수정

```bash
# feature 브랜치 생성
git checkout -b feature/new-login develop

# 개발 완료 후 develop에 병합
git checkout develop
git merge feature/new-login
```

## GitHub Flow

GitHub Flow는 단순하고 지속적인 배포에 적합합니다.

### 작업 흐름

1. **master**에서 브랜치 생성
2. 변경사항 커밋
3. Pull Request 생성
4. 코드 리뷰 및 논의
5. **master**에 병합 후 즉시 배포

```bash
# 새 브랜치 생성
git checkout -b fix-header-bug

# 변경사항 커밋
git add .
git commit -m "Fix header responsive issue"

# 원격 저장소에 푸시
git push origin fix-header-bug
```

## 어떤 전략을 선택할까?

| 프로젝트 특성 | 추천 전략 |
|-------------|----------|
| 정기적 릴리즈 | Git Flow |
| 지속적 배포 | GitHub Flow |
| 소규모 팀 | GitHub Flow |
| 대규모 팀 | Git Flow |

팀의 규모와 프로젝트 특성에 맞는 브랜치 전략을 선택하는 것이 중요합니다!

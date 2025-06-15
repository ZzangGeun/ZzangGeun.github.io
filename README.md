# ZzangGeun's Blog 🚀

Velog 스타일의 깔끔한 다크 테마 Jekyll 블로그입니다.

## ✨ 주요 기능

- **📝 마크다운 지원**: 코드 블록, LaTeX 수식 렌더링
- **🏷️ 태그 시스템**: 홈페이지에서 태그별 포스트 필터링
- **📚 시리즈 기능**: 연관된 포스트들을 시리즈로 그룹핑
- **📋 코드 복사**: 코드 블록에 원클릭 복사 버튼
- **📱 반응형 디자인**: 모바일 친화적 레이아웃

## 🛠️ 기술 스택

- **Jekyll**: 정적 사이트 생성기
- **MathJax**: LaTeX 수식 렌더링
- **SCSS**: 모듈화된 스타일 시스템
- **JavaScript**: 인터랙티브 기능 (ES6+ 클래스 기반)

## 📁 프로젝트 구조

```
├── _config.yml           # Jekyll 설정
├── _includes/            # 재사용 가능한 HTML 컴포넌트
├── _layouts/             # 페이지 레이아웃
├── _posts/               # 블로그 포스트 (Markdown)
├── _sass/                # 모듈화된 SCSS 파일들
│   ├── custom.scss       # 메인 스타일 파일
│   ├── _base.scss        # 기본 변수 및 레이아웃
│   ├── _code.scss        # 코드 블록 스타일
│   ├── _post.scss        # 포스트 페이지 스타일
│   ├── _home.scss        # 홈페이지 스타일
│   ├── _tags.scss        # 태그 시스템 스타일
│   ├── _series.scss      # 시리즈 페이지 스타일
│   ├── _toc.scss         # 목차 스타일
│   └── _responsive.scss  # 반응형 디자인
├── assets/
│   ├── main.scss         # SCSS 진입점
│   └── js/               # JavaScript 모듈들
│       ├── main.js       # 메인 앱 관리
│       ├── tag-filter.js # 태그 필터링
│       ├── toc.js        # 목차 생성
│       └── code-copy.js  # 코드 복사 기능
└── series.html           # 시리즈 목록 페이지
```

## 🚀 로컬 실행

```bash
# 의존성 설치
bundle install

# 개발 서버 실행
bundle exec jekyll serve

# 브라우저에서 http://localhost:4000 접속
```

## ✍️ 포스트 작성 가이드

### 1. 새 포스트 생성
`_posts` 폴더에 `YYYY-MM-DD-title.md` 형식으로 파일 생성

### 2. Front Matter 설정
```yaml
---
layout: post
title: "포스트 제목"
date: 2025-06-15 12:00:00 +0900
series: "시리즈명"    # 선택사항
tag: "태그명"         # 단일 태그
---
```

### 3. 지원되는 기능
- **코드 블록**: ```언어명 으로 시작
- **LaTeX 수식**: `$수식$` (인라인) 또는 `$$수식$$` (블록)
- **이미지**: `![설명](경로)`
- **링크**: `[텍스트](URL)`

## 🔧 커스터마이징

### 색상 변경
`_sass/_base.scss`의 CSS 변수를 수정:
```scss
:root {
  --velog-primary: #20c997;  // 브랜드 컬러
  --velog-bg: #181a1b;       // 배경색
  // ...
}
```

### 새 기능 추가
1. `assets/js/`에 새 JavaScript 모듈 생성
2. `_includes/head.html`에 스크립트 태그 추가
3. `_sass/`에 새 SCSS 파일 생성 (필요시)
4. `_sass/custom.scss`에 import 추가

## 📄 라이선스

MIT License - 자유롭게 사용하세요!

---
💡 **팁**: 개발 중에는 `bundle exec jekyll serve --livereload`로 실시간 새로고침을 활용하세요!

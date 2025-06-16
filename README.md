# ZzangGeun's Blog 🚀

모듈화되고 유지보수하기 쉬운 Velog 스타일 Jekyll 블로그입니다.

## ✨ 주요 기능

- **📝 마크다운 지원**: 코드 블록, LaTeX 수식 렌더링
- **🏷️ 태그 시스템**: 홈페이지에서 태그별 포스트 필터링
- **📚 시리즈 기능**: 연관된 포스트들을 시리즈로 그룹핑
- **📋 코드 복사**: 코드 블록에 원클릭 복사 버튼
- **📱 반응형 디자인**: 모바일 친화적 레이아웃
- **🎨 다크 테마**: Velog 스타일의 깔끔한 다크 테마
- **🔧 모듈화**: 유지보수하기 쉬운 모듈식 구조

## 🛠️ 기술 스택

- **Jekyll**: 정적 사이트 생성기
- **SCSS**: 모듈화된 스타일 시스템
- **JavaScript**: 인터랙티브 기능 (ES6+)
- **GitHub Pages**: 호스팅

## 📁 프로젝트 구조

```
├── _config.yml           # Jekyll 설정
├── _includes/            # 재사용 가능한 HTML 컴포넌트
│   ├── head.html         # HTML head (깔끔하게 정리됨)
│   ├── post-header.html  # 포스트 헤더 컴포넌트
│   ├── post-footer.html  # 포스트 하단 컴포넌트
│   ├── tags-sidebar.html # 태그 사이드바 컴포넌트
│   ├── post-list.html    # 포스트 목록 컴포넌트
│   └── toc.html          # 목차 컴포넌트
├── _layouts/             # 페이지 레이아웃
│   ├── default.html      # 기본 레이아웃
│   ├── home.html         # 홈페이지 (모듈화됨)
│   └── post.html         # 포스트 페이지 (모듈화됨)
├── _posts/               # 블로그 포스트 (Markdown)
├── _sass/                # 모듈화된 SCSS 파일들
│   ├── custom.scss       # 메인 스타일 파일
│   ├── _base.scss        # 통일된 색상 시스템 및 기본 스타일
│   ├── _header.scss      # 헤더 스타일
│   ├── _footer.scss      # 푸터 스타일
│   ├── _home-layout.scss # 홈페이지 레이아웃
│   ├── _post-layout.scss # 포스트 레이아웃
│   ├── _tags.scss        # 태그 관련 스타일
│   ├── _toc.scss         # 목차 스타일
│   ├── _code.scss        # 코드 블록 스타일
│   └── _series.scss      # 시리즈 스타일
└── assets/js/            # JavaScript 파일들
    ├── main.js          # 메인 JavaScript (통합 관리)
    ├── toc.js           # 목차 생성 및 네비게이션
    ├── code-copy.js     # 코드 복사 기능 (중복 방지)
    └── tag-filter.js    # 태그 필터링 기능
    ├── code-copy.js     # 코드 복사 기능 (간소화됨)
    ├── tag-filter.js    # 태그 필터링
    └── main.js          # 메인 유틸리티 (예비용)
```

## 🔧 모듈화 개선사항

### 스타일 시스템
- **통일된 색상 변수**: `_base.scss`에서 중앙 관리
- **기능별 모듈 분리**: 각 컴포넌트별로 SCSS 파일 분리
- **중복 제거**: head.html에서 인라인 CSS 제거

### HTML 컴포넌트
- **include 모듈화**: 재사용 가능한 컴포넌트로 분리
- **태그 로직**: 복잡한 태그 처리 로직을 별도 include로 분리
- **포스트 구조**: 헤더, 내용, 푸터로 명확히 분리

### JavaScript
- **기능별 분리**: TOC, 코드 복사, 태그 필터를 각각 별도 파일로 관리
- **간소화**: 불필요한 복잡성 제거
- **성능 최적화**: 효율적인 DOM 조작

## 🚀 사용법

1. **로컬 개발**:
   ```bash
   bundle install
   bundle exec jekyll serve
   ```

2. **새 포스트 작성**:
   - `_posts/` 폴더에 `YYYY-MM-DD-제목.md` 형식으로 파일 생성
   - Front matter에 태그, 시리즈 등 메타데이터 추가

3. **스타일 수정**:
   - `_sass/` 폴더의 해당 모듈 파일 수정
   - 색상 변경 시 `_base.scss`의 CSS 변수 수정

## 🎨 색상 시스템

모든 색상은 `_base.scss`에서 CSS 변수로 관리됩니다:

```scss
:root {
  --bg-color: #121212;        // 배경색
  --surface-color: #1e1e1e;   // 카드 배경
  --primary-color: #20c997;   // 브랜드 컬러
  --text-color: #e9ecef;      // 주요 텍스트
  --text-secondary: #adb5bd;  // 보조 텍스트
  --border-color: #343a40;    // 테두리
  --hover-color: #2d3748;     // 호버 효과
}
```
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

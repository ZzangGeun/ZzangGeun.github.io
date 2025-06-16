# 🚀 ZzangGeun 블로그 설정 가이드

## 📋 현재 프로젝트 상태

✅ **완료된 모듈화 작업:**
- SCSS 파일들이 기능별로 모듈화됨
- JavaScript 기능들이 개별 파일로 분리됨
- HTML 레이아웃들이 include로 모듈화됨
- 코드 복사 기능 개선 (중복 방지)
- 반응형 디자인 적용
- 색상 시스템 통일

## 🏗️ 프로젝트 구조

```
ZzangGeun.github.io/
├── _sass/                    # 모듈화된 스타일
│   ├── _base.scss           # 기본 변수 및 색상
│   ├── _header.scss         # 헤더 스타일
│   ├── _footer.scss         # 푸터 스타일
│   ├── _home-layout.scss    # 홈페이지 레이아웃
│   ├── _post-layout.scss    # 포스트 레이아웃
│   ├── _tags.scss           # 태그 스타일
│   ├── _toc.scss            # 목차 스타일
│   ├── _code.scss           # 코드 블록 스타일
│   ├── _series.scss         # 시리즈 스타일
│   └── custom.scss          # 메인 스타일 진입점
├── assets/js/               # JavaScript 모듈
│   ├── main.js              # 메인 JavaScript
│   ├── toc.js               # 목차 기능
│   ├── code-copy.js         # 코드 복사 기능
│   └── tag-filter.js        # 태그 필터 기능
├── _includes/               # HTML 모듈
│   ├── head.html            # HTML 헤드
│   ├── header.html          # 헤더
│   ├── footer.html          # 푸터
│   ├── tags-sidebar.html    # 태그 사이드바
│   ├── post-list.html       # 포스트 목록
│   ├── toc.html             # 목차
│   ├── post-header.html     # 포스트 헤더
│   └── post-footer.html     # 포스트 푸터
└── _layouts/                # 페이지 레이아웃
    ├── default.html         # 기본 레이아웃
    ├── home.html            # 홈페이지 레이아웃
    └── post.html            # 포스트 레이아웃
```

## 🔧 로컬 개발 환경 설정

### 1. Ruby 및 Jekyll 설치

**Windows:**
```cmd
# Ruby 설치 (RubyInstaller 사용)
# https://rubyinstaller.org/ 에서 다운로드

# Jekyll 및 Bundler 설치
gem install jekyll bundler
```

### 2. 의존성 설치

```cmd
cd "c:\Users\ccg70\OneDrive\desktop\programming\blog\ZzangGeun.github.io"
bundle install
```

### 3. 로컬 서버 실행

```cmd
bundle exec jekyll serve --livereload
```

또는

```cmd
bundle exec jekyll serve --host 0.0.0.0 --port 4000
```

### 4. 브라우저에서 확인

브라우저에서 `http://localhost:4000` 접속

## 🧪 테스트 체크리스트

### 시각적 확인 사항:
- [ ] 홈페이지가 올바르게 로드됨
- [ ] 포스트 목록이 올바르게 표시됨
- [ ] 태그 필터링이 작동함
- [ ] 포스트 페이지가 올바르게 로드됨
- [ ] 목차(TOC)가 올바르게 생성됨
- [ ] 코드 블록이 올바르게 스타일링됨
- [ ] 코드 복사 버튼이 작동함 (중복 없이)
- [ ] 이미지가 레이아웃을 벗어나지 않음
- [ ] 반응형 디자인이 작동함 (모바일/태블릿)

### 기능 확인 사항:
- [ ] 코드 복사 버튼 클릭 시 정상 복사됨
- [ ] 목차 클릭 시 해당 섹션으로 이동
- [ ] 태그 클릭 시 필터링 작동
- [ ] 모든 링크가 정상 작동

## 🎨 스타일 커스터마이징

### 색상 변경
`_sass/_base.scss` 파일에서 색상 변수를 수정:

```scss
// 메인 색상
$brand-color: #2a7ae4;  // 메인 브랜드 색상
$text-color: #111;       // 기본 텍스트 색상
$background-color: #fdfdfd;  // 배경색
```

### 폰트 변경
`_sass/_base.scss` 파일에서 폰트 변수를 수정:

```scss
$base-font-family: -apple-system, BlinkMacSystemFont, ...;
$base-font-size: 16px;
```

## 🚨 알려진 이슈 및 해결책

### 코드 복사 버튼이 중복 생성되는 경우:
- `code-copy.js`에서 중복 방지 로직이 추가되어 해결됨
- 만약 여전히 발생한다면 브라우저 캐시를 클리어

### Jekyll 빌드 오류:
```cmd
bundle update
bundle exec jekyll clean
bundle exec jekyll build
```

### CSS가 적용되지 않는 경우:
- `_sass/custom.scss`에서 import 순서 확인
- 브라우저 개발자 도구에서 CSS 로드 확인

## 📱 배포

### GitHub Pages 자동 배포:
1. 변경사항을 GitHub에 push
2. GitHub Actions가 자동으로 빌드 및 배포
3. 몇 분 후 `https://username.github.io` 에서 확인

### 수동 배포:
```cmd
bundle exec jekyll build
# _site 폴더의 내용을 웹서버에 업로드
```

## 🔍 추가 개선사항

향후 추가 가능한 기능들:
- [ ] 다크모드 토글
- [ ] 검색 기능
- [ ] 댓글 시스템 (Disqus, utterances)
- [ ] 카테고리 페이지
- [ ] RSS 피드 개선
- [ ] SEO 최적화
- [ ] 페이지 로딩 속도 최적화

---

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. **브라우저 개발자 도구** - 에러 메시지 확인
2. **Jekyll 로그** - 빌드 오류 확인
3. **GitHub Issues** - 비슷한 문제 검색

**Happy Blogging! 🎉**

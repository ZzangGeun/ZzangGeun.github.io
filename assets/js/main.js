/**
 * ZzangGeun 블로그 메인 JavaScript
 * 모듈화된 유틸리티 기반으로 최적화된 진입점
 */

// 전역 블로그 기능 관리
const BlogApp = {
  init() {
    this.setupMathJax();
    this.setupCodeBlocks();
    this.setupMobileOptimizations();
    this.setupServiceIntegrations();
    console.log('🎉 ZzangGeun 블로그가 로드되었습니다!');
  },

  // MathJax 설정
  setupMathJax() {
    if (window.MathJax) {
      MathJax.typesetPromise();
    }
  },

  // 코드 블록 향상
  setupCodeBlocks() {
    const codeBlocks = BlogUtils.dom.queryAll('pre code');
    codeBlocks.forEach(block => {
      block.classList.add('hljs');
    });
  },
  
  // 모바일 최적화
  setupMobileOptimizations() {
    const isMobile = BlogUtils.device.isMobile();
    
    if (isMobile) {
      document.body.classList.add('mobile-device');
      
      // 터치 이벤트 최적화 (패시브 리스너)
      document.addEventListener('touchstart', function() {}, { passive: true });
      
      // 모바일 스크롤 성능 최적화
      this.optimizeMobileScroll();
    }
  },
  
  // 모바일 스크롤 최적화
  optimizeMobileScroll: BlogUtils.throttle(function() {
    // 스크롤 중 불필요한 애니메이션 비활성화
    document.body.classList.add('scrolling');
    
    setTimeout(() => {
      document.body.classList.remove('scrolling');
    }, 150);
  }, 100),
  
  // 외부 서비스 연동 확인
  setupServiceIntegrations() {
    this.waitForCodeCopy();
    this.waitForTagFilter();
    this.waitForTOC();
  },
  
  // 코드 복사 기능 로딩 대기
  waitForCodeCopy() {
    BlogUtils.waitForService('CodeCopyManager', () => {
      console.log('✅ 코드 복사 기능 연동 완료');
    });
  },
  
  // 태그 필터 기능 로딩 대기
  waitForTagFilter() {
    BlogUtils.waitForService('TagFilter', () => {
      console.log('✅ 태그 필터 기능 연동 완료');
    });
  },
  
  // TOC 기능 로딩 대기
  waitForTOC() {
    BlogUtils.waitForService('TOCManager', () => {
      console.log('✅ TOC 기능 연동 완료');
    }, 'toc-list');
  }
};

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  BlogApp.init();
});

// 전역 노출 (디버깅용)
window.BlogApp = BlogApp;

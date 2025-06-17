/**
 * ZzangGeun 블로그 메인 JavaScript
 * 모든 기능을 통합 관리하는 진입점
 */

// 유틸리티 함수들
const Utils = {
  // 디바운스 함수 (성능 최적화용)
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // 부드러운 스크롤
  smoothScrollTo(element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

// 전역 블로그 기능 관리
const BlogApp = {
  init() {
    this.setupMathJax();
    this.setupCodeBlocks();
    this.setupMobileOptimizations();
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
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
      block.classList.add('hljs'); // 하이라이트 클래스 추가
    });
  },
  
  // 모바일 최적화
  setupMobileOptimizations() {
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // 모바일 특화 설정
      document.body.classList.add('mobile-device');
      
      // 터치 이벤트 최적화
      document.addEventListener('touchstart', function() {}, { passive: true });
      
      // 코드 복사 기능과의 연동 확인
      this.waitForCodeCopy();
    }
  },
  
  // 코드 복사 기능 로딩 대기
  waitForCodeCopy() {
    let attempts = 0;
    const checkCodeCopy = () => {
      if (window.CodeCopyManager || attempts > 10) {
        if (window.CodeCopyManager) {
          console.log('코드 복사 기능과 연동 완료');
        }
        return;
      }
      attempts++;
      setTimeout(checkCodeCopy, 100);
    };
    checkCodeCopy();
  }
};

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  BlogApp.init();
});

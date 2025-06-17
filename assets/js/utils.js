/**
 * 유틸리티 함수 모음
 * 모든 JavaScript 파일에서 공통으로 사용되는 함수들
 */

// 전역 유틸리티 네임스페이스
window.BlogUtils = {
  
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

  // 쓰로틀 함수
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  },

  // 부드러운 스크롤
  smoothScrollTo(element, offset = 0) {
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  },

  // 모바일 감지
  isMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // 요소 표시/숨기기 애니메이션
  fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    const fade = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.min(progress / duration, 1);
      
      element.style.opacity = opacity;
      
      if (progress < duration) {
        requestAnimationFrame(fade);
      }
    };
    
    requestAnimationFrame(fade);
  },

  fadeOut(element, duration = 300) {
    let start = null;
    const fade = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.max(1 - (progress / duration), 0);
      
      element.style.opacity = opacity;
      
      if (progress < duration) {
        requestAnimationFrame(fade);
      } else {
        element.style.display = 'none';
      }
    };
    
    requestAnimationFrame(fade);
  },

  // DOM 조작 유틸리티
  createElement(tag, className = '', textContent = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
  },

  // 쿼리 선택자 단축
  $(selector, context = document) {
    return context.querySelector(selector);
  },

  $$(selector, context = document) {
    return context.querySelectorAll(selector);
  },

  // 이벤트 리스너 단축
  on(element, event, handler, options = {}) {
    if (element && typeof handler === 'function') {
      element.addEventListener(event, handler, options);
    }
  },

  off(element, event, handler) {
    if (element && typeof handler === 'function') {
      element.removeEventListener(event, handler);
    }
  },

  // CSS 클래스 토글 유틸리티
  toggleClass(element, className, force) {
    if (element) {
      return element.classList.toggle(className, force);
    }
  },

  addClass(element, className) {
    if (element && !element.classList.contains(className)) {
      element.classList.add(className);
    }
  },

  removeClass(element, className) {
    if (element && element.classList.contains(className)) {
      element.classList.remove(className);
    }
  },

  // 로컬 스토리지 유틸리티
  storage: {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('LocalStorage not available:', e);
      }
    },

    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.warn('LocalStorage not available:', e);
        return defaultValue;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('LocalStorage not available:', e);
      }
    }
  },

  // 날짜 포맷팅
  formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  },

  // URL 파라미터 유틸리티
  getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },

  setUrlParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
  },

  // 성능 모니터링
  performance: {
    mark(name) {
      if (window.performance && performance.mark) {
        performance.mark(name);
      }
    },

    measure(name, startMark, endMark) {
      if (window.performance && performance.measure) {
        try {
          performance.measure(name, startMark, endMark);
        } catch (e) {
          console.warn('Performance measurement failed:', e);
        }
      }
    }
  },
  
  // 스크롤 관련 유틸리티
  scroll: {
    // 현재 스크롤 위치
    getPosition() {
      return {
        x: window.pageXOffset || document.documentElement.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop
      };
    },
    
    // 특정 위치로 부드러운 스크롤
    toPosition(x, y, behavior = 'smooth') {
      window.scrollTo({ left: x, top: y, behavior });
    },
    
    // 요소까지 부드러운 스크롤
    toElement(element, offset = 0, behavior = 'smooth') {
      if (!element) return;
      
      const elementTop = element.offsetTop - offset;
      window.scrollTo({ top: elementTop, behavior });
    },
    
    // 맨 위로 스크롤
    toTop(behavior = 'smooth') {
      window.scrollTo({ top: 0, behavior });
    }
  },
  
  // 디바이스 감지 유틸리티
  device: {
    // 모바일 디바이스 감지
    isMobile() {
      return window.innerWidth <= 768 || 
             /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // 태블릿 디바이스 감지
    isTablet() {
      return window.innerWidth > 768 && window.innerWidth <= 1024;
    },
    
    // 데스크톱 디바이스 감지
    isDesktop() {
      return window.innerWidth > 1024;
    },
    
    // 터치 지원 확인
    isTouchDevice() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
  },
  
  // 서비스 로딩 대기 유틸리티
  waitForService(serviceName, callback, fallbackSelector = null, maxAttempts = 10) {
    let attempts = 0;
    
    const checkService = () => {
      const serviceExists = window[serviceName] || 
                           (fallbackSelector && BlogUtils.dom.query(fallbackSelector));
      
      if (serviceExists || attempts >= maxAttempts) {
        if (serviceExists && typeof callback === 'function') {
          callback();
        }
        return;
      }
      
      attempts++;
      setTimeout(checkService, 100);
    };
    
    checkService();
  },
  
  // 스타일 유틸리티
  style: {
    // CSS 변수 값 가져오기
    getCSSVariable(variableName) {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(variableName).trim();
    },
    
    // CSS 변수 설정
    setCSSVariable(variableName, value) {
      document.documentElement.style.setProperty(variableName, value);
    },
    
    // 클래스 토글 (부드러운 전환)
    toggleClass(element, className, duration = 300) {
      if (!element) return;
      
      element.classList.toggle(className);
      
      if (duration > 0) {
        element.style.transition = `all ${duration}ms ease`;
        setTimeout(() => {
          element.style.transition = '';
        }, duration);
      }
    }
  }
};

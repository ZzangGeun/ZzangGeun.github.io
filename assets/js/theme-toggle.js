/**
 * 테마 토글 기능
 * 다크/라이트 테마 전환 관리
 */

class ThemeToggle {
  constructor() {
    this.button = null;
    this.currentTheme = 'light';
    this.STORAGE_KEY = 'blog-theme';
    this.init();
  }

  init() {
    this.button = document.getElementById('theme-toggle');
    if (!this.button) return;

    // 저장된 테마 또는 시스템 선호도 가져오기
    this.currentTheme = this.getSavedTheme();
    
    // 초기 테마 적용
    this.applyTheme(this.currentTheme);
    
    // 버튼 이벤트 등록
    this.button.addEventListener('click', () => this.toggleTheme());
    
    // 시스템 테마 변경 감지
    this.watchSystemTheme();
  }

  getSavedTheme() {
    // 로컬 스토리지에서 저장된 테마 확인
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved && ['light', 'dark'].includes(saved)) {
      return saved;
    }
    
    // 시스템 선호도 확인
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  }

  applyTheme(theme) {
    const html = document.documentElement;
    const body = document.body;
    
    // 테마 클래스 적용
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
      this.button?.classList.remove('light-mode');
    } else {
      html.setAttribute('data-theme', 'light');
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
      this.button?.classList.add('light-mode');
    }
    
    this.currentTheme = theme;
    
    // 로컬 스토리지에 저장
    localStorage.setItem(this.STORAGE_KEY, theme);
    
    // 메타 태그 업데이트 (모바일 상태바 색상)
    this.updateMetaTags(theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    
    // 접근성: 화면 리더에게 변경 알림
    this.announceThemeChange(newTheme);
  }

  updateMetaTags(theme) {
    // 모바일 상태바 색상 업데이트
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      document.head.appendChild(themeColorMeta);
    }
    
    // CSS 변수에서 색상 가져오기
    const bgColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--surface-color').trim();
    themeColorMeta.content = bgColor || (theme === 'dark' ? '#1a1a1a' : '#ffffff');
  }

  announceThemeChange(theme) {
    // 접근성을 위한 live region 생성
    let announcement = document.getElementById('theme-announcement');
    if (!announcement) {
      announcement = document.createElement('div');
      announcement.id = 'theme-announcement';
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.position = 'absolute';
      announcement.style.left = '-10000px';
      announcement.style.width = '1px';
      announcement.style.height = '1px';
      announcement.style.overflow = 'hidden';
      document.body.appendChild(announcement);
    }
    
    const message = theme === 'dark' ? '다크 테마로 변경됨' : '라이트 테마로 변경됨';
    announcement.textContent = message;
    
    // 짧은 지연 후 메시지 제거
    setTimeout(() => {
      announcement.textContent = '';
    }, 1000);
  }

  watchSystemTheme() {
    // 시스템 테마 변경 감지
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        // 사용자가 수동으로 설정한 테마가 없을 때만 시스템 테마 따르기
        const hasUserPreference = localStorage.getItem(this.STORAGE_KEY);
        if (!hasUserPreference) {
          const systemTheme = e.matches ? 'dark' : 'light';
          this.applyTheme(systemTheme);
        }
      });
    }
  }

  // 현재 테마 반환 (다른 모듈에서 사용 가능)
  getCurrentTheme() {
    return this.currentTheme;
  }

  // 테마 강제 설정 (다른 모듈에서 사용 가능)
  setTheme(theme) {
    if (['light', 'dark'].includes(theme)) {
      this.applyTheme(theme);
    }
  }
}

// 전역 객체로 내보내기
window.ThemeToggle = ThemeToggle;

// 모듈 exports (Node.js 환경에서 사용 시)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeToggle;
}

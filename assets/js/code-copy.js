/**
 * 코드 블록 복사 기능 - 모바일 최적화 버전
 * 중복 처리 방지 및 모바일 터치 이벤트 지원
 */

// 전역 상태 관리
const CodeCopyManager = {
  initialized: false,
  processedElements: new Set(),
  
  // 모바일 감지
  isMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },
  
  // 디바이스별 설정
  getConfig() {
    const isMobile = this.isMobile();
    return {
      isMobile,
      buttonSize: isMobile ? 'small' : 'normal',
      fontSize: isMobile ? '9px' : '11px',
      padding: isMobile ? '3px 6px' : '6px 12px'
    };
  }
};

document.addEventListener('DOMContentLoaded', function() {
  // 중복 실행 방지
  if (CodeCopyManager.initialized) {
    console.log('코드 복사 기능이 이미 초기화됨');
    return;
  }
  
  console.log('코드 복사 스크립트 시작 - 디바이스:', CodeCopyManager.isMobile() ? '모바일' : '데스크톱');
  
  // 이미 처리된 코드 블록인지 확인 (더 강화된 로직)
  function isAlreadyProcessed(element) {
    // Set을 이용한 중복 체크
    if (CodeCopyManager.processedElements.has(element)) return true;
    
    // DOM 기반 중복 체크
    return element.closest('.code-block') !== null || 
           element.hasAttribute('data-copy-processed') ||
           element.querySelector('.copy-button') !== null;
  }
    // 라인 번호 요소들 제거 (모바일 최적화)
  function removeLineNumbers() {
    const lineNumberSelectors = [
      '.line-numbers-rows',
      '.gutter',
      '.rouge-gutter', 
      '.lineno',
      '.line-number',
      '.hljs-ln-numbers',
      '.rouge-table .rouge-gutter'
    ];
    
    lineNumberSelectors.forEach(selector => {
      document.querySelectorAll('.post-content ' + selector).forEach(element => {
        element.remove();
      });
    });
    
    // Rouge 테이블 구조 정리 (모바일에서 더 중요)
    document.querySelectorAll('.post-content .rouge-table').forEach(table => {
      const codeCell = table.querySelector('.rouge-code');
      if (codeCell && table.parentNode) {
        const pre = codeCell.querySelector('pre');
        if (pre) {
          // 모바일에서 테이블 구조를 단순화
          table.parentNode.replaceChild(pre, table);
        }
      }
    });
  }
  
  // 모든 코드 블록 찾기 (모바일 특화 로직 추가)
  function findCodeBlocks() {
    const codeBlocks = [];
    
    // 1순위: highlight/highlighter-rouge 컨테이너들
    document.querySelectorAll('.post-content .highlight, .post-content .highlighter-rouge').forEach(element => {
      if (!isAlreadyProcessed(element)) {
        codeBlocks.push(element);
        element.setAttribute('data-copy-processed', 'true');
        CodeCopyManager.processedElements.add(element);
      }
    });
    
    // 2순위: 독립적인 pre 태그들
    document.querySelectorAll('.post-content pre').forEach(pre => {
      if (!pre.closest('.highlight') && 
          !pre.closest('.highlighter-rouge') && 
          !isAlreadyProcessed(pre)) {
        codeBlocks.push(pre);
        pre.setAttribute('data-copy-processed', 'true');
        CodeCopyManager.processedElements.add(pre);
      }
    });
    
    // 3순위: 모바일에서 누락될 수 있는 코드 블록들
    if (CodeCopyManager.isMobile()) {
      document.querySelectorAll('.post-content .language-python, .post-content .language-javascript, .post-content .language-html').forEach(element => {
        if (!isAlreadyProcessed(element)) {
          codeBlocks.push(element);
          element.setAttribute('data-copy-processed', 'true');
          CodeCopyManager.processedElements.add(element);
        }
      });
    }
    
    console.log('찾은 코드 블록 수:', codeBlocks.length, '(디바이스:', CodeCopyManager.isMobile() ? '모바일' : '데스크톱', ')');
    return codeBlocks;
  }
    // 언어 감지 함수
  function detectLanguage(element) {
    // 클래스명에서 언어 추출
    const classNames = element.className || '';
    const parentClassNames = element.parentElement?.className || '';
    const codeElement = element.querySelector('code');
    const codeClassNames = codeElement?.className || '';
    
    const allClasses = `${classNames} ${parentClassNames} ${codeClassNames}`.toLowerCase();
    
    // 언어 매핑
    const languageMap = {
      'python': 'Python',
      'py': 'Python',
      'c++': 'C++',
      'cpp': 'C++',
      'cxx': 'C++',
      'cc': 'C++',
      'c': 'C',
      'javascript': 'JavaScript',
      'js': 'JavaScript',
      'html': 'HTML',
      'css': 'CSS',
      'scss': 'SCSS',
      'sass': 'SCSS',
      'java': 'Java',
      'bash': 'Shell',
      'shell': 'Shell',
      'sh': 'Shell',
      'json': 'JSON',
      'xml': 'XML',
      'yaml': 'YAML',
      'yml': 'YAML',
      'markdown': 'Markdown',
      'md': 'Markdown'
    };
    
    // 언어 감지
    for (const [key, value] of Object.entries(languageMap)) {
      if (allClasses.includes(`language-${key}`) || 
          allClasses.includes(`lang-${key}`) ||
          allClasses.includes(`highlight-${key}`)) {
        return value;
      }
    }
    
    // Rouge의 특별한 클래스명 처리
    if (allClasses.includes('language-c++') || allClasses.includes('language-cpp')) {
      return 'C++';
    }
    
    // 기본값
    return 'Code';
  }
  function extractCodeText(element) {
    let codeText = '';
    
    if (element.classList.contains('highlight') || element.classList.contains('highlighter-rouge')) {
      const codeElement = element.querySelector('code');
      if (codeElement) {
        codeText = codeElement.innerText;
      } else {
        const preElement = element.querySelector('pre');
        codeText = preElement ? preElement.innerText : element.innerText;
      }
    } else {
      const code = element.querySelector('code');
      codeText = code ? code.innerText : element.innerText;
    }
    
    // 모바일에서 불필요한 공백 제거
    if (CodeCopyManager.isMobile()) {
      codeText = codeText.replace(/^\s+|\s+$/gm, '').replace(/\n\s*\n\s*\n/g, '\n\n');
    }
    
    return codeText;
  }
  
  // 복사 기능 (모바일 터치 이벤트 지원)
  function copyToClipboard(text, button) {
    // 최신 브라우저 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(() => {
        showCopySuccess(button);
      }).catch(err => {
        console.warn('Clipboard API 실패, fallback 사용:', err);
        return fallbackCopy(text, button);
      });
    } else {
      // 구형 브라우저 또는 비보안 컨텍스트 대응
      return fallbackCopy(text, button);
    }
  }
  
  // Fallback 복사 메서드
  function fallbackCopy(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showCopySuccess(button);
      } else {
        showCopyError(button);
      }
    } catch (err) {
      console.error('Fallback 복사도 실패:', err);
      showCopyError(button);
    } finally {
      document.body.removeChild(textArea);
    }
  }
  
  // 복사 성공 표시
  function showCopySuccess(button) {
    const config = CodeCopyManager.getConfig();
    button.textContent = config.isMobile ? '✓' : '복사됨!';
    button.classList.add('copied');
    setTimeout(() => {
      button.textContent = '복사';
      button.classList.remove('copied');
    }, config.isMobile ? 1500 : 2000);
  }
  
  // 복사 실패 표시
  function showCopyError(button) {
    const config = CodeCopyManager.getConfig();
    button.textContent = config.isMobile ? '✗' : '실패';
    button.style.background = '#ff4444';
    setTimeout(() => {
      button.textContent = '복사';
      button.style.background = '';
    }, 2000);
  }
    // 복사 기능 추가 (모바일 최적화)
  function addCopyFunctionality() {
    const codeBlocks = findCodeBlocks();
    const config = CodeCopyManager.getConfig();
    
    codeBlocks.forEach((element, index) => {
      console.log(`코드 블록 ${index + 1} 처리 중 (${config.isMobile ? '모바일' : '데스크톱'})`);
      
      // 이미 래핑된 경우 스킵
      if (element.closest('.code-block')) {
        console.log(`코드 블록 ${index + 1} 이미 처리됨, 스킵`);
        return;
      }
        // 코드 블록 래퍼 생성
      const codeBlock = document.createElement('div');
      codeBlock.className = 'code-block';
      
      // 언어 감지 및 설정
      const language = detectLanguage(element);
      codeBlock.setAttribute('data-language', language);
      
      // 모바일 특화 클래스 추가
      if (config.isMobile) {
        codeBlock.classList.add('mobile');
      }
      
      // 복사 버튼 생성
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.textContent = '복사';
      copyButton.style.fontSize = config.fontSize;
      copyButton.style.padding = config.padding;
      
      // 모바일에서 터치 친화적으로 설정
      if (config.isMobile) {
        copyButton.style.minWidth = '40px';
        copyButton.style.minHeight = '30px';
        copyButton.setAttribute('aria-label', '코드 복사');
      }
      
      // 원래 요소를 래퍼로 감싸기
      element.parentNode.insertBefore(codeBlock, element);
      codeBlock.appendChild(copyButton);
      codeBlock.appendChild(element);
      
      // 이벤트 리스너 추가 (터치 및 클릭 지원)
      const handleCopy = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const codeText = extractCodeText(element);
        copyToClipboard(codeText, copyButton);
      };
      
      // 모바일 터치 이벤트 지원
      if (config.isMobile) {
        copyButton.addEventListener('touchstart', handleCopy, { passive: false });
        copyButton.addEventListener('touchend', (e) => e.preventDefault(), { passive: false });
      }
      
      // 클릭 이벤트 (모든 디바이스)
      copyButton.addEventListener('click', handleCopy);
      
      // 키보드 접근성
      copyButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCopy(e);
        }
      });
    });
  }
  
  // 초기화 및 실행
  function initialize() {
    // 중복 실행 방지
    if (document.querySelector('.code-block:not(.mobile)') && !CodeCopyManager.isMobile()) {
      console.log('데스크톱용 코드 복사 기능이 이미 적용됨');
      return;
    }
    
    if (document.querySelector('.code-block.mobile') && CodeCopyManager.isMobile()) {
      console.log('모바일용 코드 복사 기능이 이미 적용됨');
      return;
    }
    
    // 실행
    removeLineNumbers();
    addCopyFunctionality();
    
    // 초기화 완료 표시
    CodeCopyManager.initialized = true;
    console.log('코드 복사 스크립트 완료 - 처리된 요소 수:', CodeCopyManager.processedElements.size);
  }
  
  // 디바이스 변경 감지 (orientation change 등)
  function setupResponsiveHandling() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const wasMobile = CodeCopyManager.getConfig().isMobile;
        const isNowMobile = window.innerWidth <= 768;
        
        if (wasMobile !== isNowMobile) {
          console.log('디바이스 모드 변경 감지, 재초기화');
          // 기존 처리 상태 초기화
          CodeCopyManager.initialized = false;
          CodeCopyManager.processedElements.clear();
          
          // 기존 code-block 제거
          document.querySelectorAll('.code-block').forEach(block => {
            const element = block.querySelector('.highlight, .highlighter-rouge, pre');
            if (element && block.parentNode) {
              block.parentNode.insertBefore(element, block);
              block.remove();
              element.removeAttribute('data-copy-processed');
            }
          });
          
          // 재초기화
          setTimeout(initialize, 100);
        }
      }, 300);
    });
  }
  // 초기 실행
  initialize();
  
  // 반응형 처리 설정
  setupResponsiveHandling();
  
  // 전역 접근을 위해 window 객체에 노출
  window.CodeCopyManager = CodeCopyManager;
  
  console.log('코드 복사 스크립트 초기화 완료');
});
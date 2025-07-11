/**
 * 목차 (TOC) 생성 스크립트
 * 포스트 내용의 헤딩을 자동으로 감지하여 목차를 생성
 */

// 유틸리티 함수 (Utils 객체가 없을 경우를 대비)
const tocUtils = {
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
  }
};

document.addEventListener('DOMContentLoaded', function() {
  // 중복 실행 방지
  if (window.tocInitialized) {
    return;
  }
  window.tocInitialized = true;
  
  const tocList = document.getElementById('toc-list');
  if (!tocList) {
    return; // TOC 컨테이너가 없으면 종료
  }
  
  // 이미 목차가 생성되어 있다면 초기화
  if (tocList.children.length > 0) {
    tocList.innerHTML = '';
  }
  
  const headings = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3');
  
  // 헤딩이 없으면 TOC 숨기기
  if (headings.length === 0) {
    const tocSidebar = document.querySelector('.toc-sidebar');
    if (tocSidebar) {
      tocSidebar.style.display = 'none';
    }
    return;
  }
  
  // 각 헤딩에 대해 TOC 아이템 생성
  headings.forEach((heading, index) => {
    // 헤딩에 ID가 없으면 추가
    if (!heading.id) {
      heading.id = 'heading-' + index;
    }
    
    // TOC 아이템 생성
    const li = document.createElement('li');
    li.className = 'toc-item toc-' + heading.tagName.toLowerCase();
    
    const a = document.createElement('a');
    a.href = '#' + heading.id;
    a.textContent = heading.textContent;
    a.className = 'toc-link';
      // 부드러운 스크롤 이벤트
    a.addEventListener('click', function(e) {
      e.preventDefault();
      const targetElement = document.getElementById(heading.id);
      if (targetElement) {
        // 헤더 높이 + 여유 공간을 고려한 오프셋
        const headerOffset = 100; // 헤더 높이 + 여유 공간 (px)
        const elementPosition = targetElement.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
    
    li.appendChild(a);
    tocList.appendChild(li);
  });
  
  // 현재 섹션 하이라이트
  function highlightCurrentSection() {
    const scrollPosition = window.scrollY + 100;
    let current = '';
    
    headings.forEach(heading => {
      const top = heading.offsetTop;
      if (scrollPosition >= top) {
        current = heading.id;
      }
    });
    
    // 모든 링크에서 active 클래스 제거
    document.querySelectorAll('.toc-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // 현재 섹션 링크에 active 클래스 추가
    if (current) {
      const activeLink = document.querySelector('.toc-link[href="#' + current + '"]');
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  }
  // 스크롤 이벤트 리스너 (중복 등록 방지)
  if (!window.tocScrollListener) {
    window.tocScrollListener = tocUtils.debounce(highlightCurrentSection, 100);
    window.addEventListener('scroll', window.tocScrollListener);
  }
  highlightCurrentSection(); // 초기 실행
});

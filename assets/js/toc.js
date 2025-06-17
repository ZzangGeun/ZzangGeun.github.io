/**
 * 목차 (TOC) 생성 스크립트
 * 모듈화된 유틸리티 기반으로 최적화된 목차 관리
 */

const TOCManager = {
  init() {
    const tocList = BlogUtils.dom.query('#toc-list');
    const headings = BlogUtils.dom.queryAll('.post-content h1, .post-content h2, .post-content h3');
    
    // 헤딩이 없으면 TOC 숨기기
    if (headings.length === 0) {
      this.hideTOC();
      return;
    }
    
    this.createTOCItems(tocList, headings);
    this.setupScrollHighlight(headings);
    console.log('📑 TOC 초기화 완료');
  },
  
  // TOC 숨기기
  hideTOC() {
    const tocSidebar = BlogUtils.dom.query('.toc-sidebar');
    if (tocSidebar) {
      BlogUtils.fadeOut(tocSidebar);
    }
  },
  
  // TOC 아이템 생성
  createTOCItems(tocList, headings) {
    const fragment = document.createDocumentFragment();
    
    headings.forEach((heading, index) => {
      // 헤딩에 ID가 없으면 추가
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }
      
      const tocItem = this.createTOCItem(heading);
      fragment.appendChild(tocItem);
    });
    
    tocList.appendChild(fragment);
  },
  
  // 개별 TOC 아이템 생성
  createTOCItem(heading) {
    const li = document.createElement('li');
    li.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
    
    const a = document.createElement('a');
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;
    a.className = 'toc-link';
    
    // 부드러운 스크롤 이벤트
    a.addEventListener('click', this.handleTOCClick.bind(this, heading.id));
    
    li.appendChild(a);
    return li;
  },
  
  // TOC 클릭 핸들러
  handleTOCClick(headingId, e) {
    e.preventDefault();
    const targetElement = BlogUtils.dom.query(`#${headingId}`);
    
    if (targetElement) {
      const headerOffset = 100; // 헤더 높이 + 여유 공간
      const elementPosition = targetElement.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      BlogUtils.smoothScrollTo(offsetPosition);
    }
  },
  
  // 스크롤 하이라이트 설정
  setupScrollHighlight(headings) {
    const highlightHandler = BlogUtils.throttle(() => {
      this.highlightCurrentSection(headings);
    }, 100);
    
    window.addEventListener('scroll', highlightHandler, { passive: true });
  },
  
  // 현재 섹션 하이라이트
  highlightCurrentSection(headings) {
    const scrollPosition = window.scrollY + 100;
    let currentHeadingId = '';
    
    // 현재 스크롤 위치에서 가장 가까운 헤딩 찾기
    headings.forEach(heading => {
      if (scrollPosition >= heading.offsetTop) {
        currentHeadingId = heading.id;
      }
    });
    
    this.updateActiveLink(currentHeadingId);
  },
  
  // 활성 링크 업데이트
  updateActiveLink(currentHeadingId) {
    // 모든 링크에서 active 클래스 제거
    BlogUtils.dom.queryAll('.toc-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // 현재 섹션 링크에 active 클래스 추가
    if (currentHeadingId) {
      const activeLink = BlogUtils.dom.query(`.toc-link[href="#${currentHeadingId}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  }
};

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  TOCManager.init();
});

// 전역 노출
window.TOCManager = TOCManager;
  window.addEventListener('scroll', highlightCurrentSection);
  highlightCurrentSection(); // 초기 실행
});

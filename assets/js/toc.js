/**
 * 목차(TOC) 생성 및 스크롤 추적
 * 포스트 페이지에서 자동으로 목차를 생성하고 현재 섹션을 하이라이트
 */

class TableOfContents {
  constructor() {
    this.tocList = document.getElementById('toc-list');
    this.tocSidebar = document.querySelector('.toc-sidebar');
    this.headings = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6');
    this.init();
  }

  init() {
    // 목차가 필요 없는 경우 숨김
    if (!this.tocList || this.headings.length === 0) {
      if (this.tocSidebar) {
        this.tocSidebar.style.display = 'none';
      }
      return;
    }

    this.generateTOC();
    this.trackScrollPosition();
  }

  generateTOC() {
    this.headings.forEach((heading, index) => {
      // 헤딩에 ID 추가
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }

      // 목차 아이템 생성
      const tocItem = this.createTocItem(heading);
      this.tocList.appendChild(tocItem);
    });
  }

  createTocItem(heading) {
    const li = document.createElement('li');
    li.className = `toc-item toc-${heading.tagName.toLowerCase()}`;

    const a = document.createElement('a');
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;
    a.className = 'toc-link';

    // 부드러운 스크롤 이벤트
    a.addEventListener('click', (e) => this.handleTocClick(e, heading.id));

    li.appendChild(a);
    return li;
  }

  handleTocClick(e, headingId) {
    e.preventDefault();
    document.getElementById(headingId).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  trackScrollPosition() {
    const highlightCurrentSection = () => {
      const scrollPosition = window.scrollY + 100;
      let currentId = '';

      // 현재 스크롤 위치에 해당하는 섹션 찾기
      this.headings.forEach(heading => {
        if (scrollPosition >= heading.offsetTop) {
          currentId = heading.id;
        }
      });

      // 목차 링크 활성화 상태 업데이트
      this.updateActiveTocLink(currentId);
    };

    window.addEventListener('scroll', highlightCurrentSection);
    highlightCurrentSection(); // 초기 실행
  }

  updateActiveTocLink(currentId) {
    document.querySelectorAll('.toc-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  new TableOfContents();
});

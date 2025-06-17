/**
 * 태그 필터링 기능 - 모듈화된 버전
 */

const TagFilter = {
  // 상태 관리
  activeTag: null,
  
  // DOM 요소들
  elements: {
    tagFilters: null,
    recentBtn: null,
    heading: null,
    tagsCloud: null
  },

  // 초기화
  init() {
    this.cacheElements();
    this.bindEvents();
    this.optimizeForMobile();
    BlogUtils.performance.mark('tag-filter-init');
  },

  // DOM 요소 캐싱
  cacheElements() {
    this.elements.tagFilters = BlogUtils.$$('.tag-filter');
    this.elements.recentBtn = BlogUtils.$('[data-section="recent"]');
    this.elements.heading = BlogUtils.$('.post-list-heading');
    this.elements.tagsCloud = BlogUtils.$('.tags-cloud');
  },

  // 이벤트 바인딩
  bindEvents() {
    // 태그 필터 클릭
    this.elements.tagFilters.forEach(filter => {
      BlogUtils.on(filter, 'click', (e) => this.handleTagClick(e));
    });

    // 포스트 클릭 이벤트
    this.addPostClickEvents();

    // 반응형 처리
    BlogUtils.on(window, 'resize', 
      BlogUtils.debounce(() => this.optimizeForMobile(), 300)
    );

    // DOM 변경 감지
    this.observeContentChanges();
  },

  // 태그 클릭 처리
  handleTagClick(e) {
    const selectedTag = e.target.dataset.tag;
    
    // 이미 선택된 태그면 필터 해제
    if (this.activeTag === selectedTag) {
      this.clearFilter();
      return;
    }
    
    // 새로운 태그 선택
    this.setActiveTag(selectedTag);
    this.switchToRecentSection();
    this.filterPosts(selectedTag);
  },

  // 활성 태그 설정
  setActiveTag(tag) {
    this.clearActiveStates();
    this.activeTag = tag;
    
    const tagElement = BlogUtils.$(`[data-tag="${tag}"]`);
    if (tagElement) {
      BlogUtils.addClass(tagElement, 'active');
    }
  },

  // 필터 해제
  clearFilter() {
    this.activeTag = null;
    this.clearActiveStates();
    this.showAllPosts();
  },

  // 활성 상태 초기화
  clearActiveStates() {
    this.elements.tagFilters.forEach(filter => {
      BlogUtils.removeClass(filter, 'active');
    });
  },

  // 최근 게시글 섹션으로 전환
  switchToRecentSection() {
    if (!this.elements.recentBtn) return;

    const buttons = BlogUtils.$$('.header-btn');
    const sections = BlogUtils.$$('.content-section');
    
    buttons.forEach(btn => BlogUtils.removeClass(btn, 'active'));
    sections.forEach(section => BlogUtils.removeClass(section, 'active'));
    
    BlogUtils.addClass(this.elements.recentBtn, 'active');
    
    const recentSection = BlogUtils.$('#recent-section');
    if (recentSection) {
      BlogUtils.addClass(recentSection, 'active');
    }
    
    if (this.elements.heading) {
      this.elements.heading.textContent = '최근 게시글';
    }
  },

  // 포스트 필터링
  filterPosts(tag) {
    const postItems = this.getPostItems();
    
    postItems.forEach(item => {
      const hasTag = this.postHasTag(item, tag);
      this.togglePostVisibility(item, hasTag);
    });
  },

  // 포스트에 태그가 있는지 확인
  postHasTag(postItem, tag) {
    const postTags = BlogUtils.$$('.tag-item', postItem);
    return Array.from(postTags).some(tagElement => 
      tagElement.textContent.includes(tag)
    );
  },

  // 포스트 표시/숨김
  togglePostVisibility(item, show) {
    if (show) {
      item.style.display = 'block';
      BlogUtils.fadeIn(item, 200);
    } else {
      BlogUtils.fadeOut(item, 200);
    }
  },

  // 모든 포스트 표시
  showAllPosts() {
    const postItems = this.getPostItems();
    postItems.forEach(item => {
      item.style.display = 'block';
      item.style.opacity = '1';
    });
  },

  // 포스트 아이템 가져오기
  getPostItems() {
    return BlogUtils.$$('#recent-section .post-list > li');
  },

  // 포스트 클릭 이벤트 추가
  addPostClickEvents() {
    const postItems = this.getPostItems();
    
    postItems.forEach(item => {
      if (!item.hasAttribute('data-click-added')) {
        item.setAttribute('data-click-added', 'true');
        
        BlogUtils.on(item, 'click', (e) => {
          if (this.shouldIgnoreClick(e.target)) return;
          
          const postLink = BlogUtils.$('.post-link', item);
          if (postLink) {
            window.location.href = postLink.href;
          }
        });
      }
    });
  },

  // 클릭 무시 여부 확인
  shouldIgnoreClick(target) {
    return target.classList.contains('tag-filter') || 
           target.classList.contains('tag-item') ||
           target.tagName === 'A';
  },

  // 콘텐츠 변경 감지
  observeContentChanges() {
    const targetNode = BlogUtils.$('.main-content');
    if (!targetNode) return;

    const observer = new MutationObserver(
      BlogUtils.debounce(() => this.addPostClickEvents(), 100)
    );
    
    observer.observe(targetNode, { 
      childList: true, 
      subtree: true 
    });
  },

  // 모바일 최적화
  optimizeForMobile() {
    if (!BlogUtils.isMobile()) {
      this.showAllTags();
      return;
    }

    const tagFilters = Array.from(this.elements.tagFilters);
    const maxMobileTags = 8;

    if (tagFilters.length <= maxMobileTags) return;

    // 처음 8개만 표시
    tagFilters.forEach((tag, index) => {
      tag.style.display = index < maxMobileTags ? 'inline-block' : 'none';
    });

    this.addShowMoreButton(tagFilters);
  },

  // 모든 태그 표시
  showAllTags() {
    const tagFilters = BlogUtils.$$('.tag-filter:not(.show-more-tags)');
    tagFilters.forEach(tag => {
      tag.style.display = 'inline-block';
    });

    const showMoreBtn = BlogUtils.$('.show-more-tags');
    if (showMoreBtn) {
      showMoreBtn.style.display = 'none';
    }
  },

  // "더보기" 버튼 추가
  addShowMoreButton(tagFilters) {
    if (!this.elements.tagsCloud || BlogUtils.$('.show-more-tags')) return;

    const showMoreBtn = BlogUtils.createElement('button', 'show-more-tags tag-filter', '+ 더보기');
    showMoreBtn.style.backgroundColor = 'var(--text-secondary)';
    
    BlogUtils.on(showMoreBtn, 'click', () => {
      tagFilters.forEach(tag => {
        tag.style.display = 'inline-block';
      });
      showMoreBtn.style.display = 'none';
    });
    
    this.elements.tagsCloud.appendChild(showMoreBtn);
  }
};

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  TagFilter.init();
});

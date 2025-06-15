/**
 * 태그 필터링 기능
 * 홈페이지에서 태그를 클릭하면 해당 태그가 포함된 글만 표시
 */

class TagFilter {
  constructor() {
    this.tagFilters = document.querySelectorAll('.tag-filter');
    this.postItems = document.querySelectorAll('.post-item-wrapper');
    this.init();
  }

  init() {
    if (this.tagFilters.length === 0) return;
    
    this.tagFilters.forEach(filter => {
      filter.addEventListener('click', (e) => this.handleTagClick(e));
    });
  }

  handleTagClick(e) {
    const selectedTag = e.target.getAttribute('data-tag');
    
    // 활성 태그 업데이트
    this.updateActiveTag(e.target);
    
    // 포스트 필터링
    this.filterPosts(selectedTag);
  }

  updateActiveTag(activeElement) {
    this.tagFilters.forEach(filter => filter.classList.remove('active'));
    activeElement.classList.add('active');
  }

  filterPosts(selectedTag) {
    this.postItems.forEach(item => {
      const postTags = item.getAttribute('data-tags');
      const shouldShow = selectedTag === 'all' || postTags.includes(selectedTag);
      
      item.style.display = shouldShow ? 'block' : 'none';
      item.style.opacity = shouldShow ? '1' : '0';
      item.style.transform = shouldShow ? 'translateY(0)' : 'translateY(-10px)';
    });
  }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  new TagFilter();
});

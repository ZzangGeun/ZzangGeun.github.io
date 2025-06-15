/**
 * 태그 필터링 기능
 */

document.addEventListener('DOMContentLoaded', function() {
  const tagFilters = document.querySelectorAll('.tag-filter');
  const postItems = document.querySelectorAll('.post-list > li');
  let activeTag = null;

  // 태그 필터 클릭 이벤트
  tagFilters.forEach(filter => {
    filter.addEventListener('click', function() {
      const selectedTag = this.dataset.tag;
      
      // 이미 선택된 태그를 다시 클릭하면 필터 해제
      if (activeTag === selectedTag) {
        clearFilter();
        return;
      }
      
      // 이전 선택 해제
      clearActiveStates();
      
      // 새로운 태그 선택
      activeTag = selectedTag;
      this.classList.add('active');
      
      // 포스트 필터링
      filterPosts(selectedTag);
    });
  });
  
  // 포스트 블록 클릭 이벤트 추가
  postItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // 태그나 다른 클릭 가능한 요소를 클릭한 경우는 제외
      if (e.target.classList.contains('tag-filter') || 
          e.target.classList.contains('tag-item') ||
          e.target.tagName === 'A') {
        return;
      }
      
      // 포스트 링크 찾기
      const postLink = this.querySelector('.post-link');
      if (postLink) {
        window.location.href = postLink.href;
      }
    });
  });
  
  function clearFilter() {
    activeTag = null;
    clearActiveStates();
    showAllPosts();
  }
  
  function clearActiveStates() {
    tagFilters.forEach(filter => {
      filter.classList.remove('active');
    });
  }
  
  function filterPosts(tag) {
    postItems.forEach(item => {
      const postTags = item.querySelectorAll('.tag-item');
      let hasTag = false;
      
      postTags.forEach(tagElement => {
        if (tagElement.textContent.includes(tag)) {
          hasTag = true;
        }
      });
      
      if (hasTag) {
        item.style.display = 'block';
        item.style.opacity = '1';
      } else {
        item.style.display = 'none';
        item.style.opacity = '0';
      }
    });
  }
  
  function showAllPosts() {
    postItems.forEach(item => {
      item.style.display = 'block';
      item.style.opacity = '1';
    });
  }
});

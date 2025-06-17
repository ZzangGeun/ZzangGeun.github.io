/**
 * 태그 필터링 기능
 */

document.addEventListener('DOMContentLoaded', function() {
  const tagFilters = document.querySelectorAll('.tag-filter');
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
      
      // 최근 게시글 섹션으로 자동 전환
      switchToRecentSection();
      
      // 포스트 필터링
      filterPosts(selectedTag);
    });
  });

  function switchToRecentSection() {
    // 최근 게시글 버튼 활성화
    const recentBtn = document.querySelector('[data-section="recent"]');
    const buttons = document.querySelectorAll('.header-btn');
    const sections = document.querySelectorAll('.content-section');
    
    if (recentBtn) {
      buttons.forEach(btn => btn.classList.remove('active'));
      sections.forEach(section => section.classList.remove('active'));
      
      recentBtn.classList.add('active');
      document.getElementById('recent-section').classList.add('active');
      
      // 제목 업데이트
      const heading = document.querySelector('.post-list-heading');
      if (heading) {
        heading.textContent = '최근 게시글';      }
    }
  }
  
  // 포스트 아이템 동적 업데이트 함수
  function updatePostItems() {
    return document.querySelectorAll('#recent-section .post-list > li');
  }

  // 포스트 블록 클릭 이벤트 추가 (동적으로)
  function addPostClickEvents() {
    const postItems = updatePostItems();
    postItems.forEach(item => {
      // 기존 이벤트 리스너 제거 방지
      if (!item.hasAttribute('data-click-added')) {
        item.setAttribute('data-click-added', 'true');
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
      }
    });
  }
  
  // 초기 로드 시 이벤트 추가
  addPostClickEvents();
  
  // 섹션 변경 시 이벤트 재등록
  const observer = new MutationObserver(() => {
    addPostClickEvents();
  });
  
  const targetNode = document.querySelector('.main-content');
  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
  }
  
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
    const postItems = updatePostItems();
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
    const postItems = updatePostItems();
    postItems.forEach(item => {
      item.style.display = 'block';
      item.style.opacity = '1';
    });
  }

  // 모바일에서 태그 개수 제한 기능
  function optimizeTagsForMobile() {
    if (window.innerWidth <= 768) {
      const tagsCloud = document.querySelector('.tags-cloud');
      const tagFilters = tagsCloud ? tagsCloud.querySelectorAll('.tag-filter') : [];
      
      if (tagFilters.length > 8) { // 모바일에서는 최대 8개까지만 표시
        tagFilters.forEach((tag, index) => {
          if (index >= 8) {
            tag.style.display = 'none';
          } else {
            tag.style.display = 'inline-block';
          }
        });
        
        // "더보기" 버튼 추가 (아직 없다면)
        if (!tagsCloud.querySelector('.show-more-tags')) {
          const showMoreBtn = document.createElement('button');
          showMoreBtn.className = 'show-more-tags tag-filter';
          showMoreBtn.textContent = '+ 더보기';
          showMoreBtn.style.backgroundColor = 'var(--text-secondary)';
          
          showMoreBtn.addEventListener('click', function() {
            tagFilters.forEach(tag => {
              tag.style.display = 'inline-block';
            });
            this.style.display = 'none';
          });
          
          tagsCloud.appendChild(showMoreBtn);
        }
      }
    } else {
      // 데스크톱에서는 모든 태그 표시
      const tagFilters = document.querySelectorAll('.tag-filter');
      tagFilters.forEach(tag => {
        tag.style.display = tag.classList.contains('show-more-tags') ? 'none' : 'inline-block';
      });
    }
  }

  // 초기 실행 및 창 크기 변경 시 실행
  optimizeTagsForMobile();
  window.addEventListener('resize', optimizeTagsForMobile);
});

/**
 * 코드 블록 복사 기능 - 단순화된 버전
 */
document.addEventListener('DOMContentLoaded', function() {
  // 이미 처리된 경우 종료
  if (document.querySelector('.code-block')) {
    return;
  }
  
  // 라인 번호 제거
  function removeLineNumbers() {
    const selectors = [
      '.line-numbers-rows', '.gutter', '.rouge-gutter', 
      '.lineno', '.line-number', '.hljs-ln-numbers'
    ];
    
    selectors.forEach(selector => {
      document.querySelectorAll(`.post-content ${selector}`).forEach(el => el.remove());
    });
    
    // Rouge 테이블 구조 정리
    document.querySelectorAll('.post-content .rouge-table').forEach(table => {
      const pre = table.querySelector('.rouge-code pre');
      if (pre && table.parentNode) {
        table.parentNode.replaceChild(pre, table);
      }
    });
  }
  
  // 코드 블록 찾기
  function findCodeBlocks() {
    const blocks = [];
    
    // highlight/highlighter-rouge 요소들
    document.querySelectorAll('.post-content .highlight, .post-content .highlighter-rouge').forEach(el => {
      if (!el.hasAttribute('data-processed')) {
        blocks.push(el);
        el.setAttribute('data-processed', 'true');
      }
    });
    
    // 독립적인 pre 요소들
    document.querySelectorAll('.post-content pre').forEach(pre => {
      if (!pre.closest('.highlight') && 
          !pre.closest('.highlighter-rouge') && 
          !pre.hasAttribute('data-processed')) {
        blocks.push(pre);
        pre.setAttribute('data-processed', 'true');
      }
    });
    
    return blocks;
  }
  
  // 코드 텍스트 추출
  function getCodeText(element) {
    const code = element.querySelector('code');
    return code ? code.innerText : element.innerText;
  }
  
  // 복사 기능 추가
  function addCopyButtons() {
    const codeBlocks = findCodeBlocks();
    
    codeBlocks.forEach(element => {
      // 래퍼 생성
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block';
      
      // 복사 버튼 생성
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.textContent = '복사';
      
      // 요소 감싸기
      element.parentNode.insertBefore(wrapper, element);
      wrapper.appendChild(button);
      wrapper.appendChild(element);
      
      // 클릭 이벤트
      button.addEventListener('click', async () => {
        try {
          const text = getCodeText(element);
          await navigator.clipboard.writeText(text);
          
          button.textContent = '복사됨!';
          setTimeout(() => {
            button.textContent = '복사';
          }, 1500);
        } catch (err) {
          // 구형 브라우저 대응
          const textarea = document.createElement('textarea');
          textarea.value = getCodeText(element);
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          
          button.textContent = '복사됨!';
          setTimeout(() => {
            button.textContent = '복사';
          }, 1500);
        }
      });
    });
  }
  
  // 실행
  removeLineNumbers();
  addCopyButtons();
});

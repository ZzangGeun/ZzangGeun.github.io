/**
 * 코드 블록 복사 기능
 * 중복 처리 방지 및 단순화된 코드 복사 기능
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('코드 복사 스크립트 시작');
  
  // 이미 처리된 코드 블록인지 확인
  function isAlreadyProcessed(element) {
    return element.closest('.code-block') !== null || element.hasAttribute('data-copy-processed');
  }
  
  // 라인 번호 요소들 제거
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
    
    // Rouge 테이블 구조 정리
    document.querySelectorAll('.post-content .rouge-table').forEach(table => {
      const codeCell = table.querySelector('.rouge-code');
      if (codeCell && table.parentNode) {
        const pre = codeCell.querySelector('pre');
        if (pre) {
          table.parentNode.replaceChild(pre, table);
        }
      }
    });
  }
  
  // 모든 코드 블록 찾기 (중복 제거)
  function findCodeBlocks() {
    const codeBlocks = [];
    
    // highlight/highlighter-rouge 컨테이너들 찾기
    document.querySelectorAll('.post-content .highlight, .post-content .highlighter-rouge').forEach(element => {
      if (!isAlreadyProcessed(element)) {
        codeBlocks.push(element);
        element.setAttribute('data-copy-processed', 'true');
      }
    });
    
    // 독립적인 pre 태그들 찾기
    document.querySelectorAll('.post-content pre').forEach(pre => {
      if (!pre.closest('.highlight') && 
          !pre.closest('.highlighter-rouge') && 
          !isAlreadyProcessed(pre)) {
        codeBlocks.push(pre);
        pre.setAttribute('data-copy-processed', 'true');
      }
    });
    
    console.log('찾은 코드 블록 수:', codeBlocks.length);
    return codeBlocks;
  }
  
  // 코드 텍스트 추출
  function extractCodeText(element) {
    if (element.classList.contains('highlight') || element.classList.contains('highlighter-rouge')) {
      const codeElement = element.querySelector('code');
      if (codeElement) {
        return codeElement.innerText;
      } else {
        const preElement = element.querySelector('pre');
        return preElement ? preElement.innerText : element.innerText;
      }
    } else {
      const code = element.querySelector('code');
      return code ? code.innerText : element.innerText;
    }
  }
  
  // 복사 기능 추가 (각 코드 블록에 개별적으로)
  function addCopyFunctionality() {
    const codeBlocks = findCodeBlocks();
    
    codeBlocks.forEach((element, index) => {
      console.log(`코드 블록 ${index + 1} 처리 중`);
      
      // 코드 블록 래퍼 생성
      const codeBlock = document.createElement('div');
      codeBlock.className = 'code-block';
      
      // 복사 버튼 생성
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.textContent = '복사';
      
      // 원래 요소를 래퍼로 감싸기
      element.parentNode.insertBefore(codeBlock, element);
      codeBlock.appendChild(copyButton);
      codeBlock.appendChild(element);
        // 복사 이벤트 리스너
      copyButton.addEventListener('click', () => {
        const codeText = extractCodeText(element);
        
        // 클립보드에 복사
        navigator.clipboard.writeText(codeText).then(() => {
          copyButton.textContent = '복사됨!';
          copyButton.classList.add('copied');
          setTimeout(() => {
            copyButton.textContent = '복사';
            copyButton.classList.remove('copied');
          }, 2000);
        }).catch(err => {
          console.error('복사 실패:', err);
          // 구형 브라우저 대응
          const textArea = document.createElement('textarea');
          textArea.value = codeText;
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            document.execCommand('copy');
            copyButton.textContent = '복사됨!';
            copyButton.classList.add('copied');
            setTimeout(() => {
              copyButton.textContent = '복사';
              copyButton.classList.remove('copied');
            }, 2000);
          } catch (err) {
            console.error('Fallback 복사도 실패:', err);
          }
          document.body.removeChild(textArea);
        });
      });
    });
  }
  
  // 중복 실행 방지
  if (document.querySelector('.code-block')) {
    console.log('이미 코드 복사 기능이 적용됨');
    return;
  }
  
  // 실행
  removeLineNumbers();
  addCopyFunctionality();
  
  console.log('코드 복사 스크립트 완료');
});
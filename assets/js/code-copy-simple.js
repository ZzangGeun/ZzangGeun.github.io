/**
 * 코드 블록 복사 기능
 * 연속된 코드 블록을 그룹화하고 복사 버튼을 추가
 */
document.addEventListener('DOMContentLoaded', function() {
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
  
  // 모든 코드 블록 찾기
  function findCodeBlocks() {
    const codeBlocks = [];
    
    // highlight 컨테이너들 찾기
    document.querySelectorAll('.post-content .highlight, .post-content .highlighter-rouge').forEach(highlight => {
      if (!highlight.closest('.code-block')) {
        codeBlocks.push(highlight);
      }
    });
    
    // 독립적인 pre 태그들 찾기
    document.querySelectorAll('.post-content pre').forEach(pre => {
      if (!pre.closest('.highlight') && !pre.closest('.highlighter-rouge') && !pre.closest('.code-block')) {
        codeBlocks.push(pre);
      }
    });
    
    return codeBlocks;
  }
  
  // 연속된 코드 블록들을 그룹화
  function groupConsecutiveElements(elements) {
    if (elements.length === 0) return [];
    
    const groups = [];
    let currentGroup = [elements[0]];
    
    for (let i = 1; i < elements.length; i++) {
      const current = elements[i];
      const previous = elements[i - 1];
      
      let isConsecutive = false;
      let walker = previous.nextSibling;
      
      while (walker && walker !== current) {
        if (walker.nodeType === Node.TEXT_NODE) {
          if (walker.textContent.trim().length > 0) {
            break;
          }
        } else if (walker.nodeType === Node.ELEMENT_NODE) {
          if (walker.tagName === 'P' && walker.textContent.trim().length === 0) {
            // 빈 p 태그는 무시
          } else if (walker.tagName === 'BR') {
            // br 태그는 무시
          } else {
            break;
          }
        }
        walker = walker.nextSibling;
      }
      
      if (walker === current) {
        isConsecutive = true;
      }
      
      if (isConsecutive) {
        currentGroup.push(current);
      } else {
        groups.push([...currentGroup]);
        currentGroup = [current];
      }
    }
    
    groups.push(currentGroup);
    return groups;
  }
  
  // 복사 기능 추가
  function addCopyFunctionality() {
    const allCodeBlocks = findCodeBlocks();
    const codeGroups = groupConsecutiveElements(allCodeBlocks);
    
    codeGroups.forEach(group => {
      if (group.length > 0) {
        const codeBlock = document.createElement('div');
        codeBlock.className = 'code-block';
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = '복사';
        
        const firstElement = group[0];
        firstElement.parentNode.insertBefore(codeBlock, firstElement);
        codeBlock.appendChild(copyButton);
        
        group.forEach(element => {
          codeBlock.appendChild(element);
        });
        
        // 복사 이벤트 리스너
        copyButton.addEventListener('click', () => {
          let allText = '';
          
          group.forEach((element, index) => {
            let text = '';
            
            if (element.classList.contains('highlight') || element.classList.contains('highlighter-rouge')) {
              const codeElement = element.querySelector('code');
              if (codeElement) {
                text = codeElement.innerText;
              } else {
                const preElement = element.querySelector('pre');
                text = preElement ? preElement.innerText : element.innerText;
              }
            } else {
              const code = element.querySelector('code');
              text = code ? code.innerText : element.innerText;
            }
            
            allText += text;
            if (index < group.length - 1) {
              allText += '\n';
            }
          });
          
          // 클립보드에 복사
          navigator.clipboard.writeText(allText).then(() => {
            copyButton.textContent = '복사됨!';
            setTimeout(() => copyButton.textContent = '복사', 1500);
          }).catch(err => {
            console.error('복사 실패:', err);
            // 구형 브라우저 대응
            const textArea = document.createElement('textarea');
            textArea.value = allText;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
              document.execCommand('copy');
              copyButton.textContent = '복사됨!';
              setTimeout(() => copyButton.textContent = '복사', 1500);
            } catch (err) {
              console.error('Fallback 복사도 실패:', err);
            }
            document.body.removeChild(textArea);
          });
        });
      }
    });
  }
  
  // 실행
  removeLineNumbers();
  addCopyFunctionality();
});

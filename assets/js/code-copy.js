/**
 * 코드 복사 기능
 * 코드 블록에 복사 버튼을 추가하고 클립보드 복사 기능 제공
 */

class CodeCopyHandler {
  constructor() {
    this.init();
  }

  init() {
    this.removeLineNumbers();
    this.setupCodeBlocks();
  }

  // 다양한 라인 번호 요소들 제거
  removeLineNumbers() {
    const lineNumberSelectors = [
      '.line-numbers-rows', '.gutter', '.rouge-gutter', 
      '.lineno', '.line-number', '.hljs-ln-numbers',
      '.rouge-table .rouge-gutter'
    ];
    
    lineNumberSelectors.forEach(selector => {
      document.querySelectorAll(`.post-content ${selector}`).forEach(el => el.remove());
    });
    
    this.cleanRougeTable();
  }

  cleanRougeTable() {
    document.querySelectorAll('.post-content .rouge-table').forEach(table => {
      const codeCell = table.querySelector('.rouge-code');
      const pre = codeCell?.querySelector('pre');
      if (pre && table.parentNode) {
        table.parentNode.replaceChild(pre, table);
      }
    });
  }

  setupCodeBlocks() {
    const allCodeBlocks = this.findCodeBlocks();
    const codeGroups = this.groupConsecutiveElements(allCodeBlocks);
    
    codeGroups.forEach(group => {
      if (group.length > 0) {
        this.createCodeBlockWithCopyButton(group);
      }
    });
  }

  findCodeBlocks() {
    const codeBlocks = [];
    
    // highlight 컨테이너들
    document.querySelectorAll('.post-content .highlight, .post-content .highlighter-rouge').forEach(highlight => {
      if (!highlight.closest('.code-block')) {
        codeBlocks.push(highlight);
      }
    });
    
    // 독립적인 pre 태그들
    document.querySelectorAll('.post-content pre').forEach(pre => {
      if (!pre.closest('.highlight, .highlighter-rouge, .code-block')) {
        codeBlocks.push(pre);
      }
    });
    
    return codeBlocks;
  }

  groupConsecutiveElements(elements) {
    if (elements.length === 0) return [];
    
    const groups = [];
    let currentGroup = [elements[0]];
    
    for (let i = 1; i < elements.length; i++) {
      if (this.isConsecutive(elements[i - 1], elements[i])) {
        currentGroup.push(elements[i]);
      } else {
        groups.push([...currentGroup]);
        currentGroup = [elements[i]];
      }
    }
    
    groups.push(currentGroup);
    return groups;
  }

  isConsecutive(element1, element2) {
    let walker = element1.nextSibling;
    
    while (walker && walker !== element2) {
      if (walker.nodeType === Node.TEXT_NODE && walker.textContent.trim()) {
        return false;
      }
      if (walker.nodeType === Node.ELEMENT_NODE) {
        const tagName = walker.tagName;
        if (tagName !== 'P' && tagName !== 'BR') return false;
        if (tagName === 'P' && walker.textContent.trim()) return false;
      }
      walker = walker.nextSibling;
    }
    
    return walker === element2;
  }

  createCodeBlockWithCopyButton(group) {
    const codeBlock = document.createElement('div');
    codeBlock.className = 'code-block';
    
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.textContent = '복사';
    
    // 첫 번째 요소 앞에 삽입
    const firstElement = group[0];
    firstElement.parentNode.insertBefore(codeBlock, firstElement);
    codeBlock.appendChild(copyButton);
    
    // 모든 요소들을 code-block 안으로 이동
    group.forEach(element => codeBlock.appendChild(element));
    
    // 복사 이벤트 추가
    copyButton.addEventListener('click', () => this.copyCodeToClipboard(group, copyButton));
  }

  async copyCodeToClipboard(group, button) {
    const allText = group.map(element => this.extractTextFromElement(element)).join('\n');
    
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(allText);
      } else {
        this.fallbackCopyToClipboard(allText);
      }
      this.showCopySuccess(button);
    } catch (err) {
      console.error('복사 실패:', err);
      this.fallbackCopyToClipboard(allText);
      this.showCopySuccess(button);
    }
  }

  extractTextFromElement(element) {
    const codeElement = element.querySelector('code');
    if (codeElement) return codeElement.innerText;
    
    const preElement = element.querySelector('pre');
    return preElement ? preElement.innerText : element.innerText;
  }

  showCopySuccess(button) {
    const originalText = button.textContent;
    button.textContent = '복사됨!';
    setTimeout(() => button.textContent = originalText, 1500);
  }

  fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  new CodeCopyHandler();
});

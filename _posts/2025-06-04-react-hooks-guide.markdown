---
layout: post
title: "React Hooks 완벽 가이드"
date: 2025-06-04 16:45:00 +0900
categories: react frontend
---

React 16.8에서 도입된 Hooks는 함수형 컴포넌트에서도 상태 관리와 생명주기 기능을 사용할 수 있게 해주었습니다.

## useState Hook

가장 기본적인 Hook으로 함수형 컴포넌트에서 상태를 관리할 수 있습니다.

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>클릭 횟수: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        클릭
      </button>
    </div>
  );
}
```

## useEffect Hook

컴포넌트의 생명주기와 관련된 작업을 처리합니다.

```jsx
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 사용자 정보 로드
    fetchUser(userId).then(setUser);
    
    // 정리 함수 (cleanup)
    return () => {
      // 필요시 정리 작업 수행
    };
  }, [userId]); // userId가 변경될 때만 실행

  return user ? <div>{user.name}</div> : <div>로딩 중...</div>;
}
```

## Custom Hook 만들기

반복되는 로직을 Custom Hook으로 추출할 수 있습니다.

```jsx
// useLocalStorage Hook
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// 사용 예시
function App() {
  const [name, setName] = useLocalStorage('name', '');
  
  return (
    <input 
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="이름을 입력하세요"
    />
  );
}
```

## Hook 사용 규칙

1. **최상위에서만 호출**: 반복문, 조건문, 중첩된 함수 내에서 호출하지 마세요
2. **React 함수에서만 호출**: 일반 JavaScript 함수에서는 호출하지 마세요

Hooks를 통해 더 간결하고 재사용 가능한 React 컴포넌트를 만들어보세요!

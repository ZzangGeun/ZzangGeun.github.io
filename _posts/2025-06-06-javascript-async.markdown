---
layout: post
title: "JavaScript 비동기 처리: Promise와 async/await"
date: 2025-06-06 10:00:00 +0900
categories: javascript programming
---

JavaScript에서 비동기 처리는 현대 웹 개발의 핵심입니다. 이번 포스트에서는 Promise와 async/await에 대해 알아보겠습니다.

## Promise란?

Promise는 JavaScript에서 비동기 작업의 결과를 나타내는 객체입니다.

```javascript
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("데이터가 성공적으로 로드되었습니다!");
    }, 1000);
  });
};

fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

## async/await 문법

async/await는 Promise를 더 간단하고 직관적으로 사용할 수 있게 해주는 문법입니다.

```javascript
const loadData = async () => {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

loadData();
```

> **팁**: async/await를 사용하면 비동기 코드를 마치 동기 코드처럼 작성할 수 있어 가독성이 크게 향상됩니다.

## 마무리

비동기 처리는 처음에는 어려울 수 있지만, Promise와 async/await를 제대로 이해하면 더욱 효율적인 JavaScript 코드를 작성할 수 있습니다.

import React from 'react';

export default {
  title: 'Core|Scroll',
};

export const story1 = () => (
  <div>
    <pre>START, when switching stories, you should be able to read this at the top of the page</pre>
    <div style={{ height: '100vh' }} />
    <pre>
      END, this text should be below the scroll "fold" and therefore only be readable after
      scrolling
    </pre>
  </div>
);
story1.title = 'story with 100vh padding 1';

export const story2 = () => (
  <div>
    <pre>START, when switching stories, you should be able to read this at the top of the page</pre>
    <div style={{ height: '100vh' }} />
    <pre>
      END, this text should be below the scroll "fold" and therefore only be readable after
      scrolling
    </pre>
  </div>
);
story2.title = 'story with 100vh padding 2';

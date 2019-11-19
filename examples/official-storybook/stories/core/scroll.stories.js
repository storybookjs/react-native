import React from 'react';
import { styled } from '@storybook/theming';

import { Spaced } from '@storybook/components';

export default {
  title: 'Core/Scroll',
};

const Horizontal = styled(props => <Spaced col={1} {...props} />)({
  display: 'grid',
  gridTemplateColumns: '100px calc(100vw + 100px) 100px',
});
const Vertical = styled(props => <Spaced row={1} {...props} />)({});

export const Story1 = () => (
  <Vertical>
    <pre>START, when switching stories, you should be able to read this at the top of the page</pre>
    <pre style={{ height: '100vh' }}>middle</pre>
    <pre>
      END, this text should be below the scroll "fold" and therefore only be readable after
      scrolling
    </pre>
  </Vertical>
);
Story1.story = { name: 'story with 100vh padding 1' };

export const Story2 = () => (
  <Vertical>
    <pre>START, when switching stories, you should be able to read this at the top of the page</pre>
    <pre style={{ height: '100vh' }}>middle</pre>
    <pre>
      END, this text should be below the scroll "fold" and therefore only be readable after
      scrolling
    </pre>
  </Vertical>
);
Story2.story = { name: 'story with 100vh padding 2' };

export const Story3 = () => (
  <Horizontal>
    <pre>START</pre>
    <pre>middle</pre>
    <pre>END</pre>
  </Horizontal>
);
Story3.story = { name: 'story with 100vw+' };

export const Story4 = () => (
  <Horizontal>
    <pre>START</pre>
    <pre>middle</pre>
    <pre>END</pre>
  </Horizontal>
);
Story4.story = { name: 'story with 100vw+ 2' };

import React from 'react';
import { storiesOf } from '@storybook/react';
import SyntaxHighlighter from './syntaxhighlighter';

storiesOf('Components|SyntaxHighlighter', module)
  .add('default', () => <SyntaxHighlighter />)
  .add('bash', () => (
    <SyntaxHighlighter language="bash" copyable={false}>
      npx npm-check-updates '/storybook/' -u && yarn
    </SyntaxHighlighter>
  ))
  .add('jsx', () => (
    <SyntaxHighlighter language="jsx" copyable={false}>
      {`import { Good, Things } from 'life';
        
        const result = () => <Good><Things all={true} /></Good>;

        export { result as default };
      `}
    </SyntaxHighlighter>
  ))
  .add('story', () => (
    <SyntaxHighlighter language="jsx" copyable={false}>
      {`
  import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from '@emotion/styled';

import Heading from './heading';

const Holder = styled.div({
  margin: 10,
  border: '1px dashed deepskyblue',
  // overflow: 'hidden',
});

storiesOf('Components|Heading', module).add('types', () => (
  <div>
    <Holder>
      <Heading>DEFAULT WITH ALL CAPS</Heading>
    </Holder>
    <Holder>
      <Heading sub="With a great sub">THIS LONG DEFAULT WITH ALL CAPS & SUB</Heading>
    </Holder>
    <Holder>
      <Heading type="page">page type</Heading>
    </Holder>
    <Holder>
      <Heading type="page" sub="With a sub">
        page type
      </Heading>
    </Holder>
  </div>
));`}
    </SyntaxHighlighter>
  ))
  .add('bordered & copy-able', () => (
    <SyntaxHighlighter language="jsx" copyable bordered>
      {`import { Good, Things } from 'life';
        
        const result = () => <Good><Things /></Good>;

        export { result as default };
      `}
    </SyntaxHighlighter>
  ));

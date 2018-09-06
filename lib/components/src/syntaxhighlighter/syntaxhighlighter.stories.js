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
        
        const result = <Good><Things all={true} /></Good>;

        export { result as default };
      `}
    </SyntaxHighlighter>
  ))
  .add('bordered & copy-able', () => (
    <SyntaxHighlighter language="jsx" copyable bordered>
      {`import { Good, Things } from 'life';
        
        const result = <Good><Things /></Good>;

        export { result as default };
      `}
    </SyntaxHighlighter>
  ));

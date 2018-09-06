import React from 'react';
import { storiesOf } from '@storybook/react';
import SyntaxHighlighter from './syntaxhighlighter';

storiesOf('Components|SyntaxHighlighter', module)
  .add('default', () => <SyntaxHighlighter />)
  .add('bash', () => (
    <SyntaxHighlighter language="bash" copyable>
      npx npm-check-updates '/storybook/' -u && yarn
    </SyntaxHighlighter>
  ))
  .add('jsx', () => (
    <SyntaxHighlighter language="jsx" copyable>
      {`import { Good, Things } from 'life';
        
        const result = <Good><Things all={true} /></Good>;

        export { result as default };
      `}
    </SyntaxHighlighter>
  ))
  .add('not copy-able', () => (
    <SyntaxHighlighter language="jsx" copyable={false}>
      {`import { Good, Things } from 'life';
        
        const result = <Good><Things /></Good>;

        export { result as default };
      `}
    </SyntaxHighlighter>
  ));

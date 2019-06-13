import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider, themes, convert, ensure } from '@storybook/theming';
import { SyntaxHighlighter } from './syntaxhighlighter';

storiesOf('Basics|SyntaxHighlighter', module)
  .add('bash', () => (
    <SyntaxHighlighter language="bash" copyable={false}>
      npx npm-check-updates '/storybook/' -u && npm install
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
  .add('unsupported', () => (
    <SyntaxHighlighter language="C#" bordered copyable>
      {`
        // A Hello World! program in C#.
        using System;
        namespace HelloWorld
        {
          class Hello 
          {
            static void Main() 
            {
              Console.WriteLine("Hello World!");

              // Keep the console window open in debug mode.
              Console.WriteLine("Press any key to exit.");
              Console.ReadKey();
            }
          }
        }
      `}
    </SyntaxHighlighter>
  ))
  .add('dark unsupported', () => {
    const theme = ensure(themes.dark);
    return (
      <ThemeProvider theme={theme}>
        <SyntaxHighlighter bordered language="C#" copyable>
          {`
            // A Hello World! program in C#.
            using System;
            namespace HelloWorld
            {
              class Hello 
              {
                static void Main() 
                {
                  Console.WriteLine("Hello World!");

                  // Keep the console window open in debug mode.
                  Console.WriteLine("Press any key to exit.");
                  Console.ReadKey();
                }
              }
            }
          `}
        </SyntaxHighlighter>
      </ThemeProvider>
    );
  })
  .add('story', () => (
    <SyntaxHighlighter language="jsx" copyable={false}>
      {`
        import React from 'react';
        import { storiesOf } from '@storybook/react';
        import { styled } from '@storybook/theming';

        import Heading from './heading';

        const Holder = styled.div({
          margin: 10,
          border: '1px dashed deepskyblue',
          // overflow: 'hidden',
        });

        storiesOf('Basics|Heading', module).add('types', () => (
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
        ));
      `}
    </SyntaxHighlighter>
  ))
  .add('bordered & copy-able', () => (
    <SyntaxHighlighter language="jsx" copyable bordered>
      {`import { Good, Things } from 'life';

        const result = () => <Good><Things /></Good>;

        export { result as default };
      `}
    </SyntaxHighlighter>
  ))
  .add('padded', () => (
    <SyntaxHighlighter language="jsx" padded>
      {`import { Good, Things } from 'life';

        const result = () => <Good><Things /></Good>;

        export { result as default };
      `}
    </SyntaxHighlighter>
  ))
  .add('showLineNumbers', () => (
    <SyntaxHighlighter language="jsx" copyable={false} showLineNumbers>
      {`import { Good, Things } from 'life';

        const result = () => <Good><Things /></Good>;

        export { result as default };
      `}
    </SyntaxHighlighter>
  ));

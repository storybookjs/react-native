/** @jsx h */
import { h } from 'preact';

const Main = props => (
  <article
    {...props}
    style={{
      margin: 15,
      maxWidth: 600,
      lineHeight: 1.4,
      fontFamily: '"Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif',
    }}
  />
);

// eslint-disable-next-line react/prop-types
const Title = ({ children, ...props }) => <h1 {...props}>{children}</h1>;

const Note = props => (
  <p
    {...props}
    style={{
      opacity: 0.5,
    }}
  />
);

const InlineCode = props => (
  <code
    {...props}
    style={{
      fontSize: 15,
      fontWeight: 600,
      padding: '2px 5px',
      border: '1px solid #eae9e9',
      borderRadius: 4,
      backgroundColor: '#f3f2f2',
      color: '#3a3a3a',
    }}
  />
);

// eslint-disable-next-line react/prop-types
const Link = ({ children, href, ...props }) => (
  <a
    href={href}
    {...props}
    style={{
      color: '#1474f3',
      textDecoration: 'none',
      borderBottom: '1px solid #1474f3',
      paddingBottom: 2,
    }}
  >
    {children}
  </a>
);

// eslint-disable-next-line react/prop-types
const NavButton = ({ children, ...props }) => (
  <button
    {...props}
    type="button"
    style={{
      color: '#1474f3',
      textDecoration: 'none',
      borderBottom: '1px solid #1474f3',
      paddingBottom: 2,
      borderTop: 'none',
      borderRight: 'none',
      borderLeft: 'none',
      backgroundColor: 'transparent',
      padding: 0,
      cursor: 'pointer',
      font: 'inherit',
    }}
  >
    {children}
  </button>
);

/* eslint-disable-next-line react/prop-types */
const Welcome = ({ showApp }) => (
  <Main>
    <Title>Welcome to storybook</Title>
    <p>This is a UI component dev environment for your app.</p>
    <p>
      We've added some basic stories inside the <InlineCode>src/stories</InlineCode> directory.
      <br />A story is a single state of one or more UI components. You can have as many stories as
      you want.
      <br />
      (Basically a story is like a visual test case.)
    </p>
    <p>
      See these sample <NavButton onClick={showApp}>stories</NavButton> for a component called{' '}
      <InlineCode>Button</InlineCode>.
    </p>
    <p>
      Just like that, you can add your own components as stories.
      <br />
      You can also edit those components and see changes right away.
      <br />
      (Try editing the <InlineCode>Button</InlineCode> stories located at{' '}
      <InlineCode>src/stories/index.js</InlineCode>
      .)
    </p>
    <p>
      Usually we create stories with smaller UI components in the app.
      <br />
      Have a look at the{' '}
      <Link
        href="https://storybook.js.org/basics/writing-stories"
        target="_blank"
        rel="noopener noreferrer"
      >
        Writing Stories
      </Link>{' '}
      section in our documentation.
    </p>
    <Note>
      <b>NOTE:</b>
      <br />
      Have a look at the <InlineCode>.storybook/webpack.config.js</InlineCode> to add webpack
      loaders and plugins you are using in this project.
    </Note>
  </Main>
);

export { Welcome as default };

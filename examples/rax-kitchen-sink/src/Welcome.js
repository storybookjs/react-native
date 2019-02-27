import { createElement } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Button from 'rax-button';
import Image from 'rax-image';
import Link from 'rax-link';

const Main = props => (
  <View
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
const P = ({ children, ...props }) => (
  <View {...props}>
    <Text>{children}</Text>
  </View>
);

// eslint-disable-next-line react/prop-types
const Title = ({ children, ...props }) => (
  <Text {...props} style={{ fontSize: 40, fontWeight: 'bold' }}>
    {children}
  </Text>
);

const Note = props => (
  <Text
    {...props}
    style={{
      opacity: 0.5,
    }}
  />
);

const InlineCode = props => (
  <Text
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
const NavButton = ({ children, ...props }) => (
  <Button
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
  </Button>
);

/* eslint-disable-next-line react/prop-types */
const Welcome = ({ showApp }) => (
  <Main>
    <Title>Welcome to storybook for Preact</Title>
    <Image
      source={{
        uri: './rax-logo.png',
      }}
      fallbackSource={{
        uri:
          'https://user-images.githubusercontent.com/677114/49848760-999e7d00-fe11-11e8-978f-264ea31f6739.png',
      }}
      style={{
        width: 150,
        height: 150,
        margin: '0 auto',
      }}
      resizeMode="cover"
    />

    <P>This is a UI component dev environment for your Rax app.</P>
    <P>
      We've added some basic stories inside the <InlineCode>src/stories</InlineCode> directory. A
      story is a single state of one or more UI components. You can have as many stories as you
      want. (Basically a story is like a visual test case.)
    </P>
    <P>
      See these sample <NavButton onClick={showApp}>stories</NavButton> for a component called{' '}
      <InlineCode>Button</InlineCode>.
    </P>
    <P>
      Just like that, you can add your own components as stories. You can also edit those components
      and see changes right away. (Try editing the <InlineCode>Button</InlineCode> stories located
      at <InlineCode>src/stories/index.js</InlineCode>
      .)
    </P>
    <P>
      Usually we create stories with smaller UI components in the app. Have a look at the{' '}
      <Link
        href="https://storybook.js.org/basics/writing-stories"
        target="_blank"
        rel="noopener noreferrer"
      >
        Writing Stories
      </Link>{' '}
      section in our documentation.
    </P>
    <Note>
      <P style={{ fontWeight: 'bold' }}>NOTE:</P>
      <P>
        Have a look at the <InlineCode>.storybook/webpack.config.js</InlineCode> to add webpack
        loaders and plugins you are using in this project.
      </P>
    </Note>
  </Main>
);

export default Welcome;

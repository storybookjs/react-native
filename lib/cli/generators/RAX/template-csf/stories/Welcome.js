/* eslint-disable react/prop-types, jsx-a11y/anchor-is-valid */
import { createElement } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import Link from 'rax-link';

const Main = ({ children, ...props }) => (
  <View
    {...props}
    style={{
      margin: 15,
      fontFamily: '"Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif',
    }}
  >
    {children}
  </View>
);

const P = ({ children, ...props }) => (
  <View {...props} style={{ marginBottom: 10 }}>
    <Text style={{ fontSize: 12 }}>{children}</Text>
  </View>
);

const Title = ({ children, ...props }) => (
  <Text {...props} style={{ fontSize: 40, fontWeight: 'bold' }}>
    {children}
  </Text>
);

const Note = ({ children, ...props }) => (
  <View
    {...props}
    style={{
      opacity: 0.5,
    }}
  >
    {children}
  </View>
);

const InlineCode = ({ children, ...props }) => (
  <Text
    {...props}
    style={{
      fontFamily: 'monospace',
      fontSize: 12,
      padding: '2px 5px',
      border: '1px solid #eae9e9',
      borderRadius: 4,
      backgroundColor: '#f3f2f2',
      color: '#3a3a3a',
    }}
  >
    {children}
  </Text>
);

const Welcome = ({ showApp }) => (
  <Main>
    <Title>Welcome to storybook for Rax</Title>
    <Image
      source={{
        uri: './rax-logo.png',
      }}
      fallbackSource={{
        uri:
          'https://user-images.githubusercontent.com/677114/49848760-999e7d00-fe11-11e8-978f-264ea31f6739.png',
      }}
      style={{
        width: 100,
        height: 100,
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
      See these sample&nbsp;
      <Link href="#" onPress={showApp} rel="noopener noreferrer">
        stories
      </Link>
      &nbsp;for a component called <InlineCode>Button</InlineCode>.
    </P>
    <P>
      Just like that, you can add your own components as stories. You can also edit those components
      and see changes right away. (Try editing the <InlineCode>Button</InlineCode> stories located
      at <InlineCode>src/stories/index.js</InlineCode>
      .)
    </P>
    <P>
      Usually we create stories with smaller UI components in the app. Have a look at the&nbsp;
      <Link
        href="https://storybook.js.org/basics/writing-stories"
        target="_blank"
        rel="noopener noreferrer"
      >
        Writing Stories
      </Link>
      &nbsp;section in our documentation.
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

import { createElement } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Button from 'rax-button';
import Image from 'rax-image';

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
    <Text
      style={{
        fontSize: 10,
        lineHeight: 15,
      }}
    >
      {children}
    </Text>
  </View>
);

// eslint-disable-next-line react/prop-types
const Title = ({ children, ...props }) => (
  <Text {...props} style={{ fontSize: 40, lineHeight: 50, fontWeight: 'bold' }}>
    {children}
  </Text>
);

const Note = props => (
  <Text
    {...props}
    style={{
      opacity: 0.5,
      fontSize: 13,
    }}
  />
);

// eslint-disable-next-line react/prop-types
const NavButton = ({ children, ...props }) => (
  <Button
    {...props}
    style={{
      color: '#1474f3',
      textDecoration: 'none',
      borderBottom: '1px solid #1474f3',
      paddingBottom: 2,
      borderTop: 'none',
      borderRight: 'none',
      borderLeft: 'none',
      backgroundColor: 'transparent',
      padding: 10,
      fontSize: 13,
      lineHeight: 15,
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
      We've added some basic stories inside the 'src/stories' directory. A story is a single state
      of one or more UI components. You can have as many stories as you want. (Basically a story is
      like a visual test case.)
    </P>
    <P>See these sample</P>
    <NavButton onPress={showApp}>
      <P>Button</P>
    </NavButton>
    <P>for a component called 'Button'.</P>
    <P>
      Just like that, you can add your own components as stories. You can also edit those components
      and see changes right away. (Try editing the 'Button' stories located at
      'src/stories/index.js' .)
    </P>
  </Main>
);

export default Welcome;

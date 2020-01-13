/* eslint-disable react/prop-types */
import { createElement } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';

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
  <Text {...props} style={{ fontSize: 40, lineHeight: '80px', fontWeight: 'bold' }}>
    {children}
  </Text>
);

export const App = ({ showApp }) => (
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
      We've added some basic stories inside the 'src/stories' directory. A story is a single state
      of one or more UI components. You can have as many stories as you want. (Basically a story is
      like a visual test case.)
    </P>
    <P>See these sample</P>
    <button onPress={showApp} type="button">
      <P>button</P>
    </button>
    <P>for a component called 'Button'.</P>
    <P>
      Just like that, you can add your own components as stories. You can also edit those components
      and see changes right away. (Try editing the 'Button' stories located at
      'src/stories/index.js' .)
    </P>
  </Main>
);

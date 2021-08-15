import styled from '@emotion/native';
import React from 'react';
import { Linking, View } from 'react-native';

const Paragraph = styled.Text(() => ({
  marginBottom: 10,
}));
const LinkText = styled.Text(() => ({
  color: 'blue',
}));

const NoControlsWarning = () => {
  return (
    <View>
      <Paragraph>This story is not configured to handle controls.</Paragraph>
      <Paragraph>
        <LinkText
          onPress={() => Linking.openURL('https://storybook.js.org/docs/react/essentials/controls')}
        >
          Learn how to add controls
        </LinkText>{' '}
        and see{' '}
        <LinkText
          onPress={() =>
            Linking.openURL(
              'https://github.com/storybookjs/react-native/tree/next-6.0/examples/native/components/ControlExamples'
            )
          }
        >
          examples in the Storybook React Native repository.
        </LinkText>
      </Paragraph>
    </View>
  );
};

export default NoControlsWarning;

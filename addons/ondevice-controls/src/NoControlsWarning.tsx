import styled from '@emotion/native';
import React from 'react';
import { Linking } from 'react-native';

const Paragraph = styled.Text(({ theme }) => ({
  marginBottom: theme.tokens.spacing3,
}));
const LinkText = styled.Text(({ theme }) => ({
  color: theme.text.linkColor,
}));

const NoControlsWarning = () => {
  return (
    <>
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
              'https://github.com/storybookjs/react-native/tree/next-6.0/examples/expo-example/components/ControlExamples'
            )
          }
        >
          examples in the Storybook React Native repository.
        </LinkText>
      </Paragraph>
    </>
  );
};

export default NoControlsWarning;

import { styled } from '@storybook/react-native-theming';
import { Linking, View } from 'react-native';

const Paragraph = styled.Text(({ theme }) => ({
  marginBottom: theme.tokens.spacing3,
  color: theme.text.primaryColor,
}));

const LinkText = styled.Text(({ theme }) => ({
  color: theme.text.linkColor,
}));

const NoControlsWarning = () => {
  return (
    <View style={{ padding: 10 }}>
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
    </View>
  );
};

export default NoControlsWarning;

// fixes fast refresh on web
import '@expo/metro-runtime';

import { storybookSwitcher } from '@storybook/react-native/switcher';
import { Text, View } from 'react-native';

export default storybookSwitcher({
  requireStorybook: () => require('./.rnstorybook'),
  Alternate: () => (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>{"didn't get storybook enabled flag"}</Text>
    </View>
  ),
});

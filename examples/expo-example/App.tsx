// fixes fast refresh on web
import '@expo/metro-runtime';

import SBRoot, { showStorybook } from './.rnstorybook';
import { Button, View, Text } from 'react-native';

export default function App() {
  return (
    <SBRoot>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>This is the user&apos;s app</Text>
        <Button title="Show Storybook" onPress={() => showStorybook(true)} />
      </View>
    </SBRoot>
  );
}

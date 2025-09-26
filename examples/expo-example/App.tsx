// fixes fast refresh on web
import '@expo/metro-runtime';
import { Text, View } from 'react-native';

function App() {
  return (
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
  );
}

const StorybookSwitcher = ({
  enabled,
  requireFunction,
  App,
}: {
  requireFunction: () => ReturnType<typeof require>;
  enabled: boolean;
  App: React.ComponentType<any>;
}) => {
  if (enabled) {
    return requireFunction().default;
  }
  return App;
};

export default StorybookSwitcher({
  App,
  requireFunction: () => require('./.rnstorybook'),
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',
});

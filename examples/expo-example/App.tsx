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
      <Text>didn't get storybook enabled flag</Text>
    </View>
  );
}

let AppEntryPoint = App;

if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true') {
  AppEntryPoint = require('./.storybook').default;
}

export default AppEntryPoint;

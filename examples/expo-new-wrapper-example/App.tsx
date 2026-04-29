import { SafeAreaView, Text, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
          Real app placeholder
        </Text>
        <Text style={{ textAlign: 'center', color: '#555' }}>
          Storybook is disabled. Run `pnpm storybook` (sets EXPO_PUBLIC_STORYBOOK_ENABLED=true) to
          launch the on-device Storybook UI instead.
        </Text>
      </View>
    </SafeAreaView>
  );
}

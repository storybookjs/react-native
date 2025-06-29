import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { LayoutProvider } from '@storybook/react-native-ui-common';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme, ThemeProvider } from '@storybook/react-native-theming';

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <LayoutProvider>
              <Story />
            </LayoutProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  ),
];

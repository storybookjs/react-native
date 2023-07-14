import '@emotion/react';

import { Theme as StorybookTheme } from '@storybook/react-native-theming';

declare module '@emotion/react' {
  export interface Theme extends StorybookTheme {}
}

// this file is only actually used in development
// for prod/dist bundles we are bundling Emotion into our package

import '@emotion/react';

declare module '@emotion/react' {
  type StorybookTheme = import('./theme').StorybookTheme;
  export interface Theme extends StorybookTheme {}
}

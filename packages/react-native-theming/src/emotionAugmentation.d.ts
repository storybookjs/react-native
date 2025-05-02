// this file is only actually used in development
// for prod/dist bundles we are bundling Emotion into our package

import '@emotion/react';

declare module '@emotion/react' {
  type StorybookTheme = import('./theme').StorybookTheme;

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Theme extends StorybookTheme {}
}

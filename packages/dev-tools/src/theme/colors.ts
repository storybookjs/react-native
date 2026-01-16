/**
 * Storybook Dark Theme Color Palette
 */
export const colors = {
  // Primary
  primary: '#FF4785',
  secondary: '#029CFD',

  // Accent
  seafoam: '#37D5D3',
  purple: '#6F2CAC',
  green: '#66BF3C',

  // Backgrounds
  appBg: '#222425',
  appContentBg: '#1B1C1D',
  barBg: '#292C2E',

  // Text
  textColor: '#C9CDCF',
  textMutedColor: '#798186',
  mediumdark: '#73828C',

  // Borders & Status
  border: 'rgba(255,255,255,0.1)',
  positive: '#66BF3C',
  negative: '#FF4400',
  warning: '#E69D00',
} as const;

export type Colors = typeof colors;

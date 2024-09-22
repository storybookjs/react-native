import type { TextStyle } from 'react-native';
import { StorybookThemeWeb, background, color, dark, light } from './web-theme';

export type StorybookTheme = StorybookThemeWeb;

export const typography = {
  weight: {
    regular: '400' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
  },
  size: {
    s1: 12,
    s2: 14,
    s3: 16,
    m1: 20,
    m2: 24,
    m3: 28,
    l1: 32,
    l2: 40,
    l3: 48,
    code: 90,
  },
} as const;

export const theme: StorybookThemeWeb = {
  base: 'light',
  textMutedColor: color.dark,
  color: {
    primary: light.colorPrimary,
    secondary: light.colorSecondary,
    secondaryLighter: color.secondaryLighter,
    tertiary: color.tertiary,
    ancillary: color.ancillary,

    // Complimentary
    orange: color.orange,
    gold: color.gold,
    green: color.green,
    seafoam: color.seafoam,
    purple: color.purple,
    ultraviolet: color.ultraviolet,

    // Monochrome
    lightest: color.lightest,
    lighter: color.lighter,
    light: color.light,
    mediumlight: color.mediumlight,
    medium: color.medium,
    mediumdark: color.mediumdark,
    dark: color.dark,
    darker: color.darker,
    darkest: color.darkest,

    // For borders
    border: color.border,

    // Status
    positive: color.positive,
    negative: color.negative,
    warning: color.warning,
    critical: color.critical,

    defaultText: light.textColor || color.darkest,
    inverseText: light.textInverseColor || color.lightest,
    positiveText: color.positiveText,
    negativeText: color.negativeText,
    warningText: color.warningText,
  },
  background: {
    app: light.appBg,
    bar: light.barBg,
    content: light.appContentBg,
    preview: light.appPreviewBg,
    gridCellSize: light.gridCellSize || background.gridCellSize,
    hoverable: background.hoverable,
    positive: background.positive,
    negative: background.negative,
    warning: background.warning,
    critical: background.critical,
  },
  typography: {
    weight: typography.weight,
    size: typography.size,
  },

  input: {
    background: light.inputBg,
    border: light.inputBorder,
    borderRadius: light.inputBorderRadius,
    color: light.inputTextColor,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  button: {
    background: light.buttonBg || light.inputBg,
    border: light.buttonBorder || light.inputBorder,
  },

  boolean: {
    background: light.booleanBg || light.inputBorder,
    selectedBackground: light.booleanSelectedBg || light.inputBg,
  },

  // UI
  layoutMargin: 10,
  appBorderColor: light.appBorderColor,
  appBorderRadius: light.appBorderRadius,

  // Toolbar default/active colors
  barTextColor: light.barTextColor,
  barHoverColor: light.barHoverColor || light.colorSecondary,
  barSelectedColor: light.barSelectedColor || light.colorSecondary,
  barBg: light.barBg,

  // Brand logo/text
  brand: {
    title: light.brandTitle,
    url: light.brandUrl,
    image: light.brandImage || (light.brandTitle ? null : undefined),
    target: light.brandTarget,
  },
};

export const darkTheme: StorybookThemeWeb = {
  base: 'dark',
  textMutedColor: '#798186',
  color: {
    primary: dark.colorPrimary,
    secondary: dark.colorSecondary,
    secondaryLighter: color.secondaryLighter,
    tertiary: color.tertiary,
    ancillary: color.ancillary,

    // Complimentary
    orange: color.orange,
    gold: color.gold,
    green: color.green,
    seafoam: color.seafoam,
    purple: color.purple,
    ultraviolet: color.ultraviolet,

    // Monochrome
    lightest: color.lightest,
    lighter: color.lighter,
    light: color.light,
    mediumlight: color.mediumlight,
    medium: color.medium,
    mediumdark: color.mediumdark,
    dark: color.dark,
    darker: color.darker,
    darkest: color.darkest,

    // For borders
    border: color.border,

    // Status
    positive: color.positive,
    negative: color.negative,
    warning: color.warning,
    critical: color.critical,

    defaultText: dark.textColor || color.darkest,
    inverseText: dark.textInverseColor || color.lightest,
    positiveText: color.positiveText,
    negativeText: color.negativeText,
    warningText: color.warningText,
  },
  background: {
    app: dark.appBg,
    bar: dark.barBg,
    content: dark.appContentBg,
    preview: dark.appPreviewBg,
    gridCellSize: dark.gridCellSize || background.gridCellSize,
    hoverable: background.hoverable,
    positive: background.positive,
    negative: background.negative,
    warning: background.warning,
    critical: background.critical,
  },

  typography: {
    weight: typography.weight,
    size: typography.size,
  },

  input: {
    background: dark.inputBg,
    border: dark.inputBorder,
    borderRadius: dark.inputBorderRadius,
    color: dark.inputTextColor,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  button: {
    background: dark.buttonBg || dark.inputBg,
    border: dark.buttonBorder || dark.inputBorder,
  },

  boolean: {
    background: dark.booleanBg || dark.inputBorder,
    selectedBackground: dark.booleanSelectedBg || dark.inputBg,
  },

  // UI
  layoutMargin: 10,
  appBorderColor: dark.appBorderColor,
  appBorderRadius: dark.appBorderRadius,

  // Toolbar default/active colors
  barTextColor: dark.barTextColor,
  barHoverColor: dark.barHoverColor || dark.colorSecondary,
  barSelectedColor: dark.barSelectedColor || dark.colorSecondary,
  barBg: dark.barBg,

  // Brand logo/text
  brand: {
    title: dark.brandTitle,
    url: dark.brandUrl,
    image: dark.brandImage || (dark.brandTitle ? null : undefined),
    target: dark.brandTarget,
  },
};

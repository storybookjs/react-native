import { ShadowStyleIOS, ViewStyle, TextStyle } from 'react-native';
import { StorybookThemeWeb, background, color, light, dark } from './newTheme';

type ShadowStyle = ShadowStyleIOS | Pick<ViewStyle, 'elevation'>;

type FontWeight = TextStyle['fontWeight'];

/**
 * Primitive tokens used to build the theme.
 *
 * Ideally components should not use these values directly, and should prefer
 * to use more semantic values from the theme.
 */
interface ThemeTokens {
  spacing1: number;
  spacing2: number;
  spacing3: number;
  spacing4: number;
  spacing5: number;
  spacing6: number;
  fontSize: {
    small: number;
    smaller: number;
    normal: number;
  };
  color: {
    navy: string;
    offBlack: string;
    black: string;
    white: string;
    grey200: string;
    grey700: string;
    grey800: string;
    red500: string;
    blue100: string;
    blue200: string;
    blue250: string;
    blue300: string;
    blue400: string;
    blue600: string;
    green500: string;
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
    round: number;
  };
  borderWidthNormal: number;
  /** Elevation shadows */
  elevation: {
    floating: ShadowStyle;
  };
}

interface ThemeButton {
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
}

export interface StorybookTheme extends StorybookThemeWeb {
  tokens: ThemeTokens;
  backgroundColor: string;
  text: {
    primaryColor: string;
    secondaryColor: string;
    linkColor: string;
  };
  preview: {
    containerBackgroundColor: string;
    backgroundColor: string;
  };
  /** Navigation bar and related area */
  navigation: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    visibilityBorderRadius: number;
    visibilityInnerBorderColor: string;
    visibilityOuterBorderColor: string;
  };
  /** Side panels (Story list, addons) */
  panel: {
    backgroundColor: string;
    borderWidth: number;
    borderColor: string;
    paddingVertical: number;
    paddingHorizontal: number;
  };
  /** Story list and list items */
  storyList: {
    fontSize: number;
    headerPaddingHorizontal: number;
    headerPaddingVertical: number;
    headerTextColor: string;
    headerFontWeight: FontWeight;
    storyPaddingHorizontal: number;
    storyPaddingVertical: number;
    storyIndent: number;
    storyTextColor: string;
    storyFontWeight: FontWeight;
    storySelectedBackgroundColor: string;
    storySelectedTextColor: string;
    storySelectedFontWeight: FontWeight;
    sectionSpacing: number;
    sectionActiveBackgroundColor: string;
    sectionBorderRadius: number;
    search: {
      fontSize: number;
      textColor: string;
      placeholderTextColor: string;
      borderRadius: number;
      borderColor: string;
      borderWidth: number;
      backgroundColor: string;
      paddingVertical: number;
      paddingHorizontal: number;
    };
  };
  /** Buttons */
  button: {
    fontSize: number;
    fontWeight: FontWeight;
    paddingVertical: number;
    paddingHorizontal: number;
    primary: ThemeButton;
    secondary: ThemeButton;
  };
  /** Tabs (navigation and addons) */
  tabs: {
    fontSize: number;
    fontWeight: FontWeight;
    paddingVertical: number;
    paddingHorizontal: number;
    borderWidth: number;
    borderRadius: number;
    activeBorderColor: string;
    activeBackgroundColor: string;
    activeTextColor: string;
    inactiveBorderColor: string;
    inactiveBackgroundColor: string;
    inactiveTextColor: string;
  };
  /** Inputs (text, radio, slider, etc.) */
  inputs: {
    errorTextColor: string;
    labelFontSize: number;
    labelTextColor: string;
    text: {
      fontSize: number;
      textColor: string;
      borderWidth: number;
      borderColor: string;
      backgroundColor: string;
      borderRadius: number;
      paddingVertical: number;
      paddingHorizontal: number;
    };
    radio: {
      fontSize: number;
      height: number;
      borderWidth: number;
      borderColor: string;
      backgroundColor: string;
      paddingVertical: number;
      paddingHorizontal: number;
      activeBackgroundColor: string;
      itemSpacing: number;
      labelSpacing: number;
    };
    swatch: {
      fontSize: number;
      height: number;
      borderWidth: number;
      borderColor: string;
      backgroundColor: string;
      outerBorderRadius: number;
      innerBorderRadius: number;
      paddingVertical: number;
      paddingHorizontal: number;
      nameTextWeight: FontWeight;
    };
    slider: {
      fontSize: number;
      labelTextColor: string;
      valueTextColor: string;
    };
  };
}

const tokens: ThemeTokens = {
  spacing1: 4,
  spacing2: 8,
  spacing3: 12,
  spacing4: 16,
  spacing5: 20,
  spacing6: 24,
  fontSize: {
    small: 12,
    smaller: 14,
    normal: 16,
  },
  color: {
    navy: '#001a23',
    black: '#000',
    offBlack: '#222',
    white: '#ffffff',
    grey200: '#dee2e3',
    grey700: '#859499',
    grey800: '#575757',
    red500: '#ff4400',
    blue100: '#f6f9fc',
    blue200: '#e0eaf5',
    blue250: '#dcebf9',
    blue300: '#b2cbe6',
    blue400: '#a3c1e0',
    blue600: '#1ea7fd',
    green500: '#66bf3c',
  },
  borderRadius: {
    small: 4,
    medium: 6,
    large: 8,
    round: 100,
  },
  borderWidthNormal: 1,
  elevation: {
    floating: {
      shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 16,
      elevation: 10,
    },
  },
} as const;

const text: StorybookTheme['text'] = {
  primaryColor: tokens.color.navy,
  secondaryColor: tokens.color.grey700,
  linkColor: '#0000ff',
};

const textOnDark: StorybookTheme['text'] = {
  primaryColor: tokens.color.white,
  secondaryColor: tokens.color.grey200,
  linkColor: tokens.color.blue600,
};
export const typography = {
  weight: {
    regular: 400,
    bold: 700,
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
};

export const theme: StorybookTheme = {
  base: 'light',
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
  },

  button$: {
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

  // ONDEVICE
  tokens,
  text,
  backgroundColor: tokens.color.white,
  preview: {
    containerBackgroundColor: tokens.color.white,
    backgroundColor: tokens.color.white,
  },
  navigation: {
    backgroundColor: tokens.color.white,
    borderColor: tokens.color.grey200,
    borderWidth: tokens.borderWidthNormal,
    visibilityBorderRadius: tokens.borderRadius.small,
    visibilityInnerBorderColor: tokens.color.grey700,
    visibilityOuterBorderColor: tokens.color.white,
  },
  panel: {
    backgroundColor: tokens.color.blue100,
    borderWidth: tokens.borderWidthNormal,
    borderColor: tokens.color.blue200,
    paddingVertical: 0,
    paddingHorizontal: tokens.spacing2,
  },
  storyList: {
    fontSize: tokens.fontSize.normal,
    headerPaddingHorizontal: tokens.spacing2,
    headerPaddingVertical: tokens.spacing2,
    headerTextColor: text.primaryColor,
    headerFontWeight: '500',
    storyPaddingHorizontal: tokens.spacing2,
    storyPaddingVertical: tokens.spacing1 * 1.5,
    storyIndent: tokens.spacing6,
    storyTextColor: text.primaryColor,
    storyFontWeight: '400',
    storySelectedBackgroundColor: tokens.color.blue600,
    storySelectedTextColor: tokens.color.white,
    storySelectedFontWeight: '700',
    sectionSpacing: tokens.spacing2,
    sectionActiveBackgroundColor: tokens.color.blue200,
    sectionBorderRadius: tokens.borderRadius.medium,
    search: {
      fontSize: tokens.fontSize.normal,
      textColor: text.primaryColor,
      placeholderTextColor: text.secondaryColor,
      borderRadius: tokens.borderRadius.round,
      borderColor: tokens.color.blue400,
      borderWidth: tokens.borderWidthNormal,
      backgroundColor: tokens.color.white,
      paddingVertical: tokens.spacing2,
      paddingHorizontal: tokens.spacing3,
    },
  },
  button: {
    fontSize: tokens.fontSize.smaller,
    fontWeight: '600',
    paddingVertical: tokens.spacing2,
    paddingHorizontal: tokens.spacing5,
    primary: {
      textColor: text.primaryColor,
      backgroundColor: tokens.color.blue250,
      borderColor: tokens.color.blue300,
      borderWidth: tokens.borderWidthNormal,
      borderRadius: tokens.borderRadius.medium,
    },
    secondary: {
      textColor: text.primaryColor,
      backgroundColor: 'transparent',
      borderColor: tokens.color.blue300,
      borderWidth: tokens.borderWidthNormal,
      borderRadius: tokens.borderRadius.medium,
    },
  },
  tabs: {
    fontSize: tokens.fontSize.small,
    fontWeight: '500',
    paddingVertical: tokens.spacing2,
    paddingHorizontal: tokens.spacing2 * 1.25,
    borderWidth: tokens.borderWidthNormal,
    borderRadius: tokens.borderRadius.round,
    activeBorderColor: tokens.color.blue300,
    activeBackgroundColor: tokens.color.blue250,
    activeTextColor: text.primaryColor,
    inactiveBorderColor: 'transparent',
    inactiveBackgroundColor: 'transparent',
    inactiveTextColor: text.secondaryColor,
  },
  inputs: {
    errorTextColor: tokens.color.red500,
    labelFontSize: tokens.fontSize.smaller,
    labelTextColor: text.primaryColor,
    text: {
      fontSize: tokens.fontSize.smaller,
      textColor: text.primaryColor,
      borderWidth: tokens.borderWidthNormal,
      borderColor: tokens.color.blue400,
      backgroundColor: tokens.color.white,
      borderRadius: tokens.borderRadius.medium,
      paddingVertical: tokens.spacing1 * 1.5,
      paddingHorizontal: tokens.spacing1 * 1.5,
    },
    radio: {
      fontSize: tokens.fontSize.smaller,
      height: 20,
      borderWidth: tokens.borderWidthNormal,
      borderColor: tokens.color.blue400,
      backgroundColor: tokens.color.white,
      paddingVertical: 3,
      paddingHorizontal: 3,
      activeBackgroundColor: tokens.color.green500,
      itemSpacing: tokens.spacing1,
      labelSpacing: tokens.spacing2,
    },
    swatch: {
      fontSize: tokens.fontSize.smaller,
      height: 40,
      borderWidth: tokens.borderWidthNormal,
      borderColor: tokens.color.blue400,
      backgroundColor: tokens.color.white,
      outerBorderRadius: tokens.borderRadius.medium,
      innerBorderRadius: tokens.borderRadius.small,
      paddingVertical: tokens.spacing1,
      paddingHorizontal: tokens.spacing1,
      nameTextWeight: '600',
    },
    slider: {
      fontSize: tokens.fontSize.smaller,
      labelTextColor: text.secondaryColor,
      valueTextColor: text.primaryColor,
    },
  },
};

export const darkTheme: StorybookTheme = {
  base: 'dark',
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
  },

  button$: {
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

  // ondevice
  tokens,
  text: textOnDark,
  backgroundColor: tokens.color.offBlack,
  preview: {
    containerBackgroundColor: tokens.color.black,
    backgroundColor: tokens.color.offBlack,
  },
  navigation: {
    backgroundColor: tokens.color.offBlack, //tokens.color.black,
    borderColor: tokens.color.grey800,
    borderWidth: tokens.borderWidthNormal,
    visibilityBorderRadius: tokens.borderRadius.small,
    visibilityInnerBorderColor: tokens.color.navy,
    visibilityOuterBorderColor: tokens.color.navy,
  },
  panel: {
    backgroundColor: tokens.color.offBlack, //tokens.color.blue100,
    borderWidth: tokens.borderWidthNormal,
    borderColor: tokens.color.grey800,
    paddingVertical: 0,
    paddingHorizontal: tokens.spacing2,
  },
  storyList: {
    fontSize: tokens.fontSize.normal,
    headerPaddingHorizontal: tokens.spacing2,
    headerPaddingVertical: tokens.spacing2,
    headerTextColor: textOnDark.primaryColor,
    headerFontWeight: '500',
    storyPaddingHorizontal: tokens.spacing2,
    storyPaddingVertical: tokens.spacing1 * 1.5,
    storyIndent: tokens.spacing6,
    storyTextColor: textOnDark.primaryColor,
    storyFontWeight: '400',
    storySelectedBackgroundColor: tokens.color.navy,
    storySelectedTextColor: tokens.color.white,
    storySelectedFontWeight: '700',
    sectionSpacing: tokens.spacing2,
    sectionActiveBackgroundColor: tokens.color.grey800,
    sectionBorderRadius: tokens.borderRadius.medium,
    search: {
      fontSize: tokens.fontSize.normal,
      textColor: textOnDark.primaryColor,
      placeholderTextColor: textOnDark.secondaryColor,
      borderRadius: tokens.borderRadius.round,
      borderColor: tokens.color.grey800, //tokens.color.blue400,
      borderWidth: tokens.borderWidthNormal,
      backgroundColor: tokens.color.grey800,
      paddingVertical: tokens.spacing2,
      paddingHorizontal: tokens.spacing3,
    },
  },
  button: {
    fontSize: tokens.fontSize.smaller,
    fontWeight: '600',
    paddingVertical: tokens.spacing2,
    paddingHorizontal: tokens.spacing5,
    primary: {
      textColor: textOnDark.primaryColor,
      backgroundColor: tokens.color.black,
      borderColor: tokens.color.blue300,
      borderWidth: tokens.borderWidthNormal,
      borderRadius: tokens.borderRadius.medium,
    },
    secondary: {
      textColor: textOnDark.primaryColor,
      backgroundColor: 'transparent',
      borderColor: tokens.color.blue300,
      borderWidth: tokens.borderWidthNormal,
      borderRadius: tokens.borderRadius.medium,
    },
  },
  tabs: {
    fontSize: tokens.fontSize.small,
    fontWeight: '500',
    paddingVertical: tokens.spacing2,
    paddingHorizontal: tokens.spacing2 * 1.25,
    borderWidth: tokens.borderWidthNormal,
    borderRadius: tokens.borderRadius.round,
    activeBorderColor: tokens.color.blue300,
    activeBackgroundColor: tokens.color.navy,
    activeTextColor: textOnDark.primaryColor,
    inactiveBorderColor: 'transparent',
    inactiveBackgroundColor: 'transparent',
    inactiveTextColor: textOnDark.secondaryColor,
  },
  inputs: {
    errorTextColor: tokens.color.red500,
    labelFontSize: tokens.fontSize.smaller,
    labelTextColor: textOnDark.primaryColor,
    text: {
      fontSize: tokens.fontSize.smaller,
      textColor: textOnDark.primaryColor,
      borderWidth: tokens.borderWidthNormal,
      borderColor: tokens.color.blue400,
      backgroundColor: tokens.color.black,
      borderRadius: tokens.borderRadius.medium,
      paddingVertical: tokens.spacing1 * 1.5,
      paddingHorizontal: tokens.spacing1 * 1.5,
    },
    radio: {
      fontSize: tokens.fontSize.smaller,
      height: 20,
      borderWidth: tokens.borderWidthNormal,
      borderColor: tokens.color.blue400,
      backgroundColor: tokens.color.black,
      paddingVertical: 3,
      paddingHorizontal: 3,
      activeBackgroundColor: tokens.color.green500,
      itemSpacing: tokens.spacing1,
      labelSpacing: tokens.spacing2,
    },
    swatch: {
      fontSize: tokens.fontSize.smaller,
      height: 40,
      borderWidth: tokens.borderWidthNormal,
      borderColor: tokens.color.blue400,
      backgroundColor: tokens.color.navy,
      outerBorderRadius: tokens.borderRadius.medium,
      innerBorderRadius: tokens.borderRadius.small,
      paddingVertical: tokens.spacing1,
      paddingHorizontal: tokens.spacing1,
      nameTextWeight: '600',
    },
    slider: {
      fontSize: tokens.fontSize.smaller,
      labelTextColor: textOnDark.secondaryColor,
      valueTextColor: textOnDark.primaryColor,
    },
  },
};

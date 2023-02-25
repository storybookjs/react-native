import { Animated, I18nManager, Insets } from 'react-native';
import { PreviewDimens } from './absolute-positioned-keyboard-aware-view';
import { NAVIGATOR, PREVIEW, ADDONS } from './navigation/constants';

// Factor that will flip the animation orientation in RTL locales.
const RTL_SCALE = I18nManager.isRTL ? -1 : 1;
// Percentage to scale the preview area by when opening a panel.
const PREVIEW_SCALE = 0.3;
// Percentage to scale the preview area by when opening a panel, on wide screens.
const PREVIEW_SCALE_WIDE = 0.7;
// Percentage to shrink the visible preview by, without affecting the panel size.
const PREVIEW_SCALE_SHRINK = 0.9;
const SCALE_OFFSET = 0.025;
const TRANSLATE_Y_OFFSET = 12;

const panelWidth = (width: number, wide: boolean) => {
  const scale = wide ? PREVIEW_SCALE_WIDE : PREVIEW_SCALE;
  return width * (1 - scale - SCALE_OFFSET);
};

export const getNavigatorPanelPosition = (
  animatedValue: Animated.Value,
  previewWidth: number,
  wide: boolean
) => {
  return [
    {
      transform: [
        {
          translateX: animatedValue.interpolate({
            inputRange: [NAVIGATOR, PREVIEW],
            outputRange: [0, (-panelWidth(previewWidth, wide) - 1) * RTL_SCALE],
          }),
        },
      ],
      width: panelWidth(previewWidth, wide),
    },
  ];
};

export const getAddonPanelPosition = (
  animatedValue: Animated.Value,
  previewWidth: number,
  wide: boolean
) => {
  return [
    {
      transform: [
        {
          translateX: animatedValue.interpolate({
            inputRange: [PREVIEW, ADDONS],
            outputRange: [
              previewWidth * RTL_SCALE,
              (previewWidth - panelWidth(previewWidth, wide)) * RTL_SCALE,
            ],
          }),
        },
      ],
      width: panelWidth(previewWidth, wide),
    },
  ];
};

type PreviewPositionArgs = {
  animatedValue: Animated.Value;
  previewDimensions: PreviewDimens;
  wide: boolean;
  insets: Insets;
  tabOpen: number;
  lastTabOpen: number;
};

/**
 * Build the animated style for the preview container view.
 *
 * When the navigator or addons panel is focused, the preview container is
 * scaled down and translated to the left (or right) of the panel.
 */
export const getPreviewStyle = ({
  animatedValue,
  previewDimensions: { width: previewWidth, height: previewHeight },
  wide,
  insets,
  tabOpen,
  lastTabOpen,
}: PreviewPositionArgs) => {
  const scale = (wide ? PREVIEW_SCALE_WIDE : PREVIEW_SCALE) * PREVIEW_SCALE_SHRINK;
  const scaledPreviewWidth = previewWidth * scale;
  const scaledPreviewHeight = previewHeight * scale;
  // Horizontally center the scaled preview in the available space beside the panel.
  const nonPanelWidth = previewWidth - panelWidth(previewWidth, wide);
  const translateXOffset = (nonPanelWidth - scaledPreviewWidth) / 2;
  const translateX = (previewWidth / 2 - (previewWidth * scale) / 2 - translateXOffset) * RTL_SCALE;
  // Translate the preview to the top edge of the screen, move it down by the
  // safe area inset, then by the preview Y offset.
  const translateY =
    -(previewHeight / 2 - scaledPreviewHeight / 2) + insets.top + TRANSLATE_Y_OFFSET;
  // Is navigation moving from one panel to another, skipping preview?
  const skipPreview = lastTabOpen !== PREVIEW && tabOpen !== PREVIEW;

  return {
    transform: [
      {
        translateX: animatedValue.interpolate({
          inputRange: [NAVIGATOR, PREVIEW, ADDONS],
          outputRange: [translateX, 0, -translateX],
        }),
      },
      {
        translateY: animatedValue.interpolate({
          inputRange: [NAVIGATOR, PREVIEW, ADDONS],
          outputRange: [translateY, skipPreview ? translateY : 0, translateY],
        }),
      },
      {
        scale: animatedValue.interpolate({
          inputRange: [NAVIGATOR, PREVIEW, ADDONS],
          outputRange: [scale, skipPreview ? scale : 1, scale],
        }),
      },
    ],
  };
};

/**
 * Build the animated shadow style for the preview.
 *
 * When the navigator or addons panel are visible the scaled preview will have
 * a shadow, and when going to the preview tab the shadow will be invisible.
 */
export const getPreviewShadowStyle = (animatedValue: Animated.Value) => ({
  elevation: 8,
  shadowColor: '#000',
  shadowOpacity: animatedValue.interpolate({
    inputRange: [NAVIGATOR, PREVIEW, ADDONS],
    outputRange: [0.25, 0, 0.25],
  }),
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 0 },
  overflow: 'visible' as const,
});

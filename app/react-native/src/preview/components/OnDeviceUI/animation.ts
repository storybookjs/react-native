import { Animated, I18nManager } from 'react-native';
import { PreviewDimens } from './absolute-positioned-keyboard-aware-view';
import { NAVIGATOR, PREVIEW, ADDONS } from './navigation/constants';

const RTL_SCALE = I18nManager.isRTL ? -1 : 1;
const PREVIEW_SCALE = 0.3;
const PREVIEW_WIDE_SCREEN = 0.7;
const SCALE_OFFSET = 0.025;
const TRANSLATE_X_OFFSET = 6;
const TRANSLATE_Y_OFFSET = 12;

const panelWidth = (width: number, wide: boolean) => {
  const scale = wide ? PREVIEW_WIDE_SCREEN : PREVIEW_SCALE;
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
  slideBetweenAnimation: boolean;
  wide: boolean;
};

export const getPreviewPosition = ({
  animatedValue,
  previewDimensions: { width: previewWidth, height: previewHeight },
  slideBetweenAnimation,
  wide,
}: PreviewPositionArgs) => {
  const scale = wide ? PREVIEW_WIDE_SCREEN : PREVIEW_SCALE;
  const translateX =
    (previewWidth / 2 - (previewWidth * scale) / 2 - TRANSLATE_X_OFFSET) * RTL_SCALE;
  const translateY = -(previewHeight / 2 - (previewHeight * scale) / 2 - TRANSLATE_Y_OFFSET);

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
          outputRange: [translateY, slideBetweenAnimation ? translateY : 0, translateY],
        }),
      },
    ],
  };
};

export const getPreviewScale = (
  animatedValue: Animated.Value,
  slideBetweenAnimation: boolean,
  wide: boolean
) => {
  const scale = wide ? PREVIEW_WIDE_SCREEN : PREVIEW_SCALE;
  return {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [NAVIGATOR, PREVIEW, ADDONS],
          outputRange: [scale, slideBetweenAnimation ? scale : 1, scale],
        }),
      },
    ],
  };
};

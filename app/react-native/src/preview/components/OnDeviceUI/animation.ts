import { Animated } from 'react-native';
import { PreviewDimens } from './absolute-positioned-keyboard-aware-view';
import { NAVIGATOR, PREVIEW, ADDONS } from './navigation/constants';

const PREVIEW_SCALE = 0.3;
const PREVIEW_WIDE_SCREEN = 0.7;

const panelWidth = (width: number, wide: boolean) => {
  const scale = wide ? PREVIEW_WIDE_SCREEN : PREVIEW_SCALE;
  return width * (1 - scale - 0.025);
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
            outputRange: [0, -panelWidth(previewWidth, wide) - 1],
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
            outputRange: [previewWidth, previewWidth - panelWidth(previewWidth, wide)],
          }),
        },
      ],
      width: panelWidth(previewWidth, wide),
    },
  ];
};

export const getPreviewPosition = (
  animatedValue: Animated.Value,
  { width: previewWidth, height: previewHeight }: PreviewDimens,
  slideBetweenAnimation: boolean,
  wide: boolean
) => {
  const scale = wide ? PREVIEW_WIDE_SCREEN : PREVIEW_SCALE;
  const translateX = previewWidth / 2 - (previewWidth * scale) / 2 - 6;
  const translateY = -(previewHeight / 2 - (previewHeight * scale) / 2 - 12);

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

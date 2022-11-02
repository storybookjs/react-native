import { Animated } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';
import { PreviewDimens } from './absolute-positioned-keyboard-aware-view';
import { NAVIGATOR, PREVIEW, ADDONS } from './navigation/constants';

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

type PreviewPositionArgs = {
  animatedValue: Animated.Value;
  previewDimensions: PreviewDimens;
  slideBetweenAnimation: boolean;
  wide: boolean;
  noSafeArea: boolean;
  insets: EdgeInsets;
};

export const getPreviewPosition = ({
  animatedValue,
  previewDimensions: { width: previewWidth, height: previewHeight },
  slideBetweenAnimation,
  wide,
  noSafeArea,
  insets,
}: PreviewPositionArgs) => {
  const scale = wide ? PREVIEW_WIDE_SCREEN : PREVIEW_SCALE;
  const translateX = previewWidth / 2 - (previewWidth * scale) / 2 - TRANSLATE_X_OFFSET;
  const marginTop = noSafeArea ? 0 : insets.top;
  const translateY =
    -(previewHeight / 2 - (previewHeight * scale) / 2 - TRANSLATE_Y_OFFSET) + marginTop;

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
          outputRange: [translateY, slideBetweenAnimation ? translateY : marginTop, translateY],
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

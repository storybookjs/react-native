import { NAVIGATOR, PREVIEW, ADDONS } from './navigation/consts';

const PREVIEW_SCALE = 0.3;

const panelWidth = width => width * (1 - PREVIEW_SCALE - 0.05);

export function getNavigatorPanelPosition(animatedValue, previewWidth) {
  return [
    {
      transform: [
        {
          translateX: animatedValue.interpolate({
            inputRange: [NAVIGATOR, PREVIEW],
            outputRange: [0, -panelWidth(previewWidth) - 1],
          }),
        },
      ],
      width: panelWidth(previewWidth),
    },
  ];
}

export function getAddonPanelPosition(animatedValue, previewWidth) {
  return [
    {
      transform: [
        {
          translateX: animatedValue.interpolate({
            inputRange: [PREVIEW, ADDONS],
            outputRange: [previewWidth, previewWidth - panelWidth(previewWidth)],
          }),
        },
      ],
      width: panelWidth(previewWidth),
    },
  ];
}

export function getPreviewPosition(
  animatedValue,
  previewWidth,
  previewHeight,
  slideBetweenAnimation
) {
  const translateX = previewWidth / 2 - (previewWidth * PREVIEW_SCALE) / 2 - 6;
  const translateY = -(previewHeight / 2 - (previewHeight * PREVIEW_SCALE) / 2 - 12);

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
}

export function getPreviewScale(animatedValue, slideBetweenAnimation) {
  return {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [NAVIGATOR, PREVIEW, ADDONS],
          outputRange: [PREVIEW_SCALE, slideBetweenAnimation ? PREVIEW_SCALE : 1, PREVIEW_SCALE],
        }),
      },
    ],
  };
}

import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { useTheme } from '@storybook/react-native-theming';
import { useMemo } from 'react';

export function FullscreenIcon({ color, width = 14, height = 14, ...props }: SvgProps) {
  const theme = useTheme();

  const fillColor = useMemo(() => {
    return color ?? theme.color.defaultText;
  }, [color, theme.color.defaultText]);

  return (
    <Svg width={width} height={height} viewBox="0 0 14 14" fill="none" {...props}>
      <Path
        d="M1.5 1h2a.5.5 0 010 1h-.793l3.147 3.146a.5.5 0 11-.708.708L2 2.707V3.5a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5zm8.5.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-.793L8.854 5.854a.5.5 0 11-.708-.708L11.293 2H10.5a.5.5 0 01-.5-.5zm2.5 8.5a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 010-1h.793L8.146 8.854a.5.5 0 11.708-.708L12 11.293V10.5a.5.5 0 01.5-.5zM2 11.293V10.5a.5.5 0 00-1 0v2a.5.5 0 00.5.5h2a.5.5 0 000-1h-.793l3.147-3.146a.5.5 0 10-.708-.708L2 11.293z"
        fill={fillColor}
      />
    </Svg>
  );
}

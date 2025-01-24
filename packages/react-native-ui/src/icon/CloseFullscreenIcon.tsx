import { useMemo } from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { useTheme } from '@storybook/react-native-theming';

export function CloseFullscreenIcon({ color, width = 14, height = 14, ...props }: SvgProps) {
  const theme = useTheme();

  const fillColor = useMemo(() => {
    return color ?? theme.color.defaultText;
  }, [color, theme.color.defaultText]);

  return (
    <Svg fill={fillColor} height={height} viewBox="0 0 16 16" width={width} {...props}>
      <Path d="M5.5 0a.5.5 0 01.5.5v4A1.5 1.5 0 014.5 6h-4a.5.5 0 010-1h4a.5.5 0 00.5-.5v-4a.5.5 0 01.5-.5zm5 0a.5.5 0 01.5.5v4a.5.5 0 00.5.5h4a.5.5 0 010 1h-4A1.5 1.5 0 0110 4.5v-4a.5.5 0 01.5-.5zM0 10.5a.5.5 0 01.5-.5h4A1.5 1.5 0 016 11.5v4a.5.5 0 01-1 0v-4a.5.5 0 00-.5-.5h-4a.5.5 0 01-.5-.5zm10 1a1.5 1.5 0 011.5-1.5h4a.5.5 0 010 1h-4a.5.5 0 00-.5.5v4a.5.5 0 01-1 0v-4z" />
    </Svg>
  );
}

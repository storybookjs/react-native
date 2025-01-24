import { Path, Svg, SvgProps } from 'react-native-svg';
import { useTheme } from '@storybook/react-native-theming';
import { useMemo } from 'react';

export const CollapseAllIcon = ({
  color, //= '#2E3438',
  width = 14,
  height = 14,
  ...props
}: SvgProps) => {
  const theme = useTheme();

  const fillColor = useMemo(() => {
    return color ?? theme.color.defaultText;
  }, [color, theme.color.defaultText]);

  return (
    <Svg width={width} height={height} viewBox="0 0 14 14" fill="none" {...props}>
      <Path
        d="M3.354.146a.5.5 0 10-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 00-.708-.708L7 3.793 3.354.146zM6.646 9.146a.5.5 0 01.708 0l4 4a.5.5 0 01-.708.708L7 10.207l-3.646 3.647a.5.5 0 01-.708-.708l4-4z"
        fill={fillColor}
      />
    </Svg>
  );
};

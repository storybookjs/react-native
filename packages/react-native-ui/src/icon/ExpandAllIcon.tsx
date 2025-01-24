import { Path, Svg, SvgProps } from 'react-native-svg';
import { useTheme } from '@storybook/react-native-theming';
import { useMemo } from 'react';

export const ExpandAllIcon = ({
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
        d="M7.354.146l4 4a.5.5 0 01-.708.708L7 1.207 3.354 4.854a.5.5 0 11-.708-.708l4-4a.5.5 0 01.708 0zM11.354 9.146a.5.5 0 010 .708l-4 4a.5.5 0 01-.708 0l-4-4a.5.5 0 11.708-.708L7 12.793l3.646-3.647a.5.5 0 01.708 0z"
        fill={fillColor}
      />
    </Svg>
  );
};

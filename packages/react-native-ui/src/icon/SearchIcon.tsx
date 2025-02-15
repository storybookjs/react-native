import { Path, Svg, SvgProps } from 'react-native-svg';
import { useTheme } from '@storybook/react-native-theming';

export const SearchIcon = ({ width = 14, height = 14, ...props }: SvgProps) => {
  const theme = useTheme();
  return (
    <Svg width={width} height={height} viewBox="0 0 14 14" fill={theme.color.dark} {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.544 10.206a5.5 5.5 0 11.662-.662.5.5 0 01.148.102l3 3a.5.5 0 01-.708.708l-3-3a.5.5 0 01-.102-.148zM10.5 6a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
      />
    </Svg>
  );
};

import { Path, Svg, SvgProps } from 'react-native-svg';

export const MenuIcon = ({
  color = 'currentColor',
  width = 14,
  height = 14,
  ...props
}: SvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 14 14" fill="none" {...props}>
      <Path
        d="M13 3.5a.5.5 0 010 1H1a.5.5 0 010-1h12zM13.5 10a.5.5 0 00-.5-.5H1a.5.5 0 000 1h12a.5.5 0 00.5-.5zM13 6.5a.5.5 0 010 1H1a.5.5 0 010-1h12z"
        fill={color}
      />
    </Svg>
  );
};

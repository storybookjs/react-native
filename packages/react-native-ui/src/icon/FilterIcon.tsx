import { Path, Svg, SvgProps } from 'react-native-svg';

export const FilterIcon = ({
  color = 'currentColor',
  width = 14,
  height = 14,
  ...props
}: SvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 14 14" fill="none" {...props}>
      <Path
        d="M1 2a.5.5 0 000 1h12a.5.5 0 000-1H1zM3 5a.5.5 0 000 1h8a.5.5 0 000-1H3zM4.5 8.5A.5.5 0 015 8h4a.5.5 0 010 1H5a.5.5 0 01-.5-.5zM6.5 11a.5.5 0 000 1h1a.5.5 0 000-1h-1z"
        fill={color}
      />
    </Svg>
  );
};

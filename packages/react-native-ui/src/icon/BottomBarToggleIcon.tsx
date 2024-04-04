import { Path, Svg, SvgProps } from 'react-native-svg';

export const BottomBarToggleIcon = ({
  color = 'currentColor',
  width = 14,
  height = 14,
  ...props
}: SvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 14 14" fill="none" {...props}>
      <Path
        d="M3.5 10.004a.5.5 0 000 1h1a.5.5 0 000-1h-1zM6 10.504a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zM9.5 10.004a.5.5 0 000 1h1a.5.5 0 000-1h-1z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 12.504v-11a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5zm1-.5v-3h10v3H2zm4.5-4H2v-6h10v6H7.5V5.21l.646.646a.5.5 0 10.708-.707l-1.5-1.5a.5.5 0 00-.708 0l-1.5 1.5a.5.5 0 10.708.707l.646-.646v2.793z"
        fill={color}
      />
    </Svg>
  );
};

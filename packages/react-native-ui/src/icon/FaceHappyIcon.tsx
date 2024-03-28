import { Path, Svg, SvgProps } from 'react-native-svg';

export const FaceHappyIcon = ({ color, width = 14, height = 14, ...props }: SvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 14 14" fill="none" {...props}>
      <Path
        d="M3.968 8.75a.5.5 0 00-.866.5A4.498 4.498 0 007 11.5c1.666 0 3.12-.906 3.898-2.25a.5.5 0 10-.866-.5A3.498 3.498 0 017 10.5a3.498 3.498 0 01-3.032-1.75zM5.5 5a1 1 0 11-2 0 1 1 0 012 0zM9.5 6a1 1 0 100-2 1 1 0 000 2z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 7A7 7 0 110 7a7 7 0 0114 0zm-1 0A6 6 0 111 7a6 6 0 0112 0z"
        fill={color}
      />
    </Svg>
  );
};

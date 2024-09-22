import Svg, { Path, SvgProps } from 'react-native-svg';

export function ComponentIcon({ color = '#029CFD', ...props }: SvgProps) {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.5.004a2.5 2.5 0 00-2.5 2.5v7a2.5 2.5 0 002.5 2.5h7a2.5 2.5 0 002.5-2.5v-7a2.5 2.5 0 00-2.5-2.5h-7zm8.5 5.5H6.5v-4.5h3a1.5 1.5 0 011.5 1.5v3zm0 1v3a1.5 1.5 0 01-1.5 1.5h-3v-4.5H11zm-5.5 4.5v-4.5H1v3a1.5 1.5 0 001.5 1.5h3zM1 5.504h4.5v-4.5h-3a1.5 1.5 0 00-1.5 1.5v3z"
        fill={color}
      />
    </Svg>
  );
}

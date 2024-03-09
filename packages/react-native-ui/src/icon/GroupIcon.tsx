import Svg, { Path, SvgProps } from 'react-native-svg';

export function GroupIcon({ color = '#6F2CAC', ...props }: SvgProps) {
  return (
    <Svg width={15} height={15} viewBox="0 0 15 15" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.962 3.704L5.376 2.118H1.057v9.514h12.685V3.704h-6.78zM7.4 2.647L6.124 1.37a1.057 1.057 0 00-.748-.31H.53A.529.529 0 000 1.59v10.57c0 .292.237.529.529.529H14.27a.529.529 0 00.528-.529V3.175a.529.529 0 00-.528-.528H7.4z"
        fill={color}
      />
    </Svg>
  );
}

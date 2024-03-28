import Svg, { Path, SvgProps } from 'react-native-svg';

export function StoryIcon({ color = '#37D5D3', ...props }: SvgProps) {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 0h6c.237 0 .428.192.428.429V11.57c0 .224-.17.407-.389.427a.396.396 0 01-.318-.101L6 9.565l-2.721 2.332a.395.395 0 01-.325.1.429.429 0 01-.383-.426V.43C2.571.192 2.763 0 3 0zm.428 10.64l2.284-1.958.034-.028a.39.39 0 01.289-.081c.087.007.172.04.244.102L8.57 10.64V.857H3.428v9.783z"
        fill={color}
      />
    </Svg>
  );
}

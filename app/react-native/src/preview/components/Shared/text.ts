import styled from '@emotion/native';
import { EmotionProps } from './theme';

export const Header = styled.Text`
  font-size: 20;
  color: ${(props: EmotionProps) => props.theme.headerTextColor};
  ${(props: any) => props.selected && 'font-weight: bold;'}
`;

export const Name = styled.Text`
  font-size: 16;
  color: ${(props: EmotionProps) => props.theme.headerTextColor};
  ${(props: any) => props.selected && 'font-weight: bold;'}
`;

export const Label = styled.Text`
  font-size: 18;
  color: ${(props: EmotionProps) => props.theme.labelColor};
`;

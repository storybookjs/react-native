import styled from '@emotion/native';
import { EmotionProps } from './theme';

export const Header = styled.Text`
  margin-left: 10;
  font-size: 20;
  color: ${(props: EmotionProps) => props.theme.headerTextColor};
`;

export const Label = styled.Text`
  font-size: 18;
  color: ${(props: EmotionProps) => props.theme.labelColor};
`;

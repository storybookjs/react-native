import { styled } from '@storybook/react-native-theming';

interface SwatchProps {
  name: string;
  value: string;
  setBackground: (background: string) => void;
}

const PressableSwatch = styled.TouchableOpacity(({ theme }) => ({
  marginBottom: 10,
  borderWidth: 1,
  borderColor: theme.appBorderColor,
  borderRadius: 6,
  backgroundColor: theme.background.content,
  paddingVertical: 4,
  paddingHorizontal: 4,
}));

const ColorSwatch = styled.View<{ color: string }>(({ color, theme }) => ({
  height: 40,
  width: '100%',
  borderRadius: 4,
  backgroundColor: color,
  borderColor: theme.appBorderColor,
  borderWidth: 1,
}));

const ValueContainer = styled.View(() => ({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 4,
  paddingBottom: 0,
}));

const NameText = styled.Text(({ theme }) => ({
  fontSize: theme.typography.size.s2,
  color: theme.color.defaultText,
  fontWeight: theme.typography.weight.bold,
}));

const ValueText = styled.Text(({ theme }) => ({
  fontSize: theme.typography.size.s2,
  color: theme.color.defaultText,
}));

const Swatch = ({ name, value, setBackground }: SwatchProps) => (
  <PressableSwatch onPress={() => setBackground(value)}>
    <ColorSwatch color={value} />
    <ValueContainer>
      <NameText>{name}</NameText>
      <ValueText>{value}</ValueText>
    </ValueContainer>
  </PressableSwatch>
);

export default Swatch;

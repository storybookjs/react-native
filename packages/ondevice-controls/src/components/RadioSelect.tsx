import { styled } from '@storybook/react-native-theming';

interface RadioProps {
  data: Array<Record<string, any>>;
  value: string;
  onChange: Function;
  isInline: boolean;
}

const RadioContainer = styled.View(({ isInline }: any) => ({
  flexDirection: isInline ? 'row' : 'column',
  alignItems: isInline ? 'center' : 'flex-start',
  flexWrap: 'wrap',
  rowGap: 10,
}));

const RadioTouchable = styled.TouchableOpacity(() => ({
  alignItems: 'center',
  flexDirection: 'row',
}));

const RadioCircle = styled.View(({ theme }) => ({
  width: 15,
  height: 15,
  borderWidth: 1,
  borderColor: theme.appBorderColor,
  borderRadius: 15,
  backgroundColor: theme.background.content,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 2,
}));

const RadioInnerCircle = styled.View(({ theme, selected }: any) => ({
  height: '100%',
  width: '100%',
  borderRadius: 10,
  backgroundColor: selected ? theme.color.positive : 'transparent',
}));

const RadioLabel = styled.Text(({ theme }) => ({
  fontSize: theme.typography.size.s1,
  paddingStart: 10,
  color: theme.color.defaultText,
}));

const RadioSelect = ({ data = [], value = '', onChange, isInline }: RadioProps) => {
  return (
    <RadioContainer isInline={isInline}>
      {data.map((item) => (
        <RadioTouchable
          key={item.label}
          activeOpacity={0.7}
          onPress={() => {
            onChange(item);
          }}
        >
          <RadioCircle>
            <RadioInnerCircle selected={value === item.key} />
          </RadioCircle>
          <RadioLabel>{item.label}</RadioLabel>
        </RadioTouchable>
      ))}
    </RadioContainer>
  );
};

export default RadioSelect;

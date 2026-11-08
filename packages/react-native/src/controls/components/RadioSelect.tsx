import { styled } from '@storybook/react-native-theming';

interface RadioProps {
  data: Array<Record<string, any>>;
  value: string;
  onChange: Function;
  isInline: boolean;
}

const radioHitSlop = { top: 8, right: 12, bottom: 8, left: 12 };

const RadioContainer = styled.View<{ isInline: boolean }>(({ isInline }) => ({
  flexDirection: isInline ? 'row' : 'column',
  alignItems: isInline ? 'center' : 'flex-start',
  flexWrap: 'wrap',
  gap: isInline ? 8 : 2,
}));

const RadioTouchable = styled.TouchableOpacity<{ isInline: boolean }>(({ isInline }) => ({
  alignItems: 'center',
  flexDirection: 'row',
  minHeight: isInline ? 36 : 32,
  paddingVertical: isInline ? 4 : 2,
  paddingRight: 6,
}));

const RadioCircle = styled.View(({ theme }) => ({
  width: 20,
  height: 20,
  borderWidth: 2,
  borderColor: theme.appBorderColor,
  borderRadius: 10,
  backgroundColor: theme.background.content,
  alignItems: 'center',
  justifyContent: 'center',
}));

const RadioInnerCircle = styled.View<{ selected: boolean }>(({ theme, selected }) => ({
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: selected ? theme.color.positive : theme.background.content,
}));

const RadioLabel = styled.Text(({ theme }) => ({
  fontSize: theme.typography.size.s1 + 1,
  paddingStart: 12,
  color: theme.color.defaultText,
}));

const RadioSelect = ({ data = [], value = '', onChange, isInline }: RadioProps) => {
  return (
    <RadioContainer isInline={isInline}>
      {data.map((item) => (
        <RadioTouchable
          key={item.label}
          isInline={isInline}
          activeOpacity={0.7}
          accessibilityRole="radio"
          accessibilityState={{ selected: value === item.key }}
          hitSlop={radioHitSlop}
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

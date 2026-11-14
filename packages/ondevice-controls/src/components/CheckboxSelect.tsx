import { styled } from '@storybook/react-native-theming';

interface CheckboxSelectProps {
  labels: Array<string>;
  value: Array<string>;
  onChange: (label: string) => void;
  isInline: boolean;
  readOnly: boolean;
}

const checkboxHitSlop = { top: 8, right: 12, bottom: 8, left: 12 };

const CheckboxContainer = styled.View<{ isInline: boolean }>(({ isInline }) => ({
  flexDirection: isInline ? 'row' : 'column',
  alignItems: isInline ? 'center' : 'flex-start',
  flexWrap: 'wrap',
  gap: isInline ? 8 : 2,
}));

const CheckboxTouchable = styled.TouchableOpacity<{ isInline: boolean; readOnly: boolean }>(
  ({ isInline, readOnly }) => ({
    opacity: readOnly ? 0.5 : 1,
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: isInline ? 36 : 32,
    paddingVertical: isInline ? 4 : 2,
    paddingRight: 6,
  })
);

const CheckboxBox = styled.View<{ checked: boolean }>(({ theme, checked }) => ({
  width: 20,
  height: 20,
  borderWidth: 2,
  borderColor: checked ? theme.color.positive : theme.appBorderColor,
  borderRadius: 4,
  backgroundColor: checked ? theme.color.positive : theme.background.content,
  alignItems: 'center',
  justifyContent: 'center',
}));

const CheckboxTick = styled.View(({ theme }) => ({
  width: 6,
  height: 11,
  marginTop: -2,
  borderRightWidth: 2,
  borderBottomWidth: 2,
  borderColor: theme.color.lightest,
  transform: [{ rotate: '45deg' }],
}));

const CheckboxLabel = styled.Text(({ theme }) => ({
  fontSize: theme.typography.size.s1 + 1,
  paddingStart: 12,
  color: theme.color.defaultText,
}));

const CheckboxSelect = ({ labels, value, onChange, isInline, readOnly }: CheckboxSelectProps) => {
  return (
    <CheckboxContainer isInline={isInline}>
      {labels.map((label) => {
        const checked = value.includes(label);

        return (
          <CheckboxTouchable
            key={label}
            isInline={isInline}
            readOnly={readOnly}
            disabled={readOnly}
            activeOpacity={0.7}
            accessibilityRole="checkbox"
            accessibilityState={{ checked, disabled: readOnly }}
            hitSlop={checkboxHitSlop}
            onPress={() => {
              onChange(label);
            }}
          >
            <CheckboxBox checked={checked}>{checked ? <CheckboxTick /> : null}</CheckboxBox>
            <CheckboxLabel>{label}</CheckboxLabel>
          </CheckboxTouchable>
        );
      })}
    </CheckboxContainer>
  );
};

export default CheckboxSelect;

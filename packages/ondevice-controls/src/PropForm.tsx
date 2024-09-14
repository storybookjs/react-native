import { styled } from '@storybook/react-native-theming';
import { transparentize } from 'polished';
import { ArgTypes } from './ControlsPanel';
import PropField from './PropField';
import { Image, TouchableOpacity, View } from 'react-native';

interface FormProps {
  args: ArgTypes;
  isPristine: boolean;
  onFieldChange: (value: any) => void;
  onReset: () => void;
}

const Container = styled.View(() => ({ paddingTop: 0 }));

const Label = styled.Text(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
  fontWeight: 'bold',
  color: theme.color.defaultText,
}));

const TableHeaderText = styled.Text(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: theme.typography.size.s2 - 1,
  color:
    theme.base === 'light'
      ? transparentize(0.25, theme.color.defaultText)
      : transparentize(0.45, theme.color.defaultText),
}));

const TableRow = styled.View<{ hasBottomBorder?: boolean }>(({ theme, hasBottomBorder }) => ({
  flexDirection: 'row',
  columnGap: 10,
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderBottomWidth: hasBottomBorder ? 1 : 0,
  borderBottomColor: hasBottomBorder ? theme.appBorderColor : undefined,
}));

const PropForm = ({ args, isPristine, onFieldChange, onReset }: FormProps) => {
  const makeChangeHandler = (name: string) => {
    return (value) => {
      onFieldChange({ [name]: value });
    };
  };

  return (
    <Container>
      <TableRow hasBottomBorder>
        <TableHeaderText style={{ width: '25%', paddingVertical: 10 }}>Name</TableHeaderText>
        <View
          style={{
            width: '75%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TableHeaderText>Control</TableHeaderText>

          <TouchableOpacity
            onPress={onReset}
            style={{
              marginRight: 10,
              padding: 10,
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={{
                // undo icon
                uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADUSURBVHgB1ZHdCcJQDIXTm+qzIziCHaUT6AZa/1AEKYoo+NPrBI6gTqIb6Aiij20Se0ELStEWnzwPSSDn40AC8Ks6k6DSHi8OWf32E2LiLSG6WUHLlNZoeQKQ8hfnrmCjN+t75ySRkFxFaovI7nzQPb4zDT8oKcW1MKRDbxo4BlZmoWMzx5Cw2qSFad+7rIYtbYmsw4g2SeITjpsDHxSJrVGobmYF+VXKDSJSVUT2ZrazAH58nCtyHQQaXETnBWyOljULJPU4N+CLAjlGBXT04x1/pDtOIFUpwlNuTQAAAABJRU5ErkJggg==',
                width: 14,
                height: 14,
              }}
            />
          </TouchableOpacity>
        </View>
      </TableRow>

      {Object.values(args).map((arg, i) => {
        const changeHandler = makeChangeHandler(arg.name);
        return (
          <TableRow hasBottomBorder={i !== Object.values(args).length - 1}>
            <Label style={{ width: '25%' }}>{arg.name}</Label>

            <View style={{ width: '75%' }}>
              <PropField
                key={arg.name}
                arg={arg}
                isPristine={isPristine}
                onChange={changeHandler}
              />
            </View>
          </TableRow>
        );
      })}
    </Container>
  );
};

export default PropForm;

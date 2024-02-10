import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { styled } from '@storybook/react-native-theming';
import { logger } from '@storybook/client-logger';
import type { Conditional } from '@storybook/types';

export type OptionsObject = Record<string, any>;

export interface NormalizedOptionsConfig {
  options: OptionsObject;
}

export type OptionsMultiSelection = any[];

export interface ArgType {
  name?: string;
  description?: string;
  defaultValue?: any;
  if?: Conditional;
  [key: string]: any;
}

export interface ControlProps<T> {
  name: string;
  value?: T;
  defaultValue?: T;
  argType?: ArgType;
  onChange: (value: T) => T | void;
  onFocus?: (evt: any) => void;
  onBlur?: (evt: any) => void;
}

const Wrapper = styled.View(({}) => ({}));

const Text = styled.Text({});

const Container = styled.TouchableOpacity<{ isLast: boolean }>(({ isLast, theme }) => ({
  marginBottom: isLast ? 0 : theme.tokens.spacing2,
  flexDirection: 'row',
  alignItems: 'center',
}));

const Tick = styled.Image({});

const Box = styled.View<{ selected: boolean }>(({ theme, selected }) => ({
  width: 20,
  height: 20,
  marginRight: theme.inputs.radio.labelSpacing,
  alignItems: 'center',
  justifyContent: 'center',
  borderColor: theme.inputs.text.borderColor,
  borderWidth: 1,
  borderRadius: theme.tokens.borderRadius.small,
  backgroundColor: selected ? theme.inputs.radio.activeBackgroundColor : 'transparent',
}));

export const selectedKeys = (value: any[], options: OptionsObject) =>
  value && options
    ? Object.entries(options)
        .filter((entry) => value?.includes?.(entry[1]))
        .map((entry) => entry[0])
    : [];

export const selectedValues = (keys: string[], options: OptionsObject) =>
  keys && options && keys.map((key) => options[key]);

export const getControlId = (value: string) => `control-${value?.replace(/\s+/g, '-')}`;

export const CheckboxControl: FC<{
  arg: {
    name: string;
    value: any;
    options: Array<any> | Record<string, any>;
    control: {
      labels?: Record<string, string>;
    };
  };
  onChange: (value: any) => void;
}> = ({ onChange, arg: { name, value, options } }) => {
  const initial = selectedKeys(value, options);
  const [selected, setSelected] = useState(initial);

  const handleChange = (text) => {
    const option = text;
    const updated = [...selected];
    if (updated.includes(option)) {
      updated.splice(updated.indexOf(option), 1);
    } else {
      updated.push(option);
    }
    onChange(selectedValues(updated, options));
    setSelected(updated);
  };

  useEffect(() => {
    setSelected(selectedKeys(value, options));
  }, [options, value]);

  const controlId = getControlId(name);

  if (!options) {
    logger.warn(`Checkbox with no options: ${name}`);
    return null;
  }

  return (
    <Wrapper>
      {Object.keys(options).map((key, index) => {
        return (
          <Container
            key={`${controlId}-${index}`}
            isLast={index === options.length - 1}
            onPress={() => {
              handleChange(key);
            }}
          >
            <Box selected={selected?.includes(key)}>
              <Tick
                accessibilityLabel={key}
                source={{
                  width: 14,
                  height: 10,
                  uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAUCAYAAACeXl35AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB2SURBVHgB7dRLDoAgEAPQ3pTenCPMERSiC0NQYZyyskkTF5IXvoA+qdRK8/ktx7ZLDcK0WG2GKD2slhDkx9ZjX+/J9Mxy8+MM6lpG6wwYQd17xpuBSYF50LDTyAE0DBtBw7E3VILNoERwuBJ7QglxiOM1MgRgO5xnlTXeMlnGAAAAAElFTkSuQmCC',
                }}
                tintColor={selected?.includes(key) ? 'white' : 'transparent'}
              />
            </Box>
            <Text>{options[key]}</Text>
          </Container>
        );
      })}
    </Wrapper>
  );
};

export default CheckboxControl;

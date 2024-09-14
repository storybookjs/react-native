import React, { ComponentType } from 'react';
import { styled } from '@storybook/react-native-theming';
import TypeMap from './types';
import { ArgType } from './ControlsPanel';

type ControlTypes =
  | 'text'
  | 'number'
  | 'color'
  | 'boolean'
  | 'object'
  | 'select'
  | 'array'
  | 'date'
  | 'button'
  | 'radio';

export interface Knob {
  name: string;
  label: string;
  value: any;
  hideLabel: boolean;
  type: ControlTypes;
  groupId?: string;
}

const InvalidTypeText = styled.Text(({ theme }) => ({
  color: theme.inputs.errorTextColor,
}));

const InvalidType = ({ arg }: { arg: ArgType }) => (
  <InvalidTypeText>Invalid type: {arg.type}</InvalidTypeText>
);

interface PropFieldProps {
  onChange: (value: any) => void;
  arg: ArgType;
  isPristine: boolean;
}

const PropField = ({ onChange, arg, isPristine }: PropFieldProps) => {
  const InputType: ComponentType<any> = TypeMap[arg.type];
  return InputType ? (
    <InputType arg={arg} isPristine={isPristine} onChange={onChange} />
  ) : (
    <InvalidType arg={arg} />
  );
};

export default PropField;

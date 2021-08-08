import { View, Text, StyleSheet } from 'react-native';
import React, { ComponentType } from 'react';
import styled from '@emotion/native';
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
  | 'radios';

export interface Knob {
  name: string;
  label: string;
  value: any;
  hideLabel: boolean;
  type: ControlTypes;
  groupId?: string;
}

const InvalidType = ({ arg }: { arg: ArgType }) => (
  <Text style={styles.invalidType}>Invalid Type {arg.type}</Text>
);

const Label = styled.Text(({ theme }) => ({
  marginLeft: 10,
  fontSize: 14,
  color: theme.labelColor || 'black',
  fontWeight: 'bold',
}));

interface PropFieldProps {
  onChange: (value: any) => void;
  arg: ArgType;
}

const PropField = ({ onChange, arg }: PropFieldProps) => {
  const InputType: ComponentType<any> = TypeMap[arg.type];
  return (
    <View>
      {!arg.hideLabel ? <Label>{`${arg.label || arg.name}`}</Label> : null}
      {InputType ? <InputType arg={arg} onChange={onChange} /> : <InvalidType arg={arg} />}
    </View>
  );
};

const styles = StyleSheet.create({
  invalidType: { margin: 10 },
});

export default PropField;

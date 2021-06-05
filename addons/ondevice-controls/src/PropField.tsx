import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import React, { ComponentType, FunctionComponent, ReactElement } from 'react';
import styled from '@emotion/native';
import TypeMap from './types';

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

const InvalidType = ({ knob }: { knob: Knob }) => (
  <Text style={{ margin: 10 }}>Invalid Type {knob.type}</Text>
);

const Label = styled.Text(({ theme }) => ({
  marginLeft: 10,
  fontSize: 14,
  color: theme.labelColor || 'black',
  fontWeight: 'bold',
}));

interface PropFieldProps {
  onChange: (value: any) => void;
  onPress: Function;
  knob: Knob;
  name: string;
  type: string;
  value: string;
}

const PropField = ({ onChange, onPress, knob }: PropFieldProps) => {
  const InputType: ComponentType<any> = TypeMap[knob.type];
  return (
    <View>
      {!knob.hideLabel ? <Label>{`${knob.label || knob.name}`}</Label> : null}
      {InputType ? (
        <InputType knob={knob} onChange={onChange} onPress={onPress} />
      ) : (
        <InvalidType knob={knob} />
      )}
    </View>
  );
};

export default PropField;

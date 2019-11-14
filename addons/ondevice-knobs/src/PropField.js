import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import React from 'react';
import styled from '@emotion/native';
import TypeMap from './types';

const InvalidType = () => <Text style={{ margin: 10 }}>Invalid Type</Text>;

const Label = styled.Text(({ theme }) => ({
  marginLeft: 10,
  fontSize: 14,
  color: theme.labelColor,
  fontWeight: 'bold',
}));

const PropField = ({ onChange, onPress, knob }) => {
  const InputType = TypeMap[knob.type] || InvalidType;

  return (
    <View>
      {!knob.hideLabel ? <Label>{`${knob.label || knob.name}`}</Label> : null}
      <InputType knob={knob} onChange={onChange} onPress={onPress} />
    </View>
  );
};

PropField.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.any,
    hideLabel: PropTypes.bool,
    type: PropTypes.oneOf([
      'text',
      'number',
      'color',
      'boolean',
      'object',
      'select',
      'array',
      'date',
      'button',
    ]),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default PropField;

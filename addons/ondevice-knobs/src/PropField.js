import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import React from 'react';
import TypeMap from './types';

const InvalidType = () => <Text style={{ margin: 10 }}>Invalid Type</Text>;

const PropField = ({ onChange, onPress, knob }) => {
  const InputType = TypeMap[knob.type] || InvalidType;

  return (
    <View>
      {!knob.hideLabel ? (
        <Text
          style={{
            marginLeft: 10,
            fontSize: 14,
            color: 'rgb(68, 68, 68)',
            fontWeight: 'bold',
          }}
        >
          {`${knob.label || knob.name}`}
        </Text>
      ) : null}
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

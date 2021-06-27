/* eslint no-underscore-dangle: 0 */

import PropTypes from 'prop-types';
import { View } from 'react-native';
import React from 'react';
import styled from '@emotion/native';
import { Picker } from '@react-native-picker/picker';

const Input = styled.TextInput(({ theme }) => ({
  borderWidth: 1,
  borderRadius: 2,
  padding: 5,
  margin: 10,
  borderColor: theme.borderColor || '#e6e6e6',
  color: theme.labelColor || 'black',
}));

class SelectType extends React.Component {
  getOptions = ({ options }) => {
    if (Array.isArray(options)) {
      return options.map((val) => ({ key: val, label: val }));
    }

    return Object.keys(options).map((key) => ({ label: key, key: options[key] }));
  };

  render() {
    const { knob, onChange } = this.props;

    const options = this.getOptions(knob);

    const active = options.filter(({ key }) => knob.value === key)[0];

    return (
      <View>
        <Picker selectedValue={knob.value} onValueChange={(itemValue) => onChange(itemValue)}>
          {options.map(({ key, label }) => (
            <Picker.Item key={`${label}-${key}`} value={key} label={label} />
          ))}
        </Picker>
      </View>
    );
  }
}

SelectType.defaultProps = {
  knob: {},
  onChange: (value) => value,
};

SelectType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    selectV2: PropTypes.bool,
  }),
  onChange: PropTypes.func,
};

SelectType.serialize = (value) => value;
SelectType.deserialize = (value) => value;

export default SelectType;

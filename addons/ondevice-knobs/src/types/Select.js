/* eslint no-underscore-dangle: 0 */

import PropTypes from 'prop-types';
import { View } from 'react-native';
import React from 'react';
import ModalPicker from 'react-native-modal-selector';
import styled from '@emotion/native';

import { inputStyle } from './common';

const Input = styled.TextInput(({ theme }) => ({
  ...inputStyle(theme),
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
    const selected = active && active.label;

    return (
      <View>
        <ModalPicker
          data={options}
          initValue={knob.value}
          onChange={(option) => onChange(option.key)}
          animationType="none"
          keyExtractor={({ key, label }) => `${label}-${key}`}
        >
          <Input
            editable={false}
            value={selected}
            autoCapitalize="none"
            underlineColorAndroid="transparent"
          />
        </ModalPicker>
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

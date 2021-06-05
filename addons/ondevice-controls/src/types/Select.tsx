/* eslint no-underscore-dangle: 0 */

import { View } from 'react-native';
import React from 'react';
import ModalPicker from 'react-native-modal-selector';
import styled from '@emotion/native';

const Input = styled.TextInput(({ theme }) => ({
  borderWidth: 1,
  borderRadius: 2,
  padding: 5,
  margin: 10,
  borderColor: theme.borderColor || '#e6e6e6',
  color: theme.labelColor || 'black',
}));

export interface SelectProps {
  knob: {
    name: string;
    value: string;
    options: Array<any> | Record<string, any>;
    selectV2: boolean;
  };
  onChange: (value: any) => void;
}

class SelectType extends React.Component<SelectProps> {
  static defaultProps = {
    knob: {},
    onChange: (value) => value,
  };

  static serialize = (value) => value;

  static deserialize = (value) => value;

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

export default SelectType;

/* eslint no-underscore-dangle: 0 */

import PropTypes from 'prop-types';
import { View, TextInput } from 'react-native';
import React from 'react';
import ModalPicker from 'react-native-modal-selector';

class SelectType extends React.Component {
  getOptions = ({ options }) => {
    if (Array.isArray(options)) {
      return options.map(val => ({ key: val, label: val }));
    }

    return Object.keys(options).map(key => ({ label: key, key: options[key] }));
  };

  render() {
    const { knob, onChange } = this.props;

    const options = this.getOptions(knob);

    const selected = options.filter(({ key }) => knob.value === key)[0].label;

    return (
      <View>
        <ModalPicker
          data={options}
          initValue={knob.value}
          onChange={option => onChange(option.key)}
          animationType="none"
        >
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#f7f4f4',
              borderRadius: 2,
              padding: 5,
              color: '#555',
              margin: 10,
            }}
            editable={false}
            value={selected}
            underlineColorAndroid="transparent"
          />
        </ModalPicker>
      </View>
    );
  }
}

SelectType.defaultProps = {
  knob: {},
  onChange: value => value,
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

SelectType.serialize = value => value;
SelectType.deserialize = value => value;

export default SelectType;

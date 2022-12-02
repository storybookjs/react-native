import PropTypes from 'prop-types';
import { View } from 'react-native';
import React from 'react';
import RadioSelect from '../components/RadioSelect';

class SelectType extends React.Component {
  getOptions = ({ options }) => {
    if (Array.isArray(options)) {
      return options.map((val) => ({ key: val, label: val }));
    }

    return Object.keys(options).map((key) => ({ label: key, key: options[key] }));
  };

  render() {
    const { knob, onChange, isInline } = this.props;

    const options = this.getOptions(knob);

    return (
      <View>
        <RadioSelect
          data={options}
          initValue={knob.value}
          onChange={(option) => onChange(option.key)}
          inline={isInline}
        />
      </View>
    );
  }
}

SelectType.defaultProps = {
  knob: {},
  onChange: (value) => value,
  isInline: false,
};

SelectType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }),
  onChange: PropTypes.func,
  isInline: PropTypes.bool,
};

SelectType.serialize = (value) => value;
SelectType.deserialize = (value) => value;

export default SelectType;

import { View } from 'react-native';
import React from 'react';
import RadioSelect from '../components/RadioSelect';

export interface RadioProps {
  knob: {
    name: string;
    value: string;
    options: Array<any> | Record<string, any>;
  };
  onChange: (value: any) => void;
  isInline: boolean;
}

class RadioType extends React.Component<RadioProps> {
  static defaultProps = {
    knob: {},
    onChange: (value) => value,
    isInline: false,
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

    return (
      <View>
        <RadioSelect
          data={options}
          initValue={knob.value}
          onChange={(option) => onChange(option.key)}
        />
      </View>
    );
  }
}

export default RadioType;

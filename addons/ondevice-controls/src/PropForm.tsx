/* eslint no-underscore-dangle: 0 */

import React from 'react';
import { View } from 'react-native';
import PropField, { Knob } from './PropField';

interface FormProps {
  knobs: Knob[];
  onFieldPress: Function;
  onFieldChange: (value: any) => void;
}

export default class PropForm extends React.Component<FormProps> {
  makeChangeHandler(name: string, type) {
    return (value) => {
      const { onFieldChange } = this.props;
      const change = { name, type, value };
      onFieldChange(change);
    };
  }

  render() {
    const { knobs, onFieldPress } = this.props;

    return (
      <View>
        {knobs.map((knob) => {
          const changeHandler = this.makeChangeHandler(knob.name, knob.type);
          return (
            <PropField
              key={knob.name}
              name={knob.name}
              type={knob.type}
              value={knob.value}
              knob={knob}
              onChange={changeHandler}
              onPress={onFieldPress}
            />
          );
        })}
      </View>
    );
  }
}

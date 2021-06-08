/* eslint no-underscore-dangle: 0 */

import React from 'react';
import { View } from 'react-native';
import { ArgTypes } from './ControlsPanel';
import PropField from './PropField';

interface FormProps {
  args: ArgTypes;
  onFieldChange: (value: { name: string; value: any; type: string }) => void;
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
    const { args } = this.props;

    return (
      <View>
        {Object.values(args).map((arg) => {
          const changeHandler = this.makeChangeHandler(arg.name, arg.type);

          return (
            <PropField
              key={arg.name}
              name={arg.name}
              type={arg.type}
              value={arg.value}
              arg={arg}
              onChange={changeHandler}
            />
          );
        })}
      </View>
    );
  }
}

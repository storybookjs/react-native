import React from 'react';
import { View } from 'react-native';
import { ArgTypes } from './ControlsPanel';
import PropField from './PropField';

interface FormProps {
  args: ArgTypes;
  onFieldChange: (value: any) => void;
}

export default class PropForm extends React.Component<FormProps> {
  makeChangeHandler(name: string) {
    return (value) => {
      const { onFieldChange } = this.props;
      onFieldChange({ [name]: value });
    };
  }

  render() {
    const { args } = this.props;

    return (
      <View>
        {Object.values(args).map((arg) => {
          const changeHandler = this.makeChangeHandler(arg.name);

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

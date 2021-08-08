import React from 'react';
import { View } from 'react-native';
import { ArgTypes } from './ControlsPanel';
import PropField from './PropField';

interface FormProps {
  args: ArgTypes;
  onFieldChange: (value: any) => void;
}

const PropForm = ({ args, onFieldChange }: FormProps) => {
  const makeChangeHandler = (name: string) => {
    return (value) => {
      onFieldChange({ [name]: value });
    };
  };

  return (
    <View>
      {Object.values(args).map((arg) => {
        const changeHandler = makeChangeHandler(arg.name);
        return <PropField key={arg.name} arg={arg} onChange={changeHandler} />;
      })}
    </View>
  );
};

export default PropForm;

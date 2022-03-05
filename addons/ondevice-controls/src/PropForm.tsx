import styled from '@emotion/native';
import React from 'react';

import { ArgTypes } from './ControlsPanel';
import PropField from './PropField';

interface FormProps {
  args: ArgTypes;
  isPristine: boolean;
  onFieldChange: (value: any) => void;
}

const Container = styled.View(() => ({ paddingTop: 8 }));

const PropForm = ({ args, isPristine, onFieldChange }: FormProps) => {
  const makeChangeHandler = (name: string) => {
    return (value) => {
      onFieldChange({ [name]: value });
    };
  };

  return (
    <Container>
      {Object.values(args).map((arg) => {
        const changeHandler = makeChangeHandler(arg.name);
        return (
          <PropField key={arg.name} arg={arg} isPristine={isPristine} onChange={changeHandler} />
        );
      })}
    </Container>
  );
};

export default PropForm;

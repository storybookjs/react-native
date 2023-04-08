import React, { ComponentType } from 'react';
import styled from '@emotion/native';
import TypeMap from './types';
import { ArgType } from './ControlsPanel';

type ControlTypes =
  | 'text'
  | 'number'
  | 'color'
  | 'boolean'
  | 'object'
  | 'select'
  | 'array'
  | 'date'
  | 'button'
  | 'radio';

export interface Knob {
  name: string;
  label: string;
  value: any;
  hideLabel: boolean;
  type: ControlTypes;
  groupId?: string;
}

const InvalidTypeText = styled.Text(({ theme }) => ({
  color: theme.inputs.errorTextColor,
}));

const InvalidType = ({ arg }: { arg: ArgType }) => (
  <InvalidTypeText>Invalid type: {arg.type}</InvalidTypeText>
);

const Label = styled.Text(({ theme }) => ({
  paddingBottom: theme.tokens.spacing1,
  fontSize: theme.inputs.labelFontSize,
  color: theme.inputs.labelTextColor,
  fontWeight: '500',
}));

const Container = styled.View(({ theme }) => ({
  paddingBottom: theme.tokens.spacing4,
}));

const InputContainer = styled.View();

interface PropFieldProps {
  onChange: (value: any) => void;
  arg: ArgType;
  isPristine: boolean;
}

const PropField = ({ onChange, arg, isPristine }: PropFieldProps) => {
  const InputType: ComponentType<any> = TypeMap[arg.type];
  return (
    <Container>
      {!arg.hideLabel ? <Label>{`${arg.label || arg.name}`}</Label> : null}
      <InputContainer>
        {InputType ? (
          <InputType arg={arg} isPristine={isPristine} onChange={onChange} />
        ) : (
          <InvalidType arg={arg} />
        )}
      </InputContainer>
    </Container>
  );
};

export default PropField;

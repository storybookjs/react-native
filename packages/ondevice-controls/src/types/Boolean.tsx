import { Switch } from 'react-native';
import React from 'react';
import styled from '@emotion/native';

export interface BooleanProps {
  onChange: (value: boolean) => void;
  arg: {
    name: string;
    value: boolean;
  };
}

const Container = styled.View(() => ({
  alignItems: 'flex-start',
}));

const BooleanType = ({ arg, onChange }: BooleanProps) => (
  <Container>
    <Switch testID={arg.name} onValueChange={() => onChange(!arg.value)} value={arg.value} />
  </Container>
);

BooleanType.serialize = (value) => (value ? String(value) : null);

BooleanType.deserialize = (value) => value === 'true';

export default BooleanType;

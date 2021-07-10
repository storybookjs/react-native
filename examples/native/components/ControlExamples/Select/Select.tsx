import React, { FunctionComponent } from 'react';
import { Text } from 'react-native';

interface Props {
  arrow: string;
}

export const SelectExample: FunctionComponent<Props> = ({ arrow }) => (
  <Text>Selected: {arrow}</Text>
);

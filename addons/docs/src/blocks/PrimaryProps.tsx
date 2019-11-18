import React, { FunctionComponent } from 'react';
import { Props } from './Props';
import { PropsSlot } from './types';

interface PrimaryPropsProps {
  slot?: PropsSlot;
}

export const PrimaryProps: FunctionComponent<PrimaryPropsProps> = props => (
  <Props of="." {...props} />
);

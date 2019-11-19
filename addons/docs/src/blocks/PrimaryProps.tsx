import React, { FunctionComponent } from 'react';
import { Props } from './Props';
import { PropsSlot } from './shared';

interface PrimaryPropsProps {
  slot?: PropsSlot;
}

export const PrimaryProps: FunctionComponent<PrimaryPropsProps> = props => (
  <Props of="." {...props} />
);

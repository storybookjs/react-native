import React, { FunctionComponent, useContext } from 'react';
import { PropsTable } from '@storybook/components';
import { DocsContext } from './DocsContext';
import { getPropsTableProps } from './Props';
import { PropsSlot } from './types';

interface PrimaryPropsProps {
  slot?: PropsSlot;
}
export const PrimaryProps: FunctionComponent<PrimaryPropsProps> = ({ slot }) => {
  const context = useContext(DocsContext);
  const props = slot ? slot(context) : getPropsTableProps({ of: '.' }, context);
  return props ? <PropsTable {...props} /> : null;
};

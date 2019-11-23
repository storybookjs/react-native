import React from 'react';
import { PropsTable, PropsTableError } from './PropsTable';
import { stringDef, numberDef } from './PropRow.stories';

export default {
  component: PropsTable,
  title: 'Docs/PropTable',
};

export const normal = () => <PropsTable rows={[stringDef, numberDef]} />;

export const sections = () => (
  <PropsTable sections={{ props: [stringDef, numberDef], events: [stringDef] }} />
);

export const error = () => <PropsTable error={PropsTableError.NO_COMPONENT} />;

export const empty = () => <PropsTable rows={[]} />;

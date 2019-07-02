import React from 'react';
import { PropsTable, PropsTableError } from './PropsTable';
import { DocsPageWrapper } from '../DocsPage';
import { stringDef, numberDef } from './PropRow.stories';

export default {
  Component: PropsTable,
  title: 'Docs|PropTable',
  decorators: [storyFn => <DocsPageWrapper>{storyFn()}</DocsPageWrapper>],
};

export const error = () => <PropsTable error={PropsTableError.NO_COMPONENT} />;

export const empty = () => <PropsTable rows={[]} />;

export const normal = () => <PropsTable rows={[stringDef, numberDef]} />;

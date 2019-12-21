import React from 'react';
import { SectionRow } from './SectionRow';
import { Table } from './PropsTable';
import { ResetWrapper } from '../../typography/DocumentFormatting';

export default {
  component: SectionRow,
  title: 'Docs/SectionRow',
  decorators: [
    getStory => (
      <ResetWrapper>
        <Table>
          <tbody>{getStory()}</tbody>
        </Table>
      </ResetWrapper>
    ),
  ],
};

export const props = () => <SectionRow section="Props" />;

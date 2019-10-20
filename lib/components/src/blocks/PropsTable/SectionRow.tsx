import React, { FC } from 'react';
import { styled } from '@storybook/theming';

export interface SectionRowProps {
  section: string;
}

const SectionTd = styled.td({
  fontWeight: 'bold',
  textTransform: 'uppercase',
});

export const SectionRow: FC<SectionRowProps> = ({ section }) => (
  <tr>
    <SectionTd colSpan={3}>{section}</SectionTd>
  </tr>
);

import * as React from 'react';

export interface WithNotesProps extends React.HTMLProps<HTMLDivElement> {
  notes?: string;
}

export const WithNotes: React.StatelessComponent<WithNotesProps>;

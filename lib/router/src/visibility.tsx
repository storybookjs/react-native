import React, { ReactNode } from 'react';

interface Props {
  hidden: boolean;
  children: ReactNode;
}

export const ToggleVisibility = ({ hidden, children }: Props) => (
  <div hidden={hidden}>{children}</div>
);

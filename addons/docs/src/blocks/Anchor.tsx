import React, { FC, SyntheticEvent } from 'react';
import { document } from 'global';
import { A } from '@storybook/components/html';

export const anchorBlockIdFromId = (storyId: string) => `anchor--${storyId}`;

export interface AnchorProps {
  storyId: string;
}

export const Anchor: FC<AnchorProps> = ({ storyId, children }) => (
  <div id={anchorBlockIdFromId(storyId)}>{children}</div>
);

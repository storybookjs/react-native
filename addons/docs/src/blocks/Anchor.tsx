import React, { FC } from 'react';

export const anchorBlockIdFromId = (storyId: string) => `anchor--${storyId}`;

export interface AnchorProps {
  storyId: string;
}

export const Anchor: FC<AnchorProps> = ({ storyId, children }) => (
  <div id={anchorBlockIdFromId(storyId)}>{children}</div>
);

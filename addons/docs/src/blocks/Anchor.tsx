import React, { FunctionComponent } from 'react';

export const anchorBlockIdFromId = (storyId: string) => `anchor--${storyId}`;

export interface AnchorProps {
  storyId: string;
}

export const Anchor: FunctionComponent<AnchorProps> = ({ storyId, children }) => (
  <div id={anchorBlockIdFromId(storyId)}>{children}</div>
);

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

export function scrollToElement(element: any, block = 'start') {
  element.scrollIntoView({
    behavior: 'smooth',
    block,
    inline: 'nearest',
  });
}

interface AnchorInPageProps {
  href: string;
}

export const AnchorInPage: FC<AnchorInPageProps> = ({ href, children }) => (
  <A
    href={href}
    onClick={(event: SyntheticEvent) => {
      event.preventDefault();

      const element = document.getElementById(href.substring(1));
      if (element) {
        scrollToElement(element);
      }
    }}
  >
    {children}
  </A>
);

import React, { FunctionComponent } from 'react';
import { H3 } from '@storybook/components/html';
import { HeaderMdx } from './mdx';
import { HeadingProps } from './Heading';

export const Subheading: FunctionComponent<HeadingProps> = ({ children, disableAnchor }) => {
  if (disableAnchor || typeof children !== 'string') {
    return <H3>{children}</H3>;
  }
  const tagID = children.toLowerCase().replace(/[^a-z0-9]/gi, '-');
  return (
    <HeaderMdx as="h3" id={tagID}>
      {children}
    </HeaderMdx>
  );
};

import React, { FunctionComponent, Key, ReactNode } from 'react';
import { styled } from '@storybook/theming';

import ListItem, { LinkWrapperType } from './ListItem';

const List = styled.div(
  {
    minWidth: 180,
    overflow: 'hidden',
  },
  ({ theme }) => ({
    borderRadius: theme.appBorderRadius * 2,
  })
);

export interface Link {
  id: string;
  title?: ReactNode;
  active?: boolean;
  href?: string | object;
  onClick?: () => void;
  isGatsby?: boolean;
}

export interface TooltipLinkListProps {
  links: Link[];
  LinkWrapper: LinkWrapperType;
}

const TooltipLinkList: FunctionComponent<TooltipLinkListProps> = ({ links, LinkWrapper }) => (
  <List>
    {links.map(({ id, title, href, onClick, active, isGatsby, ...props }: any) => (
      <ListItem
        key={id || title}
        title={title}
        onClick={onClick}
        active={active}
        href={href}
        LinkWrapper={isGatsby ? LinkWrapper : null}
        {...props}
      />
    ))}
  </List>
);

TooltipLinkList.defaultProps = {
  LinkWrapper: ListItem.defaultProps.LinkWrapper,
};

export default TooltipLinkList;

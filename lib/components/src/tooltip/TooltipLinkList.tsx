import React, { FunctionComponent, Key, ReactNode } from 'react';
import { styled } from '@storybook/theming';

import ListItem, { LinkWrapperType, ListItemProps } from './ListItem';

const List = styled.div<{}>(
  {
    minWidth: 180,
    overflow: 'hidden',
    overflowY: 'auto',
    maxHeight: 10.5 * 32, // 10.5 items
  },
  ({ theme }) => ({
    borderRadius: theme.appBorderRadius * 2,
  })
);

export interface Link extends ListItemProps {
  id: string;
  isGatsby?: boolean;
}

export interface TooltipLinkListProps {
  links: Link[];
  LinkWrapper?: LinkWrapperType;
}

export const TooltipLinkList: FunctionComponent<TooltipLinkListProps> = ({
  links,
  LinkWrapper,
}) => (
  <List>
    {links.map(({ id, title, href, onClick, active, isGatsby, ...props }) => (
      <ListItem
        key={id || (title as string)}
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

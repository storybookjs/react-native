import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

import ListItem from './ListItem';

const List = styled.div(
  {
    minWidth: 180,
    overflow: 'hidden',
  },
  ({ theme }) => ({
    borderRadius: theme.appBorderRadius * 2,
  })
);

const TooltipLinkList = ({ links, LinkWrapper }) => (
  <List>
    {links.map(({ id, title, href, onClick, active, isGatsby, ...props }) => (
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

TooltipLinkList.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node.isRequired,
      href: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
      onClick: PropTypes.func,
      active: PropTypes.bool,
    }).isRequired
  ).isRequired,
  LinkWrapper: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.func]),
};

TooltipLinkList.defaultProps = {
  LinkWrapper: ListItem.defaultProps.LinkWrapper,
};

export default TooltipLinkList;

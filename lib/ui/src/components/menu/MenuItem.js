import React from 'react';
import PropTypes from 'prop-types';

import { Item, Icon, Title, Detail } from '@storybook/components';

export default function MenuItem({ menuItem: { action, icon, title, detail }, onHide }) {
  return (
    <Item
      onClick={() => {
        action();
        onHide();
      }}
    >
      <Icon type={icon} />
      <Title>{title}</Title>
      {typeof detail === 'string' ? <Detail>{detail}</Detail> : detail}
    </Item>
  );
}

MenuItem.propTypes = {
  menuItem: PropTypes.shape({
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
    action: PropTypes.func.isRequired,
    detail: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  }).isRequired,
  onHide: PropTypes.func.isRequired,
};

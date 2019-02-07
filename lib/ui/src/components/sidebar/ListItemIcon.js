// For use in tandem with TooltipLinkList
// Refer to container/nav.js for usage

import React from 'react';
import PropTypes from 'prop-types';
import { styled, css } from '@storybook/theming';

import { Icons } from '@storybook/components';

const sharedStyles = css`
  height: 10px;
  width: 10px;
  margin-left: -5px;
  margin-right: -5px;
  display: block;
`;

const Icon = styled(Icons)`
  ${sharedStyles};
  color: ${props => props.theme.color.secondary};
`;

const Img = styled.img`
  ${sharedStyles};
`;

const Placeholder = styled.div`
  ${sharedStyles};
`;

export default function ListItemIcon({ icon, imgSrc }) {
  if (icon) {
    return <Icon icon={icon} />;
  }
  if (imgSrc) {
    return <Img src={imgSrc} alt="image" />;
  }
  return <Placeholder />;
}

ListItemIcon.propTypes = {
  icon: PropTypes.string,
  imgSrc: PropTypes.string,
};

ListItemIcon.defaultProps = {
  icon: null,
  imgSrc: null,
};

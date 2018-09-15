import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { Explorer } from '@storybook/components';
import { Link } from '../../router';

const strip = href => href.replace('#!', '/components/');

const StyledLink = styled(Link)({
  height: 40,
  display: 'flex',
  alignItems: 'center',
  color: 'inherit',
  textDecoration: 'none',
});
const LeafLink = ({ id, href, children, className, ...rest }) => (
  <StyledLink id={id} className={className} to={strip(href)} {...rest}>
    {children}
  </StyledLink>
);

export const StoriesPanel = ({ stories }) => (
  <Explorer allowClick stories={stories} Link={LeafLink} />
);
StoriesPanel.propTypes = {
  stories: PropTypes.shape({}).isRequired,
};

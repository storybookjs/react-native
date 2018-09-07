import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { Explorer } from '@storybook/components';
import { Link } from '../../router';

const idToPath = id => `/components/${id.replace('treeview_explorer-', '')}` || '/components';

const LeafLink = styled(({ id, children, className, ...rest }) => (
  <Link id={id} className={className} to={idToPath(id)} {...rest}>
    {children}
  </Link>
))({
  height: 40,
  display: 'flex',
  alignItems: 'center',
  color: 'inherit',
  textDecoration: 'none',
});

export const StoriesPanel = ({ stories }) => (
  <Explorer allowClick stories={stories} Link={LeafLink} />
);
StoriesPanel.propTypes = {
  stories: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

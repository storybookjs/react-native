import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { Explorer, Router } from '@storybook/components';

const strip = (href, viewMode = 'components') => href.replace('#!', `/${viewMode}/`);

const StyledLink = styled(Router.Link)({
  display: 'flex',
  alignItems: 'center',
  color: 'inherit',
  textDecoration: 'none',
});
const LeafLink = ({ id, href, children, className, ...rest }) => (
  <Router.Location>
    {({ viewMode }) => (
      <StyledLink id={id} className={className} to={strip(href, viewMode)} {...rest}>
        {children}
      </StyledLink>
    )}
  </Router.Location>
);

const StoriesPanel = props => <Explorer allowClick {...props} Link={LeafLink} />;
StoriesPanel.propTypes = {
  stories: PropTypes.shape({}).isRequired,
};

export { StoriesPanel as Explorer };

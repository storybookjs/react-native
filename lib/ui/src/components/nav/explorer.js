import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { Explorer, Router } from '@storybook/components';

const strip = (href, viewMode = 'components') => href.replace('#!', `/${viewMode}/`);

const StyledLink = React.memo(
  styled(Router.Link)({
    display: 'flex',
    alignItems: 'center',
    color: 'inherit',
    textDecoration: 'none',
  })
);
StyledLink.displayName = 'StyledLink';
const LeafLink = React.memo(({ href, children, ...rest }) => (
  <Router.Location>
    {({ viewMode }) => (
      <StyledLink to={strip(href, viewMode)} {...rest}>
        {children}
      </StyledLink>
    )}
  </Router.Location>
));

LeafLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react/no-multi-comp
const StoriesPanel = React.memo(props => <Explorer allowClick {...props} Link={LeafLink} />);
StoriesPanel.propTypes = {
  stories: PropTypes.shape({}).isRequired,
  storyId: PropTypes.string,
};
StoriesPanel.defaultProps = {
  storyId: undefined,
};

export { StoriesPanel as StoriesExplorer };

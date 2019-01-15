import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

import { Explorer } from '@storybook/components';
import { Location, Link } from '@storybook/router';

const strip = (href, viewMode = 'components') => href.replace('#!', `/${viewMode}/`);

const StyledLink = React.memo(
  styled(Link)({
    display: 'flex',
    alignItems: 'center',
    color: 'inherit',
    textDecoration: 'none',
  })
);
StyledLink.displayName = 'StyledLink';
const LeafLink = React.memo(({ href, children, ...rest }) => (
  <Location>
    {({ viewMode }) => (
      <StyledLink to={strip(href, viewMode)} {...rest}>
        {children}
      </StyledLink>
    )}
  </Location>
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

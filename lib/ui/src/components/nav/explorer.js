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
const LeafLink = React.memo(
  ({ id, href, children, className, ...rest }) =>
    console.log('render leaflink', rest) || (
      <Router.Location>
        {({ viewMode }) => (
          <StyledLink id={id} className={className} to={strip(href, viewMode)} {...rest}>
            {children}
          </StyledLink>
        )}
      </Router.Location>
    )
);

const StoriesPanel = React.memo(props => <Explorer allowClick {...props} Link={LeafLink} />);
StoriesPanel.propTypes = {
  stories: PropTypes.shape({}).isRequired,
};

export { StoriesPanel as Explorer };

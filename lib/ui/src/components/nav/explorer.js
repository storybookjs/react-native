import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { Explorer } from '@storybook/components';
import { Link, Location } from '../../router';

const getUrlData = path => {
  const [, p1, p2] = path.match(/\/([^/]+)\/([^/]+)?/) || [];

  const result = {};
  if (p1 && p1.match(/(components|info)/)) {
    Object.assign(result, {
      componentRoot: p1,
      component: p2,
    });
  }
  return result;
};

const strip = (href, location) =>
  href.replace('#!', `/${getUrlData(location).componentRoot || 'components'}/`);

const StyledLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  color: 'inherit',
  textDecoration: 'none',
});
const LeafLink = ({ id, href, children, className, ...rest }) => (
  <Location>
    {({ location }) => (
      <StyledLink id={id} className={className} to={strip(href, location)} {...rest}>
        {children}
      </StyledLink>
    )}
  </Location>
);

const StoriesPanel = ({ stories }) => <Explorer allowClick stories={stories} Link={LeafLink} />;
StoriesPanel.propTypes = {
  stories: PropTypes.shape({}).isRequired,
};

export { StoriesPanel as Explorer };

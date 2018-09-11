import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import qs from 'qs';
import memoize from 'memoizee';

import { Link, Location, navigate } from '@reach/router';

const memoizedQueryParse = memoize(s => qs.parse(s, { ignoreQueryPrefix: true }));

const parseQuery = location => memoizedQueryParse(location.search);
const stringifyQuery = query => qs.stringify(query, { addQueryPrefix: true, encode: false });

const QueryLink = ({ to, children, ...rest }) => (
  <Link to={`?path=${to}`} {...rest}>
    {children}
  </Link>
);

const QueryMatch = ({ children, path: targetPath, startsWith }) => (
  <Location>
    {({ location }) => {
      const { path: urlPath } = memoizedQueryParse(
        location.search || location.pathname.split('?')[1]
      );
      if (startsWith) {
        const match = urlPath.startsWith(targetPath) ? { path: urlPath } : null;
        return children({ match, location });
      }
      const match = urlPath === targetPath ? { path: urlPath } : null;
      return children({ match, location });
    }}
  </Location>
);
QueryMatch.propTypes = {
  children: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired,
  startsWith: PropTypes.bool.isRequired,
};

const QueryLocation = ({ children }) => (
  <Location>
    {({ location }) => {
      const { path } = memoizedQueryParse(location.search);
      return children({ location: path });
    }}
  </Location>
);
QueryLocation.propTypes = {
  children: PropTypes.func.isRequired,
};

const ToggleVisibility = styled.div(
  ({ hidden }) =>
    hidden
      ? {
          display: 'none',
        }
      : {}
);

// Renders when path matches
const Route = ({ path, children, startsWith, hideOnly }) => (
  <QueryMatch path={path} startsWith={startsWith}>
    {({ match }) => {
      if (hideOnly) {
        return <ToggleVisibility hidden={!match}>{children}</ToggleVisibility>;
      }
      return match ? children : null;
    }}
  </QueryMatch>
);
Route.propTypes = {
  children: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired,
  startsWith: PropTypes.bool.isRequired,
  hideOnly: PropTypes.bool.isRequired,
};

const queryNavigate = to => navigate(`?path=${to}`);

export {
  QueryLink as Link,
  QueryMatch as Match,
  QueryLocation as Location,
  Route,
  parseQuery,
  stringifyQuery,
  queryNavigate as navigate,
};

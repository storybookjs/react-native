import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import qs from 'qs';
import memoize from 'memoizerific';

import { Link, Location, navigate, createHistory, LocationProvider } from '@reach/router';

const memoizedQueryParse = memoize(1000)(s => qs.parse(s, { ignoreQueryPrefix: true }));

const componentParams = memoize(1000)(path => {
  const result = {};

  if (path) {
    const [, p1, p2] = path.match(/\/([^/]+)\/([^/]+)?/) || [];
    if (p1 && p1.match(/(components|info)/)) {
      Object.assign(result, {
        viewMode: p1,
        storyId: p2,
      });
    }
  }
  return result;
});

const parseQuery = location => memoizedQueryParse(location.search);
const stringifyQuery = query => qs.stringify(query, { addQueryPrefix: true, encode: false });

const QueryLink = ({ to, children, ...rest }) => (
  <Link to={`?path=${to}`} {...rest}>
    {children}
  </Link>
);

const QueryMatch = ({ children, path: targetPath, startsWith }) => (
  <QueryLocation>
    {({ path: urlPath, ...rest }) => {
      let match;
      if (!urlPath) {
        return null;
      }
      if (startsWith) {
        match = urlPath.startsWith(targetPath) ? { path: urlPath } : null;
      }
      if (typeof targetPath === 'string') {
        match = urlPath === targetPath ? { path: urlPath } : null;
      }
      if (targetPath) {
        match = urlPath.match(targetPath) ? { path: urlPath } : null;
      }
      return children({ match, ...rest });
    }}
  </QueryLocation>
);
QueryMatch.propTypes = {
  children: PropTypes.func.isRequired,
  path: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.instanceOf(RegExp)]).isRequired,
  startsWith: PropTypes.bool,
};
QueryMatch.defaultProps = {
  startsWith: false,
};

const queryNavigate = to => {
  navigate(`?path=${to}`);
};

const QueryLocation = ({ children }) => (
  <Location>
    {({ location }) => {
      const { path } = memoizedQueryParse(location.search);
      return children({ path, location, navigate: queryNavigate, ...componentParams(path) });
    }}
  </Location>
);
QueryLocation.propTypes = {
  children: PropTypes.func.isRequired,
};

const ToggleVisibility = styled.div(({ hidden }) =>
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
  path: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.instanceOf(RegExp)]).isRequired,
  startsWith: PropTypes.bool,
  hideOnly: PropTypes.bool,
};
Route.defaultProps = {
  startsWith: false,
  hideOnly: false,
};
Route.displayName = 'Route';

export {
  QueryLink as Link,
  QueryMatch as Match,
  QueryLocation as Location,
  Route,
  parseQuery,
  stringifyQuery,
  queryNavigate as navigate,
  createHistory,
  LocationProvider,
};

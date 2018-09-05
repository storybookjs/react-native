import React from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import memoize from 'memoizee';

import { Match, Link, Location, Redirect, navigate } from '@reach/router';

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

const QueryLocation = ({ children }) => (
  <Location>
    {({ location }) => {
      const { path } = memoizedQueryParse(location.search);
      return children({ location: path });
    }}
  </Location>
);

// Renders when path matches
const Route = ({ path, children, startsWith }) => (
  <QueryMatch path={path} startsWith={startsWith}>
    {({ match }) => (match ? children : null)}
  </QueryMatch>
);

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

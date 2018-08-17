import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, BrowserRouter as Router, Route, Link, matchPath } from 'react-router-dom';
import qs from 'qs';

const QueryLink = withRouter(({ to, children, location }) => {
  const currentQuery = qs.parse(location.search, { ignoreQueryPrefix: true });

  let conf;
  if (typeof to === 'string') {
    conf = {
      pathname: '/',
      search: qs.stringify({ ...currentQuery, path: to }),
    };
  } else if (typeof to === 'object' && to !== null) {
    const { pathname = '/', search = '', hash = '', state = {} } = to;
    const searchOptions = qs.parse(search, { ignoreQueryPrefix: true });
    conf = {
      ...to,
      pathname: '/',
      search: qs.stringify(
        {
          ...currentQuery,
          ...searchOptions,
          path: pathname,
        },
        hash,
        state
      ),
    };
  } else {
    throw new Error('Invalid prop "to"');
  }

  return <Link to={conf}>{children}</Link>;
});

const QueryRoute = ({ path, render }) =>
  path === null ? (
    <Route render={render} />
  ) : (
    <Route
      render={({ match, location, history }) => {
        const queryString = qs.parse(location.search, { ignoreQueryPrefix: true });

        // keep backwards compatibility by asserting /components as default
        const isAMatch = matchPath(path, { path: queryString.path || '/components' });
        if (isAMatch) return render({ location, match, history, queryString });

        return null;
      }}
    />
  );

QueryRoute.propTypes = {
  path: PropTypes.string,
  render: PropTypes.func,
};

QueryRoute.defaultProps = {
  path: null,
  render: () => null,
};

export { Router, QueryRoute as Route, QueryLink as Link };

import React from 'react';
import PropTypes from 'prop-types';
import { matchPath } from 'react-router';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import qs from 'qs';

const QueryRoute = ({ path, render }) => (
  <Route
    render={({ location, ...props }) => {
      const { path: queryPath } = qs.parse(location.search, { ignoreQueryPrefix: true });

      // keep backwards compatibility by asserting /components as default
      const match = matchPath(path, { path: queryPath || '/components' });
      if (match) return render({ ...props, location, match });

      return null;
    }}
  />
);

QueryRoute.propTypes = {
  path: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
};

export { Router, QueryRoute as Route };

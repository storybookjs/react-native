import React from 'react';
import { matchPath } from 'react-router';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import qs from 'qs';

const QueryLink = props => (
  <Link
    {...props}
    to={{ path: '/', search: qs.stringify({ path: props.to, ...props.query }) }}
  />
);

const QueryRoute = ({ path, render }) => (
  <Route
    render={props => {
      const match = matchPath(path, {
        // keep backwards compatibility by asserting /components as default
        path:
          qs.parse(props.location.search, { ignoreQueryPrefix: true }).path ||
          '/components'
      });

      if (match) {
        return render({ ...props, match });
      }
      return null;
    }}
  />
);

export { Router, QueryRoute as Route, QueryLink as Link };

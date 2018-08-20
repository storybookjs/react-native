
// MOVED TO ui


// import React from 'react';
// import PropTypes from 'prop-types';
// import qs from 'qs';
// import memoize from 'memoizee';

// import { Link, Location } from '@reach/router';

// const memoizedQueryParse = memoize(s => qs.parse(s, { ignoreQueryPrefix: true }));

// const QueryLink = ({ to, children, ...rest }) => (
//   <Link to={`?path=${to}`} {...rest}>
//     {children}
//   </Link>
// );

// const QueryMatch = ({ children, path: targetPath }) => (
//   <Location>
//     {({ location }) => {
//       const { path: urlPath } = memoizedQueryParse(location.search);
//       // super naive route matching
//       const match = targetPath === urlPath ? { path: urlPath } : null;
//       return children({ match, location });
//     }}
//   </Location>
// );

// const QueryLocation = ({ children }) => (
//   <Location>
//     {({ location }) => {
//       const { path } = memoizedQueryParse(location.search);
//       return children({ location: path });
//     }}
//   </Location>
// );

// export { QueryLink as Link, QueryMatch as Match, QueryLocation as Location };

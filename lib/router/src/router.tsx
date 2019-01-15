import React from 'react';

import { Link, Location, navigate, LocationProvider } from '@reach/router';
import { ToggleVisibility } from './visibility';
import { queryFromString, storyDataFromString } from './utils';

interface RenderData {
  path: string;
  location: object;
  navigate: (to: string) => void;
  viewMode?: string;
  storyId?: string;
}
interface MatchingData {
  match: null | { path: string };
}

interface QueryLocationType {
  children: (a: RenderData) => React.ReactNode;
}
interface QueryMatchType {
  path: string;
  startsWith: boolean;
  children: (a: MatchingData) => React.ReactNode;
}
interface RouteType {
  path: string;
  startsWith: boolean;
  hideOnly: boolean;
  children: (a: RenderData) => React.ReactNode;
}

const queryNavigate = (to: string) => {
  navigate(`?path=${to}`);
};

const QueryLink = ({ to, children, ...rest }: { to: string; children: React.ReactNode }) => (
  <Link to={`?path=${to}`} {...rest}>
    {children}
  </Link>
);
QueryLink.displayName = 'QueryLink';

const QueryLocation = ({ children }: QueryLocationType) => (
  <Location>
    {({ location }: { location: { search: string } }) => {
      const { path } = queryFromString(location.search);
      const { viewMode, storyId } = storyDataFromString(path);
      return children({ path, location, navigate: queryNavigate, viewMode, storyId });
    }}
  </Location>
);
QueryLocation.displayName = 'QueryLocation';

const QueryMatch = ({ children, path: targetPath, startsWith = false }: QueryMatchType) => (
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
QueryMatch.displayName = 'QueryMatch';

const Route = ({ path, children, startsWith = false, hideOnly = false }: RouteType) => (
  <QueryMatch path={path} startsWith={startsWith}>
    {({ match }) => {
      if (hideOnly) {
        return <ToggleVisibility hidden={!match}>{children}</ToggleVisibility>;
      }
      return match ? children : null;
    }}
  </QueryMatch>
);
Route.displayName = 'Route';

export { QueryLink as Link };
export { QueryMatch as Match };
export { QueryLocation as Location };
export { Route };
export { queryNavigate as navigate };
export { LocationProvider };

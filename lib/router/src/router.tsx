import React from 'react';

import { Link, Location, navigate, LocationProvider } from '@reach/router';
import { ToggleVisibility } from './visibility';
import { queryFromString, storyDataFromString, getMatch } from './utils';

interface Location {
  search: string;
  href: string;
  origin: string;
  protocol: 'http:' | 'https:';
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  hash: string;
  state: {
    key: string;
  };
  key: string;
  reload: () => void;
  replace: (url: string) => void;
  assign: (url: string) => void;
  toString: () => string;
}

interface RenderData {
  path: string;
  location: Location;
  navigate: (to: string) => void;
  viewMode?: string;
  storyId?: string;
}
interface MatchingData {
  match: null | { path: string };
}

interface QueryLocationProps {
  children: (a: RenderData) => React.ReactNode;
}
interface QueryMatchProps {
  path: string;
  startsWith: boolean;
  children: (matchingData: MatchingData) => React.ReactNode;
}
interface RouteProps {
  path: string;
  startsWith: boolean;
  hideOnly: boolean;
  children: (a: RenderData) => React.ReactNode;
}

interface QueryLinkProps {
  to: string;
  children: React.ReactNode;
}

const queryNavigate = (to: string) => {
  navigate(`?path=${to}`);
};

const QueryLink = ({ to, children, ...rest }: QueryLinkProps) => (
  <Link to={`?path=${to}`} {...rest}>
    {children}
  </Link>
);
QueryLink.displayName = 'QueryLink';

const QueryLocation = ({ children }: QueryLocationProps) => (
  <Location>
    {({ location }: { location: Location }) => {
      const { path } = queryFromString(location.search);
      const { viewMode, storyId } = storyDataFromString(path);
      return children({ path, location, navigate: queryNavigate, viewMode, storyId });
    }}
  </Location>
);
QueryLocation.displayName = 'QueryLocation';

const QueryMatch = ({ children, path: targetPath, startsWith = false }: QueryMatchProps) => (
  <QueryLocation>
    {({ path: urlPath, ...rest }) =>
      children({
        match: getMatch(urlPath, targetPath, startsWith),
        ...rest,
      })
    }
  </QueryLocation>
);
QueryMatch.displayName = 'QueryMatch';

const Route = ({ path, children, startsWith = false, hideOnly = false }: RouteProps) => (
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

import { document } from 'global';
import React, { ReactNode } from 'react';

import {
  Link,
  Location,
  navigate,
  LocationProvider,
  RouteComponentProps,
  NavigateFn,
} from '@reach/router';
import { ToggleVisibility } from './visibility';
import { queryFromString, parsePath, getMatch } from './utils';

interface Other {
  viewMode?: string;
  storyId?: string;
}

export type RenderData = RouteComponentProps & Other;

interface MatchingData {
  match: null | { path: string };
}

interface QueryLocationProps {
  children: (renderData: RenderData) => ReactNode;
}
interface QueryMatchProps {
  path: string;
  startsWith: boolean;
  children: (matchingData: MatchingData) => ReactNode;
}
interface RouteProps {
  path: string;
  startsWith: boolean;
  hideOnly: boolean;
  children: (renderData: RenderData) => ReactNode;
}

interface QueryLinkProps {
  to: string;
  children: ReactNode;
}

const getBase = () => `${document.location.pathname}?`;

const queryNavigate: NavigateFn = (to: string | number) =>
  typeof to === 'number' ? navigate(to) : navigate(`${getBase()}path=${to}`);

// A component that will navigate to a new location/path when clicked
const QueryLink = ({ to, children, ...rest }: QueryLinkProps) => (
  <Link to={`${getBase()}path=${to}`} {...rest}>
    {children}
  </Link>
);
QueryLink.displayName = 'QueryLink';

// A render-prop component where children is called with a location
// and will be called whenever it changes when it changes
const QueryLocation = ({ children }: QueryLocationProps) => (
  <Location>
    {({ location }: RouteComponentProps): ReactNode => {
      const { path } = queryFromString(location.search);
      const { viewMode, storyId } = parsePath(path);
      return children({ path, location, navigate: queryNavigate, viewMode, storyId });
    }}
  </Location>
);
QueryLocation.displayName = 'QueryLocation';

// A render-prop component for rendering when a certain path is hit.
// It's immensly similar to `Location` but it receives an addition data property: `match`.
// match has a truethy value when the path is hit.
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

// A component to conditionally render children based on matching a target path
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

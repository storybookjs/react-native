# Storybook Router

Storybook Router is a wrapper library for reach/router.
It ensures a single version of the router is used everywhere.

It also includes some ready to use utils to read the path, query, viewMode and storyId from location.

It also includes Components:

## Link

A clickable element that will `navigate` to a new location/path.

Props:
- **to** - the path to navigate to
- style, className, etc..

## Location

A render-prop component to get easy render access to all location data

Props:
- **children** - a function that will receive a location when it changes

Location: 
```ts
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
```

## Match

A render-prop component for rendering when a certain path is hit.
It's immensly similar to `Location` but it receives an addition data property: `match`.

match has a truethy value when the path is hit.

Props:
- **children** - see `Location`
- **path** - the path we're trying to match
- **startsWith** - boolean value (default is `false`), only match when targetPath & currentPath match from beginning.

## Route

A component to conditionally render children based on matching a target path.

Props:
- **children** - A React Node
- **path** - the path we're trying to match
- **startsWith** - boolean value (default is `false`), only match when targetPath & currentPath match from beginning.
- **hideOnly** - boolean value (default is `false`), do not ever remove from DOM, instead wrap in `<div hidden />`.

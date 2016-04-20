## Changelog

### v1.16.0
20-April-2016

* Prevent re-rendering the preview iframe when there is an action.
  * Related issue: [#116](https://github.com/kadirahq/react-storybook/issues/116)
  * Related PR: [PR126](https://github.com/kadirahq/react-storybook/pull/126)

### v1.15.0
20-April-2016

* Improve action logger UI and increase max log count to 10. See [PR123](https://github.com/kadirahq/react-storybook/pull/123)

### v1.14.0
19-April-2016

* Add syntax highlights to the logger. See: [PR118](https://github.com/kadirahq/react-storybook/pull/118)

### v1.13.0

* Add some UI test cases. See [PR103](https://github.com/kadirahq/react-storybook/pull/103)
* Implement `.addDecorator()` API. See [PR115](https://github.com/kadirahq/react-storybook/pull/115)
* Add code folding support. See [PR111](https://github.com/kadirahq/react-storybook/pull/111)

### v1.12.0
14-April-2016

* Add support for webpack module preLoaders. See: [PR107](https://github.com/kadirahq/react-storybook/pull/107)

### v1.11.0
13-April-2016

* Add support for React DevTools. See: [PR104](https://github.com/kadirahq/react-storybook/pull/104)

### v1.10.2
12-April-2016

Fix various issues related to static bundling.

* Add custom head generation to static build as well.
* Use relative urls so, static sites can be host with paths (GH Pages)
* Identify SyntheticEvent using feature detection. UglifyJS mangal class names, so we can't use classnames to detect a SyntheticEvent in the static build.

### v1.10.1

* Don't serve index.html in static directory as a site index. See [PR100](https://github.com/kadirahq/react-storybook/pull/100)
* Use cjson for parsing .babelrc files (support comments). See [PR98](https://github.com/kadirahq/react-storybook/pull/98)
* Remove the dist directory before running babel to avoid older code. See [PR101](https://github.com/kadirahq/react-storybook/pull/101)

### v1.10.0

* Add custom head support inside the iframe. See [PR77](https://github.com/kadirahq/react-storybook/pull/77)
* Unmount components before rendering into DOM node. Fix: [#81](https://github.com/kadirahq/react-storybook/issues/81)
* Add a static file builder. See [PR88](https://github.com/kadirahq/react-storybook/pull/88)
* Fix search box's lineHeight to work with all the browsers. See: [PR94](https://github.com/kadirahq/react-storybook/pull/94)
* Add the search box. See: [PR91](https://github.com/kadirahq/react-storybook/pull/91).

### v1.9.0

Add some minor improvements.

* Avoid deprecated warning in Chrome Canary. See: [PR85](https://github.com/kadirahq/react-storybook/pull/85)
* Fix the React Warning about CSS property. See: [PR84](https://github.com/kadirahq/react-storybook/pull/84)
* Transition on latest logged action. See: [PR80](https://github.com/kadirahq/react-storybook/pull/80)

### v1.8.0

* Add story linking functionality.
  * [Documentation](https://github.com/kadirahq/react-storybook/blob/master/docs/api.md#linking-stories).
  * Original feature request: [#50](https://github.com/kadirahq/react-storybook/issues/50)
  * Implementation: [PR86](https://github.com/kadirahq/react-storybook/pull/86)

### v1.7.0

* Add support to React v15.0.0.

### v1.6.0

* Make scrollable layout. See: [PR](https://github.com/kadirahq/react-storybook/pull/70)
* Add npm3 requirement to the `package.json`.
* Add `react` and `react-dom` to devDependencies.

### v1.5.0

* Add support for most of the custom webpack configuration. See [PR64](https://github.com/kadirahq/react-storybook/pull/64)

### v1.4.0

* Add CLI option to specify the config dir. See [PR52](https://github.com/kadirahq/react-storybook/pull/52).

### v1.3.0

* Load the `.babelrc` manually. Fixed: [#41](https://github.com/kadirahq/react-storybook/issues/41)
* Add a better contributing guide. See [CONTRIBUTING.md](https://github.com/kadirahq/react-storybook/blob/master/CONTRIBUTING.md)
* Add a development utility `npm run dev` which watches "src" directory and run `npm run prepublish`.

### v1.2.0

* Add a button to clear logs in the ActionLogger. This is requested in [PR21](https://github.com/kadirahq/react-storybook/issues/21).
* Remove navigation list order hijacking. See [commit](https://github.com/kadirahq/react-storybook/commit/166365fd38f51f79e69e028a1c11e2620eddcb99).
* Fix a typo in .gitignore. See [PR31](https://github.com/kadirahq/react-storybook/pull/31).
* Add support for JSX. See [PR18](https://github.com/kadirahq/react-storybook/pull/18).

### v1.1.0

* v1.0.0 was a mistake and it contains very old code. That's why we had to do a 1.1.0 release.

### v1.0.0

* Yeah!

# CHANGELOG

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

---

## [1.2.1] - 2019-04-14

## Feature

- General improvement on addon performance and internal typing.


## [1.2.0] - 2019-04-11

## Feature

- Extend framework supports to Vue - (#14).

### Deprecation

- `import { withContexts } from 'addon-contexts'` has been deprecated.  Please import from 'addon-contexts/react'
instead.


## [1.1.0] - 2019-04-07

### Feature

- Rewrite the wrapper implementation so it can be extended into other frameworks later - (#14).

### Bug fixes

- Fix bug: problems in adding extra contextual environment into the Storybook toolbar at the story level.

### Chore

- Update devDependencies.
- Remove react from peerDependencies (since it is required by the Storybook core already).


## [1.0.7] - 2019-03-31

### Bug fixes

- Fix typo - (#12)


## [1.0.6] - 2019-03-31

### Bug fixes

- Fix bug: use addon-contexts without param specified - (#11).


## [1.0.5] - 2019-03-31

- Skip v1.0.4 due to a bad release.

### Feature

- Add type annotation for `withContexts` story decorator - (#7).

### Doc

- Improve the quality of README.md. - (#5)

### Chore

- Upgrade TypeScript to 3.4.1.
- Update package organization.
- Optimize package bundling process.


## [1.0.3] - 2019-03-30

- Skip v1.0.2 due to a bad release.

### Bug fixes

- Fix the whitelist issue and install warnings for publishing on NPM.
- Remove babel source map to strip down bundling size.


## [1.0.1] - 2019-03-29

### Bug fixes

- Fix register path problem.

### Chore

- Move all dependencies into peerDependencies.
- Add initial README.md.


## [1.0.0] - 2019-03-29

### Feature

- Initial release.

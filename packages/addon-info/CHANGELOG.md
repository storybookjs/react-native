# Change Log

### v3.3.0

* Add setDefaults function [PR114](https://github.com/kadirahq/react-storybook-addon-info/pull/114)

### v3.2.4

* Add missing dist files [PR113](https://github.com/kadirahq/react-storybook-addon-info/pull/113)

### v3.2.3

* Handle number type nodes [PR110](https://github.com/kadirahq/react-storybook-addon-info/pull/110)

### v3.2.2

* Use markdown-to-react-components npm package instead of our fork. Our PR to them is merged and published. [PR109](https://github.com/kadirahq/react-storybook-addon-info/pull/109)

### v3.2.1

* Handle false values for types [PR54](https://github.com/kadirahq/react-storybook-addon-info/pull/54)

### v3.2.0

* Support custom MTRC config [PR54](https://github.com/kadirahq/react-storybook-addon-info/pull/54)
* Fix propTables prop validation with a default value [PR55](https://github.com/kadirahq/react-storybook-addon-info/pull/55)

### v3.1.4

* Remove propTables prop validation warning [PR53](https://github.com/kadirahq/react-storybook-addon-info/pull/53)
* Update example storybook [PR52](https://github.com/kadirahq/react-storybook-addon-info/pull/52)

### v3.1.3

* Fix wrong detection of propType when isRequired is set [PR49](https://github.com/kadirahq/react-storybook-addon-info/pull/49)
* Add displayName for Button [PR51](https://github.com/kadirahq/react-storybook-addon-info/pull/51)

### v3.1.2

* Fixed a bug which made the `info` to not display and the `options` parameter to be ignored when `info` is not given.[PR45](https://github.com/kadirahq/react-storybook-addon-info/pull/45)

### v3.1.1

* Add a z-index for rendered items to make the overlay always display on top [PR38](https://github.com/kadirahq/react-storybook-addon-info/pull/38)

### v3.1.0

* Make the `info` argument optional [PR37](https://github.com/kadirahq/react-storybook-addon-info/pull/37)

### v3.0.10

* Render the component inside a div element when on inline mode [PR34](https://github.com/kadirahq/react-storybook-addon-info/pull/34)

### v3.0.9

* Add missing `@kadira/storybook` devDependencies [PR25](https://github.com/kadirahq/react-storybook-addon-info/pull/25)
* Improve prop rendering in jsx source view [PR24](https://github.com/kadirahq/react-storybook-addon-info/pull/24)
* Avoid warning message with "webkitFontSmoothing" [PR30](https://github.com/kadirahq/react-storybook-addon-info/pull/30)
* Remove max-width style rule for wrapper [PR31](https://github.com/kadirahq/react-storybook-addon-info/pull/31) and [PR36](https://github.com/kadirahq/react-storybook-addon-info/pull/36)
* Improve prop table rendering (handle css resets) [PR32](https://github.com/kadirahq/react-storybook-addon-info/pull/32)

### v3.0.8

* Fixed unkeyed array iteration warning in React with: [PR23](https://github.com/kadirahq/react-storybook-addon-info/pull/23)

### v3.0.7

* Improve default display in prop table. See [#16](https://github.com/kadirahq/react-storybook-addon-info/pull/16)

### v3.0.6

* Improve function type and react element type props display. See [#14](https://github.com/kadirahq/react-storybook-addon-info/pull/14)

### v3.0.5

* Over-indentation of ending tag in source code is fixed. See [#13](https://github.com/kadirahq/react-storybook-addon-info/pull/13)

### v3.0.4

* Remove the need to use json-loader with webpack when using this package.
See: [#12](https://github.com/kadirahq/react-storybook-addon-info/issues/12)

### v3.0.0

* Add the version which works as an React Storybook addon.

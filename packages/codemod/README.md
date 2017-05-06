# @storybook/codemod

> Codemod

A collection of codemod scripts written with JSCodeshift

## Installation

```sh
yarn add @storybook/codemod
```

## Transforms

### add-organisation-to-package-name

Updates package names in imports to include our organisation name prefix
(`@storybook/`), stripping off the old `@storybook/` prefix.

```js
> jscodeshift -t add-organisation-to-package-name path/to/source.js
```

Example:

```js
import { storiesOf } from '@storybook/storybook';
```

 becomes

```js
import { storiesOf } from '@storybook/storybook';
```

# Storybook Info Addon

[![Build Status on CircleCI](https://circleci.com/gh/storybooks/storybook.svg?style=shield)](https://circleci.com/gh/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)  
[![Storybook Slack](https://now-examples-slackin-rrirkqohko.now.sh/badge.svg)](https://now-examples-slackin-rrirkqohko.now.sh/)
[![Backers on Open Collective](https://opencollective.com/storybook/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/storybook/sponsors/badge.svg)](#sponsors)

* * *

Storybook Info Addon will show additional information for your stories in [Storybook](https://storybook.js.org).
Useful when you want to display usage or other types of documentation alongside your story.

This addon works with Storybook for:
- [React](https://github.com/storybooks/storybook/tree/master/app/react)

![Screenshot](docs/home-screenshot.png)

## Installation

Install the following npm module:

```sh
npm i -D @storybook/addon-info
```

## Basic usage

Then wrap your story with the `withInfo`, which is a function that takes either
documentation text or an options object:

```js
import { withInfo } from '@storybook/addon-info';

storiesOf('Component', module)
  .add('simple info',
    withInfo(`
      description or documentation about my component, supports markdown
    
      ~~~js
      <Button>Click Here</Button>
      ~~~
    
    `)(() =>
      <Component>Click the "?" mark at top-right to view the info.</Component>
    )
  )
```

## Usage with options

`withInfo` can also take an [options object](#global-options) in case you want to configure how
the info panel looks on a per-story basis:

```js
import { withInfo } from '@storybook/addon-info';

storiesOf('Component', module)
  .add('simple info',
    withInfo({
      styles: {
        header: {
          h1: {
            color: 'red'
          }
        }
      },
      text: 'String or React Element with docs about my component', // Warning! This option's name will be likely renamed to "summary" in 3.3 release. Follow this PR #1501 for details
      // other possible options see in Global options section below
    })(() =>
      <Component>Click the "?" mark at top-right to view the info.</Component>
    )
  )
```

The `styles` prop can also accept a function. The default stylesheet is passed as argument:

```js
import { withInfo } from '@storybook/addon-info';

storiesOf('Component', module)
  .add('custom info styles using a function',
    withInfo({
      styles: stylesheet => ({
        ...stylesheet,
        header: {
          ...stylesheet.header,
          h1: {
            ...stylesheet.header.h1,
            color: 'red'
          }
        }
      })
    })(() =>
      <Component>Click the "?" mark at top-right to view the info.</Component>
    )
  )
```

## Usage as decorator

It is possible to add infos by default to all components by using a global or story decorator. The drawback is you won't be able to display a distinct info message per story.

It is important to declare this decorator as **the first decorator**, otherwise it won't work well.

```js
addDecorator((story, context) => withInfo('common info')(story)(context));
```

## Global options

To configure default options for all usage of the info option, use `setDefaults` in `.storybook/config.js`:

```js
// config.js
import { setDefaults } from '@storybook/addon-info';

// addon-info
setDefaults({
  header: false, // Toggles display of header with component name and description
});
```

## Options and Defaults

```js
{
  header: false, // Toggles display of header with component name and description
  inline: true, // Displays info inline vs click button to view
  source: true, // Displays the source of story Component
  propTables: [/* Components used in story */], // displays Prop Tables with this components
  propTablesExclude: [], // Exclude Components from being shown in Prop Tables section
  styles: {}, // Overrides styles of addon. The object should follow this shape: https://github.com/storybooks/storybook/blob/master/addons/info/src/components/Story.js#L19. This prop can also accept a function which has the default stylesheet passed as an argument.
  components: {}, // Overrides components used to display markdown
  maxPropsIntoLine: 1, // Max props to display per line in source code
  maxPropObjectKeys: 10, // Displays the first 10 characters of the prop name
  maxPropArrayLength: 10, // Displays the first 10 items in the default prop array
  maxPropStringLength: 100, // Displays the first 100 characters in the default prop string,
  TableComponent: props => {}, // Override the component used to render the props table
}
```

## Deprecated usage

There is also a deprecated API that is slated for removal in Storybook 4.0.

```js
import { configure, setAddon } from '@storybook/react';
import infoAddon from '@storybook/addon-info';

setAddon(infoAddon);

configure(function () {
  //...
}, module);
```

Then create your stories with the `.addWithInfo` API.

```js
import React from 'react';
import { storiesOf } from '@storybook/react';
import Component from './Component';

storiesOf('Component')
  .addWithInfo(
    'simple usage',
    `This is the basic usage with the button with providing a label to show the text.`,
    () => (
      <Component>Click the "?" mark at top-right to view the info.</Component>
    ),
  );
```

> Have a look at [this example](example/story.js) stories to learn more about the `addWithInfo` API.

To customize your defaults:

```js
// config.js
import infoAddon, { setDefaults } from '@storybook/addon-info';

// addon-info
setDefaults({
  inline: true,
  maxPropsIntoLine: 1,
  maxPropObjectKeys: 10,
  maxPropArrayLength: 10,
  maxPropStringLength: 100,
});
setAddon(infoAddon);
```

### Rendering a Custom Table

The `TableComponent` option allows you to define how the prop table should be rendered. Your component will be rendered with the following props.

```js
  {
    propDefinitions: Array<{
      property: string, // The name of the prop
      propType: Object | string, // The prop type. TODO: info about what this object is...
      required: boolean, // True if the prop is required
      description: string, // The description of the prop
      defaultValue: any // The default value of the prop
    }>
  }
```

Example:

```js
// button.js
// @flow
import React from 'react'

const paddingStyles = {
  small: '4px 8px',
  medium: '8px 16px'
}

const Button = ({
  size,
  ...rest
}: {
  /** The size of the button */
  size: 'small' | 'medium'
}) => {
  const style = {
    padding: paddingStyles[size] || ''
  }
  return <button style={style} {...rest} />
}
Button.defaultProps = {
  size: 'medium'
}

export default Button
```
```js
// stories.js
import React from "react";

import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import Button from "./button";

const Red = props => <span style={{ color: "red" }} {...props} />;

const TableComponent = ({ propDefinitions }) => {
  const props = propDefinitions.map(
    ({ property, propType, required, description, defaultValue }) => {
      return (
        <tr key={property}>
          <td>
            {property}
            {required ? <Red>*</Red> : null}
          </td>
          <td>{propType.name}</td>
          <td>{defaultValue}</td>
          <td>{description}</td>
        </tr>
      );
    }
  );

  return (
    <table>
      <thead>
        <tr>
          <th>name</th>
          <th>type</th>
          <th>default</th>
          <th>description</th>
        </tr>
      </thead>
      <tbody>{props}</tbody>
    </table>
  );
};

storiesOf("Button", module).add(
  "with text",
  withInfo({
    TableComponent
  })(() => <Button>Hello Button</Button>)
);
```

### React Docgen Integration

React Docgen is included as part of the @storybook/react package through the use of `babel-plugin-react-docgen` during babel compile time.
When rendering a story with a React component commented in this supported format, the Addon Info description will render the comments above the component declaration and the prop table will display the prop's comment in the description column.

```js
import React from 'react';
import PropTypes from 'prop-types';

/** Button component description */
const DocgenButton = ({ disabled, label, style, onClick }) =>
  <button disabled={disabled} style={style} onClick={onClick}>
    {label}
  </button>;

DocgenButton.defaultProps = {
  disabled: false,
  onClick: () => {},
  style: {},
};

DocgenButton.propTypes = {
  /** Boolean indicating whether the button should render as disabled */
  disabled: PropTypes.bool,
  /** button label. */
  label: PropTypes.string.isRequired,
  /** onClick handler */
  onClick: PropTypes.func,
  /** component styles */
  style: PropTypes.shape,
};

export default DocgenButton;
```

Comments above flow types are also supported. Storybook Info Addon should now render all the correct types for your component if the PropTypes are in the same file as the React component.

## The FAQ

**Components lose their names on static build**

Component names also get minified with other javascript code when building for production.
When creating components, set the `displayName` static property to show the correct component name on static builds.

# addon-backgrounds

[![Build Status](https://travis-ci.org/storybooks/addon-backgrounds.svg?branch=travis)](https://travis-ci.org/storybooks/addon-backgrounds)

![React Storybook Screenshot](./.storybook/backgrounds.gif)

### Getting Started

```sh
npm i --save @storybook/addon-backgrounds
```

Then create a file called `addons.js` in your storybook config.

Add following content to it:

```js
import '@storybook/addon-backgrounds/register';
```

Then write your stories like this:

```js
import React from 'react';
import { storiesOf } from "@storybook/react";
import backgrounds from "@storybook/addon-backgrounds";

storiesOf("Button", module)
  .addDecorator(backgrounds([
    { name: "twitter", value: "#00aced", default: true },
    { name: "facebook", value: "#3b5998" },
  ]))
  .add("with text", () => <button>Click me</button>);
```

### Development

This project is built using typescript and is tested with jest. To get started, clone this repo and run the following command:

```bash
$ npm install # install node deps
```

To run the project locally, run:

```bash
$ npm run storybook # for storybook testing
# (coming soon) $ npm run test-watch # for testing
```

To test the project run:

```bash
$ npm test
```

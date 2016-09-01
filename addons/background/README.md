<p align="center" >
  <a href="http://newspring.cc">
    <img src="https://s3.amazonaws.com/ns.images/newspring/icons/newspring-church-logo-black.png" alt="NewSpring Church" title="NewSpring Church" />
  </a>
</p>

react-storybook-addon-backgrounds
=======================
[![Build Status](https://travis-ci.org/NewSpring/react-storybook-addon-backgrounds.svg?branch=travis)](https://travis-ci.org/NewSpring/react-storybook-addon-backgrounds) [![Coverage Status](https://coveralls.io/repos/github/NewSpring/react-storybook-addon-backgrounds/badge.svg?branch=master)](https://coveralls.io/github/NewSpring/react-storybook-addon-backgrounds?branch=master)

![React Storybook Screenshot](./.storybook/backgrounds.gif)

### Getting Started

```sh
npm i --save react-storybook-addon-backgrounds
```

Then create a file called `addons.js` in your storybook config.

Add following content to it:

```js
import '@kadira/storybook/addons';
import 'react-storybook-addon-backgrounds/register';
```

Then write your stories like this:

```js
import React from 'react';
import { storiesOf } from "@kadira/storybook";
import backgrounds from "react-storybook-addon-backgrounds";

storiesOf("Button", module)
  .addDecorator(backgrounds([
    { name: "twitter", value: "#00aced" },
    { name: "facebook", value: "#3b5998" },
  ]))
  .add("with text", () => <button>Click me</button>)
  ;
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

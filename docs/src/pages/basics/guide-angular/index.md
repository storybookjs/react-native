---
id: 'guide-angular'
title: 'Storybook for Angular'
---

You may have tried to use our quick start guide to setup your project for Storybook. If you want to set up Storybook manually, this is the guide for you.

> This will also help you understand how Storybook works.

## Starter Guide Angular

Storybook has its own webpack setup and a dev server.  
The webpack setup is very similar to [Angular CLI](https://cli.angular.io), but allows you to [configure it however you want](/configurations/custom-webpack-config/).

In this guide, we are trying to set up Storybook for your Angular project.

## Table of contents

-   [Create Angular project](#create-angular-project)
-   [Add @storybook/angular](#add-storybookangular)
-   [Create the config file](#create-the-config-file)
-   [Write your stories](#write-your-stories)
-   [Run your Storybook](#run-your-storybook)

## Create Angular project

First of all, you need to prepare an Angular project. To do that, run:

```sh
npm i -g @angular/cli
ng new your-angular-prj
cd your-angular-prj
```

## Add @storybook/angular

Next, install `@storybook/angular` to your project:

```sh
npm i --save-dev @storybook/angular
```

Then add the following NPM script to your package json in order to start the storybook later in this guide:

```json
{
  "scripts": {
    "storybook": "start-storybook -p 9001 -c .storybook"
  }
}
```

## Create the config file

Storybook can be configured in several different ways. 
That’s why we need a config directory. We've added a `-c` option to the above NPM script mentioning `.storybook` as the config directory.

For the basic Storybook configuration file, you don't need to do much, but simply tell Storybook where to find stories.

To do that, simply create a file at `.storybook/config.js` with the following content:

```js
import { configure } from '@storybook/angular';

function loadStories() {
  require('../stories/index.ts');
}

configure(loadStories, module);
```

That'll load stories in `../stories/index.ts`.

Just like that, you can load stories from wherever you want to.

## Write your stories

Now you can write some stories inside the `../stories/index.ts` file, like this:

```js
import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { MyButtonComponent } from '../src/app/my-button/my-button.component';

storiesOf('My Button', module)
  .add('with some emoji', () => ({
    component: MyButtonComponent,
    props: {
      text: '😀 😎 👍 💯',
    },
  }))
  .add('with some emoji and action', () => ({
    component: MyButtonComponent,
    props: {
      text: '😀 😎 👍 💯',
      click: action('clicked'),
    },
  }));
```

Each story is a single state of your component. In the above case, there are two stories for the MyButton component:

1.  story with `@Input()` property binding.
2.  story with `@Input()` and `@Output()` property binding.

## Run your Storybook

Now everything is ready. Simply run your storybook with:

```sh
npm run storybook
```

Now you can change components and write stories whenever you need to.
You'll get those changes into Storybook in a snap with the help of webpack's HMR API.

## Tips

### Configure style rules

If you use `templateUrl` in your components, you need to configure webpack rules for .css/.scss files. Create a file named `webpack.config.js` under the config directory(by default `.storybook`):

```js
const genDefaultConfig = require('@storybook/angular/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);

  // Overwrite .css rule
  const cssRule = config.module.rules.find(rule => rule.test && rule.test.toString() === '/\\.css$/');
  if (cssRule) {
    cssRule.exclude = /\.component\.css$/;
  }

  // Add .scss rule
  config.module.rules.unshift({
    test: /\.scss$/,
    loaders: ['raw-loader', 'sass-loader'],
  });

  return config;
};
```

If you want more details, see [customize the webpack config](/configurations/custom-webpack-config/).

---
id: 'guide-riot'
title: 'Storybook for Riot'
---

You may have tried to use our quick start guide to setup your project for Storybook. If you want to set up Storybook manually, this is the guide for you.

> This will also help you understand how Storybook works.

## Starter Guide Riot

Storybook has its own Webpack setup and a dev server.
The Webpack setup is very similar to [tag-loader](https://github.com/riot/tag-loader), but allows you to [configure it however you want](/configurations/custom-webpack-config/).

In this guide, we are trying to set up Storybook for your Riot project.

## Table of contents

-   [Add @storybook/riot](#add-storybookriot)
-   [Add riot and babel-core](#add-riot-and-babel-core)
-   [Create the NPM script](#create-the-npm-script)
-   [Create the config file](#create-the-config-file)
-   [Write your stories](#write-your-stories)
-   [Run your Storybook](#run-your-storybook)

## Add @storybook/riot

First of all, you need to add `@storybook/riot` to your project. To do that, simply run:

```sh
npm i --save-dev @storybook/riot
```

## Add riot and babel-core

Make sure that you have `riot`, the `riot-compiler`, the `riot-tag-loader` and `babel-core` in your dependencies as well because we list it as a peerDependency:

```sh
npm i --save riot
npm i --save-dev babel-core riot-compiler riot-tag-loader
```

## Create the NPM script

Add the following NPM script to your `package.json` in order to start the storybook later in this guide:

    {
      "scripts": {
        "storybook": "start-storybook -p 9001 -c .storybook"
      }
    }

## Create the config file

Storybook can be configured in several different ways.
That’s why we need a config directory. We've added a `-c` option to the above NPM script mentioning `.storybook` as the config directory.

There are 3 things you need to tell Storybook to do:

1.  Import and globally register with [`riot.mount()`](https://riot.js.org/api/#mounting) any global custom components just like you did with your project.
2.  Require your stories.

Here's an example `.storybook/config.js` to get you started:

```js
import { configure } from '@storybook/riot';

import riot from 'riot';

// Import your custom components.
import Mybutton from '../src/stories/Button.tag'; //eslint-disable-line no-unused-vars

// Register custom components.
riot.mount('my-button'); // registers Button.tag

function loadStories() {
  // You can require as many stories as you need.
  require('../src/stories');
}

configure(loadStories, module);
```

This example registered your custom `Button.tag` component, and loaded your Storybook stories defined in `../stories/index.js`.

All custom components can be registered before or after calling `configure()`.

> This stories folder is just an example, you can load stories from wherever you want to.
> We think stories are best located close to the source files.

## Write your stories

There are several ways to implement a story using either a text import or a component import

```js
import { storiesOf } from '@storybook/riot';
import { tag2, mount } from 'riot';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/no-unresolved
import SimpleTestRaw from 'raw-loader!./SimpleTest.tag';
// eslint-disable-next-line no-unused-vars
import anothertest from './AnotherTest.tag';

storiesOf('Story|How to create a story', module)
  .add(
    'built with tag2', // the template is compiled below
    () =>
      tag2('test', '<div>simple test ({ opts.value })</div>', '', '', () => {}) &&
      mount('root', 'test', { value: 'with a parameter' }))

  // tags[0] will be the parent tag, always
  // you can leave out the root tag, if we find out that the new root tag
  // is a built-in html tag, it will be wrapped
  .add('built as string', () => ({ tags: ['<test><div>simple test</div></test>'] })

  // the component is a string, it will be instantiated without params
  // e.g. <SimpletestRaw/>
  .add('built from raw import', () => SimpleTestRaw)

  // the comprehensive form is this one
  // list all the possible tags (the root element is in the content)
  // then scenario is compiled and executed
  .add(
    'built from tags and scenario',
    () => ({
      tags: [{ content: SimpleTestRaw, boundAs: 'mustBeUniquePlease' }],
      scenario:
        '<SimpleTest test={ "with a parameter" } value={"value is mapped to riotValue"}></SimpleTest>',
    }),
    {
      notes:
        'WARN : the tag file root element must have exactly the same name (or else you will see nothing)',
    }
  )

  // the tag is already compiled before running the js
  // the tag name 'anothertest' must match exactly the root tag inside the tag file
  // mind the lower case
  .add('built from the precompilation', () => mount('root', 'anothertest', {}), {
    notes: 'WARN, only works in lower case, never upper case with precompiled templates',
  });
```

## Run your Storybook

Now everything is ready. Simply run your storybook with:

```sh
npm run storybook
```

Now you can change components and write stories whenever you need to.
You'll get those changes into Storybook in a snap with the help of Webpack's HMR API.

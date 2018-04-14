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
-   [Add @storybook/angular and babel-core](#add-storybookangular-and-babel-core)
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

## Add @storybook/angular and babel-core

Next, install `@storybook/angular` and `babel-core` (it's a peerDependency) to your project:

```sh
npm i --save-dev @storybook/angular babel-core
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
  require('../src/stories/index.ts');
}

configure(loadStories, module);
```

That'll load stories in `../src/stories/index.ts`.

Just like that, you can load stories from wherever you want to.

## Write your stories

Now you can write some stories inside the `../src/stories/index.ts` file, like this:

```js
import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { MyButtonComponent } from '../app/my-button/my-button.component';

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

## Module Metadata

If your component has dependencies on other Angular directives and modules, these can be supplied using the `moduleMetadata` property on an individual story:

```js
import { CommonModule } from '@angular/common';
import { storiesOf } from '@storybook/angular';
import { MyButtonComponent } from '../app/my-button/my-button.component';
import { MyPanelComponent } from '../app/my-panel/my-panel.component';
import { MyDataService } from '../app/my-data/my-data.service';

storiesOf('My Panel', module)
  .add('Default', () => ({
    component: MyPanelComponent,
    moduleMetadata: {
      imports: [CommonModule],
      schemas: [],
      declarations: [MyButtonComponent],
      providers: [MyDataService],
    }
  }));
```

If you have metadata that is common between your stories, this can configured once using the `moduleMetadata()` decorator:

```js
import { CommonModule } from '@angular/common';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { MyButtonComponent } from '../app/my-button/my-button.component';
import { MyPanelComponent } from '../app/my-panel/my-panel.component';
import { MyDataService } from '../app/my-data/my-data.service';

storiesOf('My Panel', module)
  .addDecorator(
    moduleMetadata({
      imports: [CommonModule],
      schemas: [],
      declarations: [MyButtonComponent],
      providers: [MyDataService],
    })
  )
  .add('Default', () => ({
    component: MyPanelComponent
  }))
  .add('with a title', () => ({
    component: MyPanelComponent,
    props: {
      title: 'Foo',
    }
  }));
```
## Trouble Shooting

If you have problems running @angular/cli using "ng serve" after install specifically the following error: 

```ERROR in node_modules/@storybook/angular/index.d.ts(31,44): error TS2304: Cannot find name 'NodeRequire'.```

You may need to exclude your stories from being compiled when running your angular dev environment.  To do this add "stories", "\*\*/\*.stories.ts" to the exclude section in src/app/tsconfig.app.json:

```json
{
  "exclude": [
    "stories",
    "**/*.stories.ts"
  ]
}
```

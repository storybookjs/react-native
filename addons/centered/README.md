# Storybook Centered Decorator

Storybook Centered Decorator can be used to center components inside the preview in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

### Usage

```sh
npm install @storybook/addon-centered --save-dev
```

#### As a decorator

You can set the decorator locally.

example for React:

```js
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered';

import MyComponent from '../Component';

storiesOf('MyComponent', module)
  .addDecorator(centered)
  .add('without props', () => (<MyComponent />))
  .add('with some props', () => (<MyComponent text="The Comp"/>));
```

example for Vue:

```js
import { storiesOf } from '@storybook/vue';
import centered from '@storybook/addon-centered';

import MyComponent from '../Component.vue';
storiesOf('MyComponent', module)
  .addDecorator(centered)
  .add('without props', () => ({
    components: { MyComponent },
    template: '<my-component />'
  }))
  .add('with some props', () => ({
    components: { MyComponent },
    template: '<my-component text="The Comp"/>'
  }));
```

example for Preact:

```js
import { storiesOf } from '@storybook/preact';
import centered from '@storybook/addon-centered/preact';

import MyComponent from '../Component';

storiesOf('MyComponent', module)
  .addDecorator(centered)
  .add('without props', () => (<MyComponent />))
  .add('with some props', () => (<MyComponent text="The Comp"/>));
```

example for Svelte:

```js
import { storiesOf } from '@storybook/svelte';
import Centered from '@storybook/addon-centered/svelte';

import Component from '../Component.svelte';

storiesOf('Addon|Centered', module)
  .addDecorator(Centered)
  .add('rounded', () => ({
    Component,
    data: {
      rounded: true,
      text: "Look, I'm centered!",
    },
  }))
```

example for Mithril:

```js
import { storiesOf } from '@storybook/mithril';
import centered from '@storybook/addon-centered/mithril';

import MyComponent from '../Component';

storiesOf('MyComponent', module)
  .addDecorator(centered)
  .add('without props', () => ({
    view: () => <MyComponent />
  }))
  .add('with some props', () => ({
    view: () => <MyComponent text="The Comp"/>
  }));
```

example for Angular with component:

```ts
import { centered } from '@storybook/addon-centered/angular';
import { storiesOf } from '@storybook/angular';
import { AppComponent } from '../app/app.component';

storiesOf('Addon|Centered', module)
  .addDecorator(centered)
  .add('centered component', () => ({
    component: AppComponent,
    props: {},
  }));

```

example for Angular with template:

```ts
import { centered } from '@storybook/addon-centered/angular';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { AppComponent } from '../app/app.component';

storiesOf('Addon|Centered', module)
  .addDecorator(
    moduleMetadata({
      declarations: [Button],
    })
  )
  .addDecorator(centered)
  .add('centered template', () => ({
    template: `<storybook-button-component
        [text]="text" (onClick)="onClick($event)">
      </storybook-button-component>`,
    props: {
      text: 'Hello Button',
      onClick: event => {
        console.log('some bindings work');
        console.log(event);
      },
    },
  }));
```

Also, you can also add this decorator globally

example for React:

```js
import { configure, addDecorator } from '@storybook/react';
import centered from '@storybook/addon-centered';

addDecorator(centered);

configure(function () {
  //...
}, module);
```

example for Vue:

```js
import { configure, addDecorator } from '@storybook/vue';
import centered from '@storybook/addon-centered';

addDecorator(centered);

configure(function () {
  //...
}, module);
```

example for Svelte:

```js
import { configure, addDecorator } from '@storybook/svelte';
import Centered from '@storybook/addon-centered/svelte';

addDecorator(Centered);

configure(function () {
  //...
}, module);
```

example for Mithril:

```js
import { configure, addDecorator } from '@storybook/mithril';
import centered from '@storybook/addon-centered/mithril';

addDecorator(centered);

configure(function () {
  //...
}, module);
```

#### As an extension

##### 1 - Configure the extension

```js
import { configure, setAddon } from '@storybook/react';
import centered from '@storybook/addon-centered';

setAddon({
  addCentered(storyName, storyFn) {
    this.add(storyName, (context) => (
      centered.call(context, storyFn)
    ));
  },
});

configure(function () {
  //...
}, module);
```

##### 2 - Use it in your story

```js
import { storiesOf } from '@storybook/react';

import Component from '../Component';

storiesOf('Component', module)
  .addCentered('without props', () => (<Component />))
```

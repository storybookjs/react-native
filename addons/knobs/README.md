# Storybook Addon Knobs

[![Build Status on CircleCI](https://circleci.com/gh/storybooks/storybook.svg?style=shield)](https://circleci.com/gh/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)  
[![Storybook Slack](https://now-examples-slackin-rrirkqohko.now.sh/badge.svg)](https://now-examples-slackin-rrirkqohko.now.sh/)
[![Backers on Open Collective](https://opencollective.com/storybook/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/storybook/sponsors/badge.svg)](#sponsors)

* * *

Storybook Addon Knobs allow you to edit React props dynamically using the Storybook UI.
You can also use Knobs as a dynamic variable inside stories in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

This is how Knobs look like:

[![Storybook Knobs Demo](docs/storybook-knobs-example.png)](https://git.io/vXdhZ)

> Checkout the above [Live Storybook](https://git.io/vXdhZ) or [watch this video](https://www.youtube.com/watch?v=kopW6vzs9dg&feature=youtu.be).

## Getting Started

First of all, you need to install knobs into your project as a dev dependency.

```sh
npm install @storybook/addon-knobs --save-dev
```

Then, configure it as an addon by adding it to your `addons.js` file (located in the Storybook config directory).

```js
import '@storybook/addon-knobs/register'
```

Now, write your stories with knobs.

### With React
```js
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react';

const stories = storiesOf('Storybook Knobs', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);

// Knobs for React props
stories.add('with a button', () => (
  <button disabled={boolean('Disabled', false)} >
    {text('Label', 'Hello Button')}
  </button>
));

// Knobs as dynamic variables.
stories.add('as dynamic variables', () => {
  const name = text('Name', 'Arunoda Susiripala');
  const age = number('Age', 89);

  const content = `I am ${name} and I'm ${age} years old.`;
  return (<div>{content}</div>);
});
```

### With Angular
```js
import { storiesOf } from '@storybook/angular';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs/angular';

import { Button } from '@storybook/angular/demo';

const stories = storiesOf('Storybook Knobs', module);

// "withKnobs" decorator should be applied before the stories using knobs
stories.addDecorator(withKnobs);

// Knobs for Angular props
stories.add('with text', () => ({
  component: Button,
  props: {
   text: text('text', 'Hello Button'), // The first param of the knob function has to be exactly the same as the component input.
  },
}));

```

Categorize your knobs by assigning them a `groupId`. When a `groupId` exists, tabs will appear in the knobs storybook panel to filter between the groups. Knobs without a `groupId` are automatically categorized into the `ALL` group.
```
// Knob assigned a groupId.
stories.add('as dynamic variables', () => {
  const groupId = 'GROUP-ID1'
  const name = text('Name', 'Arunoda Susiripala', groupId);

  const content = `My name is ${name}.`;
  return (<div>{content}</div>);
});
```

> In the case of Vue, use these imports:
>
> ```js
> import { storiesOf } from '@storybook/vue';
> import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/vue';
> ```
>
> In the case of React-Native, use these imports:
>
> ```js
> import { storiesOf } from '@storybook/react-native';
> import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react';
> ```
>
> In the case of Angular, use these imports:
>
> ```js
> import { storiesOf } from '@storybook/angular';
> import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/angular';
> ```
>
> In the case of Mithril, use these imports:
>
> ```js
> import { storiesOf } from '@storybook/mithril';
> import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/mithril';
> ```

You can see your Knobs in a Storybook panel as shown below.

![](docs/demo.png)

### Additional Links

-   Introduction blog post.
-   Watch this video on how to use knobs
-   [Live Storybook with Knobs](https://goo.gl/uX9WLf)
-   Have a look at this [sample Storybook repo](https://github.com/kadira-samples/storybook-knobs-example).

## Available Knobs

These are the knobs available for you to use. You can import these Knobs from the `@storybook/addon-knobs` module.
Here's how to import the **text** Knob.

```js
import { text } from '@storybook/addon-knobs';
```

Just like that, you can import any other following Knobs:

### text

Allows you to get some text from the user.

```js
import { text } from '@storybook/addon-knobs/react';

const label = 'Your Name';
const defaultValue = 'Arunoda Susiripala';
const groupId = 'GROUP-ID1';

const value = text(label, defaultValue, groupId);
```
### boolean

Allows you to get a boolean value from the user.

```js
import { boolean } from '@storybook/addon-knobs/react';

const label = 'Agree?';
const defaultValue = false;
const groupId = 'GROUP-ID1';

const value = boolean(label, defaultValue, groupId);
```
### number

Allows you to get a number from the user.

```js
import { number } from '@storybook/addon-knobs/react';

const label = 'Age';
const defaultValue = 78;
const groupId = 'GROUP-ID1';

const value = number(label, defaultValue);
```

For use with `groupId`, pass the default `options` as the third argument
```
const value = number(label, defaultValue, {}, groupId);
```
### number bound by range

Allows you to get a number from the user using a range slider.

```js
import { number } from '@storybook/addon-knobs/react';

const label = 'Temperature';
const defaultValue = 73;
const options = {
   range: true,
   min: 60,
   max: 90,
   step: 1,
};
const groupId = 'GROUP-ID1';

const value = number(label, defaultValue, options, groupId);
```

### color

Allows you to get a colour from the user.

```js
import { color } from '@storybook/addon-knobs/react';

const label = 'Color';
const defaultValue = '#ff00ff';
const groupId = 'GROUP-ID1';

const value = color(label, defaultValue, groupId);
```

### object

Allows you to get a JSON object or array from the user.

```js
import { object } from '@storybook/addon-knobs/react';

const label = 'Styles';
const defaultValue = {
  backgroundColor: 'red'
};
const groupId = 'GROUP-ID1';

const value = object(label, defaultValue, groupId);
```

> Make sure to enter valid JSON syntax while editing values inside the knob.

### array

Allows you to get an array of strings from the user.

```js
import { array } from '@storybook/addon-knobs/react';

const label = 'Styles';
const defaultValue = ['Red'];
const groupId = 'GROUP-ID1';

const value = array(label, defaultValue);
```

> While editing values inside the knob, you will need to use a separator.
> By default it's a comma, but this can be override by passing a separator variable.
>
> ```js
> import { array } from '@storybook/addon-knobs/react';
>
> const label = 'Styles';
> const defaultValue = ['Red'];
> const separator = ':';
> const value = array(label, defaultValue, separator);
> ```

For use with `groupId`, pass the default `separator` as the third argument
```
const value = array(label, defaultValue, ',', groupId);
```

### select

Allows you to get a value from a select box from the user.

```js
import { select } from '@storybook/addon-knobs/react';

const label = 'Colors';
const options = {
  red: 'Red',
  blue: 'Blue',
  yellow: 'Yellow',
};
const defaultValue = 'red';
const groupId = 'GROUP-ID1';

const value = select(label, options, defaultValue, groupId);
```

> You can also provide options as an array like this: `['red', 'blue', 'yellow']`

### selectV2

In v4 this will replace `select`. The value from the select now uses the values from the `options` object.

```js
import { selectV2 } from '@storybook/addon-knobs';

const label = 'Colors';
const options = {
  Red: 'red',
  Blue: 'blue',
  Yellow: 'yellow',
  Rainbow: ['red', 'orange', 'etc'],
  None: null,
};
const defaultValue = 'Red';
const groupId = 'GROUP-ID1';

const value = selectV2(label, options, defaultValue, groupId);
```

### files

Allows you to get a value from a file input from the user.

```js
import { files } from '@storybook/addon-knobs/react';

const label = 'Images';
const defaultValue = [];

const value = files(label, accept, defaultValue);
```

> Multiple files can be selected, and will be returned as an array of [Data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)

### date

Allow you to get date (and time) from the user.

```js
import { date } from '@storybook/addon-knobs/react';

const label = 'Event Date';
const defaultValue = new Date('Jan 20 2017');
const groupId = 'GROUP-ID1';

const value = date(label, defaultValue, groupId);
```

> Note: the default value must not change - e.g., do not do `date('Label', new Date())` or `date('Label')`

The `date` knob returns the selected date as stringified Unix timestamp (e.g. `"1510913096516"`).
If your component needs the date in a different form you can wrap the `date` function:

```js
function myDateKnob(name, defaultValue) {
  const stringTimestamp = date(name, defaultValue)
  return new Date(stringTimestamp)
}
```

### button

Allows you to include a button and associated handler.

```js
import { button } from '@storybook/addon-knobs';

const label = 'Do Something';
const handler = () => doSomething('foobar');
const groupId = 'GROUP-ID1';

button(label, handler, groupId);
```

### withKnobs vs withKnobsOptions

If you feel like this addon is not performing well enough there is an option to use `withKnobsOptions` instead of `withKnobs`.
Usage:

```js
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Storybook Knobs', module);

stories.addDecorator(withKnobsOptions({
  debounce: { wait: number, leading: boolean}, // Same as lodash debounce.
  timestamps: true // Doesn't emit events while user is typing.
}));
```

## Typescript

If you are using typescript, make sure you have the type definitions installed for the following libs:

-   node
-   react

You can install them using `npm install -save @types/node @types/react`, assuming you are using Typescript >2.0.

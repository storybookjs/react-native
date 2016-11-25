# Storybook Addon Knobs [![CircleCI](https://circleci.com/gh/storybooks/storybook-addon-knobs.svg?style=shield)](https://circleci.com/gh/storybooks/storybook-addon-knobs)

Knobs allow you to edit React props dynamically using the Storybook UI.
You can also use Knobs as a dynamic variable inside stories.

This is how Knobs look like:

[![Storybook Knobs Demo](docs/storybook-knobs-example.png)](https://git.io/vXdhZ)

> Checkout the above [Live Storybook](https://git.io/vXdhZ) or [watch this video](https://www.youtube.com/watch?v=kopW6vzs9dg&feature=youtu.be).

## Getting Started

First of all, you need to install knobs into your project as a dev dependency.

```js
npm i -D @kadira/storybook-addon-knobs
```

Then, configure it as an addon by adding it to your `addons.js` file (located in the Storybook config directory).

```js
//  To get our default addons (actions and links)
import '@kadira/storybook/addons';
//  To add the knobs addon
import '@kadira/storybook-addon-knobs/register'
```

Now, write your stories with knobs.

```js
import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { withKnobs, text, boolean, number } from '@kadira/storybook-addon-knobs';

const stories = storiesOf('Storybook Knobs', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);

// Knobs for React props
stories.add('with a button', () => (
  <button
    disabled={boolean('Disabled', false)}
  >
    {text('Label', 'Hello Button')}
  </button>
))

// Knobs as dynamic variables.
stories.add('as dynamic variables', () => {
  const name = text('Name', 'Arunoda Susiripala');
  const age = number('Age', 89);

  const content = `I am ${name} and I'm ${age} years old.`;
  return (<div>{content}</div>);
});
```

You can see your Knobs in a Storybook panel as shown below.

![](docs/demo.png)

### Additional Links

* Introduction blog post.
* Watch this video on how to use knobs
* [Live Storybook with Knobs](https://goo.gl/uX9WLf)
* Have a look at this [sample Storybook repo](https://github.com/kadira-samples/storybook-knobs-example).

## Available Knobs

These are the knobs available for you to use. You can import these Knobs from the `@kadira/storybook-addon-knobs` module.
Here's how to import the **text** Knob.

```js
import { text } from '@kadira/storybook-addon-knobs';
```

Just like that, you can import any other following Knobs:

### text

Allows you to get some text from the user.

```js
const label = 'Your Name';
const defaultValue = 'Arunoda Susiripala';

const value = text(label, defaultValue);
```

### boolean

Allows you to get a boolean value from the user.

```js
const label = 'Agree?';
const defaultValue = false;

const value = boolean(label, defaultValue);
```

### number

Allows you to get a number from the user.

```js
const label = 'Age';
const defaultValue = 78;

const value = number(label, defaultValue);
```

### number bound by range

Allows you to get a number from the user using a range slider.

```js
const label = 'Temperature';
const defaultValue = 73;
const options = {
   range: true,
   min: 60,
   max: 90,
   step: 1,
};

const value = number(label, defaultValue, options);
```

### color

Allows you to get a color from the user.

```js
const label = 'Color';
const defaultValue = '#ff00ff';

const value = color(label, defaultValue);
```

### object

Allows you to get a JSON object from the user.

```js
const label = 'Styles';
const defaultValue = {
  backgroundColor: 'red'
};

const value = object(label, defaultValue);
```

> Make sure to enter valid JSON syntax while editing values inside the knob.

### array

Allows you to get an array from the user.

```js
const label = 'Styles';
const defaultValue = ['Red']

const value = array(label, defaultValue);
```

> While editing values inside the knob, you will need to use a separator. By default it's a comma, but this can be
 override by passing a separator variable.
> ```js
> const separator = ':';
> const value = array(label, defaultValue, separator);
> ```

### select

Allows you to get a value from a select box from the user.

```js
const label = 'Colors';
const options = {
  red: 'Red',
  blue: 'Blue',
  yellow: 'Yellow',
};
const defaultValue = 'red';

const value = select(label, options, defaultValue);
```

> You can also provide options as an array like this: ['red', 'blue', 'yellow']

### date

Allow you to get date (and time) from the user.

```js
const label = 'Event Date';
const defaultValue = new Date('Jan 20 2017');
const value = date(label, defaultValue);
```

## Typescript

If you are using typescript, make sure you have the type definitions installed for the following libs:

- node
- react

You can install them using `npm i -S @types/node @types/react`, assuming you are using Typescript >2.0.

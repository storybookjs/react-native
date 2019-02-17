# Storybook Addon On Device Knobs

Storybook Addon On Device Knobs allow you to edit React props dynamically using the Storybook UI.
You can also use Knobs as a dynamic variable inside stories in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

This is how Knobs look like:

[![Storybook Knobs Demo](docs/storybook-knobs-example.png)](https://storybooks-official.netlify.com/?knob-Dollars=12.5&knob-Name=Storyteller&knob-Years%20in%20NY=9&knob-background=%23ffff00&knob-Age=70&knob-Items%5B0%5D=Laptop&knob-Items%5B1%5D=Book&knob-Items%5B2%5D=Whiskey&knob-Other%20Fruit=lime&knob-Birthday=1484870400000&knob-Nice=true&knob-Styles=%7B%22border%22%3A%223px%20solid%20%23ff00ff%22%2C%22padding%22%3A%2210px%22%7D&knob-Fruit=apple&selectedKind=Addons%7CKnobs.withKnobs&selectedStory=tweaks%20static%20values&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybooks%2Fstorybook-addon-knobs)

**This addon is a wrapper for addon [@storybook/addon-knobs](https://github.com/storybooks/storybook/blob/master/addons/knobs).
Refer to its documentation to understand how to use knobs**


## Getting Started

First of all, you need to install knobs into your project.

```sh
yarn add @storybook/addon-ondevice-knobs @storybook/addon-knobs --dev
```

Then create a file called `rn-addons.js` in your storybook config.

```js
import '@storybook/addon-ondevice-knobs/register';
```
> `@storybook/addon-ondevice-knobs` use register only.


Then import `rn-addons.js` next to your `getStorybookUI` call.
```js
import './rn-addons';
```

Now, write your stories with knobs.

**Refer to [@storybook/addon-knobs](https://github.com/storybooks/storybook/blob/master/addons/knobs) to learn how to write stories.**

**Note:** you'll still have to install `@storybook/addon-knobs` as well and import `withKnobs` and all knob types _(e.g. `select`, `text` etc)_ from that module.

```js
// Example
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

// Write your story...
```

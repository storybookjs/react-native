# Addons

Storybook supports addons. You can read more about them [here](https://storybook.js.org/addons/introduction/)

There is one big difference in React Native is that it has two types of addons: Addons that work in the browser
and addons that work on the app itself (on device addons).

## Browser addons
Browser addons are default addons to storybook. You create a file called addons.js inside storybook and it is
automatically added inside your browser.

## On device addons
On device addons are addons that are displayed in your app in addons panel.
To use them you have to create a file called `rn-addons.js` next to your storybook entry.
Because React Native does not dynamically resolve imports, you also have to manually import them.
Example:
**storybook/index.js**
```
import { getStorybookUI, configure } from '@storybook/react-native';
import './rn-addons';
// import stories
configure(() => {
  require($PATH_TO_STORIES);
}, module);

const StorybookUI = getStorybookUI();
export default StorybookUI;
```

**storybook/rn-addons.js**
```
import '@storybook/addon-ondevice-knobs/register';
import '@storybook/addon-ondevice-notes/register';
...
```

This step is done automatically when you install Storybook for the first time and also described in [Manual Setup](https://github.com/storybooks/storybook/blob/master/app/react-native/docs/manual-setup.md)

## Compatibility
Addon compatibilty can be found [here](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

## Performance of on device addons
Because on device addons are inside the app, they are also rerendered on every change. This can reduce performance a lot.
 
## Writing the on device addons
On device addons use same addon store and api as web addons. The only difference in api is that you don't have `api` prop 
and have to rely on channel for everything. 

The main difference between browser and app addons is that the render has to be supported by React Native (View, Text).
For more info about writing addons read [writing addons](https://storybook.js.org/addons/writing-addons/) section in 
storybook documentation.  

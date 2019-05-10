# Storybook addon for design assets

This addon for storybook allows you to link to image files, other files, and even url's for embedding in the storybook panel!

You can add as many assets to a single story as you want.

## Install

```sh
npm install @storybook/addon-design-assets
```

## Usage
within `addons.js`:

```js
import '@storybook/addon-design-assets/register';
```

within your stories:
```js
import { storiesOf } from '@storybook/react';

import imageUrl from './images/my-image.jpg'; 

storiesOf('root|group/component', module)
  .addParameters({
    assets: [
      imageUrl, // link to a file imported
      'https://via.placeholder.com/300/09f/fff.png', // link to an external image
      'https://www.example.com', // link to a webpage
      'https://www.example.com?id={id}', // link to a webpage with the current story's id in the url
    ],
  })
  .add('variant', () => <div>your story here</div>);
```

If you have a set of different assets on 1 story, you might want to name then:
```js
import { storiesOf } from '@storybook/react';

import imageUrl from './images/my-image.jpg'; 

storiesOf('root|group/component', module)
  .addParameters({
    assets: [{
      url: 'https://via.placeholder.com/300/09f/fff.png', // link to an external image
      name: 'blue',
    }, {
      url: 'https://via.placeholder.com/300/f90/fff.png', // link to an external image
      name: 'orange',
    }],
  })
  .add('variant', () => <div>your story here</div>);
```

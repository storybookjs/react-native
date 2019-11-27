# Storybook addon for design assets

This addon for storybook allows you to link to image files, other files, and even url's for embedding in the storybook panel!

You can add as many assets to a single story as you want.

## Install

```sh
npm install @storybook/addon-design-assets
```

## Usage
within `.storybook/main.js`:

```js
module.exports = {
  addons: ['@storybook/addon-design-assets/register']
}
```

within your stories:
```js
import React from 'react';

import imageUrl from './images/my-image.jpg'; 

export default {
  title: 'Design Assets',
  parameters: {
    assets: [
      imageUrl, // link to a file imported
      'https://via.placeholder.com/300/09f/fff.png', // link to an external image
      'https://www.example.com', // link to a webpage
      'https://www.example.com?id={id}', // link to a webpage with the current story's id in the url
    ],
  },
};

export const defaultView = () => (
  <div>your story here</div>
);

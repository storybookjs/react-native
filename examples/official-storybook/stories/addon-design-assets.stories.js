import React from 'react';

export default {
  title: 'Addons|Design assets',

  parameters: {
    options: {
      selectedPanel: 'storybook/design-assets/panel',
    },
  },
};

export const singleImage = () => <div>This story should a single image in the assets panel</div>;

singleImage.story = {
  name: 'single image',

  parameters: {
    assets: ['https://via.placeholder.com/300/09f/fff.png'],
  },
};

export const singleWebpage = () => <div>This story should a single image in the assets panel</div>;

singleWebpage.story = {
  name: 'single webpage',

  parameters: {
    assets: ['https://www.example.com'],
  },
};

export const youtubeVideo = () => <div>This story should a single image in the assets panel</div>;

youtubeVideo.story = {
  name: 'youtube video',

  parameters: {
    assets: ['https://www.youtube.com/embed/p-LFh5Y89eM'],
  },
};

export const multipleImages = () => (
  <div>This story should a multiple images in the assets panel</div>
);

multipleImages.story = {
  name: 'multiple images',

  parameters: {
    assets: [
      'https://via.placeholder.com/600/09f/fff.png',
      'https://via.placeholder.com/600/f90/fff.png',
    ],
  },
};

export const namedAssets = () => <div>This story should a single image in the assets panel</div>;

namedAssets.story = {
  name: 'named assets',

  parameters: {
    assets: [
      {
        name: 'blue',
        url: 'https://via.placeholder.com/300/09f/fff.png',
      },
      {
        name: 'orange',
        url: 'https://via.placeholder.com/300/f90/fff.png',
      },
    ],
  },
};

export const urlReplacement = () => (
  <div>This story should have a webpge, with within it's url the storyId</div>
);

urlReplacement.story = {
  name: 'url replacement',

  parameters: {
    assets: ['https://via.placeholder.com/600.png?text={id}'],
  },
};

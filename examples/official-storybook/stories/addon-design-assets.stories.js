import React from 'react';

export default {
  title: 'Addons/Design assets',

  parameters: {
    options: {
      selectedPanel: 'storybook/design-assets/panel',
    },
  },
};

export const SingleImage = () => <div>This story should a single image in the assets panel</div>;

SingleImage.story = {
  name: 'single image',

  parameters: {
    assets: ['https://via.placeholder.com/300/09f/fff.png'],
  },
};

export const SingleWebpage = () => <div>This story should a single image in the assets panel</div>;

SingleWebpage.story = {
  name: 'single webpage',

  parameters: {
    assets: ['https://www.example.com'],
  },
};

export const YoutubeVideo = () => <div>This story should a single image in the assets panel</div>;

YoutubeVideo.story = {
  name: 'youtube video',

  parameters: {
    assets: ['https://www.youtube.com/embed/p-LFh5Y89eM'],
  },
};

export const MultipleImages = () => (
  <div>This story should a multiple images in the assets panel</div>
);

MultipleImages.story = {
  name: 'multiple images',

  parameters: {
    assets: [
      'https://via.placeholder.com/600/09f/fff.png',
      'https://via.placeholder.com/600/f90/fff.png',
    ],
  },
};

export const NamedAssets = () => <div>This story should a single image in the assets panel</div>;

NamedAssets.story = {
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

export const UrlReplacement = () => (
  <div>This story should have a webpge, with within it's url the storyId</div>
);

UrlReplacement.story = {
  name: 'url replacement',

  parameters: {
    assets: ['https://via.placeholder.com/600.png?text={id}'],
  },
};

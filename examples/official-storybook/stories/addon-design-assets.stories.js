import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Addons|Design assets', module)
  .addParameters({
    options: {
      selectedPanel: 'storybook/design-assets/panel',
    },
  })
  .add('single image', () => <div>This story should a single image in the assets panel</div>, {
    assets: ['https://via.placeholder.com/300/09f/fff.png'],
  })
  .add('single webpage', () => <div>This story should a single image in the assets panel</div>, {
    assets: ['https://www.example.com'],
  })
  .add('youtube video', () => <div>This story should a single image in the assets panel</div>, {
    assets: ['https://www.youtube.com/embed/p-LFh5Y89eM'],
  })

  .add(
    'multiple images',
    () => <div>This story should a multiple images in the assets panel</div>,
    {
      assets: [
        'https://via.placeholder.com/600/09f/fff.png',
        'https://via.placeholder.com/600/f90/fff.png',
      ],
    }
  )
  .add('named assets', () => <div>This story should a single image in the assets panel</div>, {
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
  })
  .add(
    'url replacement',
    () => <div>This story should have a webpge, with within it's url the storyId</div>,
    {
      assets: ['https://via.placeholder.com/600.png?text={id}'],
    }
  );

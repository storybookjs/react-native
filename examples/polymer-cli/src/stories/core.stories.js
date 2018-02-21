import { storiesOf, addOptions } from '@storybook/polymer';

const globalOption = 'globalOption';
const chapterOption = 'chapterOption';
const storyOption = 'storyOption';

addOptions({ globalOption });

storiesOf('Core|Options', module)
  .addOptions({ chapterOption })
  .add('passed to story', ({ options }) => `<div>${JSON.stringify(options)}</div>`, {
    storyOption,
  });

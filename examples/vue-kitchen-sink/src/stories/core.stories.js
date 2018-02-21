import { storiesOf, addOptions } from '@storybook/vue';

const globalOption = 'globalOption';
const chapterOption = 'chapterOption';
const storyOption = 'storyOption';

addOptions({ globalOption });

storiesOf('Core|Options', module)
  .addOptions({ chapterOption })
  .add(
    'passed to story',
    ({ options }) => ({
      template: `<div>${JSON.stringify(options)}</div>`,
    }),
    {
      storyOption,
    }
  );

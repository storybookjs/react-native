import { storiesOf, addOptions } from '@storybook/angular';
import { Button } from '@storybook/angular/demo';

const globalOption = 'globalOption';
const chapterOption = 'chapterOption';
const storyOption = 'storyOption';

addOptions({ globalOption });

storiesOf('Core|Options', module)
  .addOptions({ chapterOption })
  .add(
    'passed to story',
    ({ options }) => ({
      component: Button,
      props: {
        text: JSON.stringify(options),
        onClick: () => 0,
      },
    }),
    { storyOption }
  );

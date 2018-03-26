import { storiesOf, addParameters } from '@storybook/angular';
import { Button } from '@storybook/angular/demo';

const globalParameter = 'globalParameter';
const chapterParameter = 'chapterParameter';
const storyParameter = 'storyParameter';

addParameters({ globalParameter });

storiesOf('Core|Parameters', module)
  .addParameters({ chapterParameter })
  .add(
    'passed to story',
    ({ parameters: { fileName, ...parameters } }) => ({
      component: Button,
      props: {
        text: `Parameters are ${JSON.stringify(parameters)}`,
        onClick: () => 0,
      },
    }),
    { storyParameter }
  );

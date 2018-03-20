import { storiesOf, addParameters } from '@storybook/vue';

const globalParameter = 'globalParameter';
const chapterParameter = 'chapterParameter';
const storyParameter = 'storyParameter';

addParameters({ globalParameter });

storiesOf('Core|Parameters', module)
  .addParameters({ chapterParameter })
  .add(
    'passed to story',
    ({ parameters: { fileName, ...parameters } }) => ({
      template: `<div>Parameters are ${JSON.stringify(parameters)}</div>`,
    }),
    {
      storyParameter,
    }
  );

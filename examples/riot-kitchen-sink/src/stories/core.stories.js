import { tag, mount, storiesOf, addParameters } from '@storybook/riot';

const globalParameter = 'globalParameter';
const chapterParameter = 'chapterParameter';
const storyParameter = 'storyParameter';

tag('parameters', '<div>Parameters are {JSON.stringify (this.opts)}</div>', '', '', () => {});

addParameters({ globalParameter });

storiesOf('Core|Parameters', module)
  .addParameters({ chapterParameter })
  .add('passed to story', ({ parameters: { fileName, ...parameters } }) =>
    mount('parameters', { ...parameters, storyParameter })
  );

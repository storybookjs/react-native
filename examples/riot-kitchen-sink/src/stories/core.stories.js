import { storiesOf, addParameters } from '@storybook/riot';
import { tag2, mount } from 'riot';

const globalParameter = 'globalParameter';
const chapterParameter = 'chapterParameter';
const storyParameter = 'storyParameter';

tag2('parameters', '<div>Parameters are {JSON.stringify (this.opts)}</div>', '', '', () => {});

addParameters({ globalParameter });

storiesOf('Core|Parameters', module)
  .addParameters({ chapterParameter })
  .add('passed to story', ({ parameters: { fileName, ...parameters } }) =>
    mount('root', 'parameters', { ...parameters, storyParameter })
  );

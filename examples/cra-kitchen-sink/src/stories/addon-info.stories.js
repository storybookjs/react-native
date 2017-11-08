import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';

import DocgenButton from '../components/DocgenButton';
import FlowTypeButton from '../components/FlowTypeButton';
import BaseButton from '../components/BaseButton';

storiesOf('Addon Info.React Docgen', module)
  .add(
    'Comments from PropType declarations',
    withInfo(
      'Comments above the PropType declarations should be extracted from the React component file itself and rendered in the Info Addon prop table'
    )(() => <DocgenButton onClick={action('clicked')} label="Docgen Button" />)
  )
  .add(
    'Comments from Flow declarations',
    withInfo(
      'Comments above the Flow declarations should be extracted from the React component file itself and rendered in the Info Addon prop table'
    )(() => <FlowTypeButton onClick={action('clicked')} label="Flow Typed Button" />)
  )
  .add(
    'Comments from component declaration',
    withInfo(
      'Comments above the component declaration should be extracted from the React component file itself and rendered below the Info Addon heading'
    )(() => <BaseButton onClick={action('clicked')} label="Button" />)
  );

const markdownDescription = `
#### You can use markdown in your withInfo() description.

Sometimes you might want to manually include some code examples:
~~~js
const codeblock = [];
~~~

Maybe include a [link](http://storybook.js.org) to your project as well.
`;

storiesOf('Addon Info.Markdown', module).add(
  'Displays Markdown in description',
  withInfo(markdownDescription)(() => <BaseButton onClick={action('clicked')} label="Button" />)
);

storiesOf('Addon Info.Options.inline', module).add(
  'Inlines component inside story',
  withInfo({
    text: 'Component should be inlined between description and PropType table',
    inline: true, // Displays info inline vs click button to view
  })(() => <BaseButton label="Button" />)
);

storiesOf('Addon Info.Options.header', module).add(
  'Shows or hides Info Addon header',
  withInfo({
    text: 'The Info Addon header should be hidden',
    header: false, // Toggles display of header with component name and description
  })(() => <BaseButton label="Button" />)
);

storiesOf('Addon Info.Options.source', module).add(
  'Shows or hides Info Addon source',
  withInfo({
    text: 'The Info Addon source section should be hidden',
    source: false, // Displays the source of story Component
  })(() => <BaseButton label="Button" />)
);

storiesOf('Addon Info.Options.propTables', module).add(
  'Shows additional component prop tables',
  withInfo({
    text: 'There should be a prop table added for a component not included in the story',
    propTables: [FlowTypeButton],
  })(() => <BaseButton label="Button" />)
);

storiesOf('Addon Info.Options.propTablesExclude', module).add(
  'Exclude component from prop tables',
  withInfo({
    text: 'This can exclude extraneous components from being displayed in prop tables.',
    propTablesExclude: [FlowTypeButton],
  })(() => (
    <div>
      <BaseButton label="Button" />
      <FlowTypeButton label="Flow Typed Button" />
    </div>
  ))
);

storiesOf('Addon Info.Options.styles', module).add(
  'Change info styles // I think this is broken or I am using it wrong?',
  withInfo({
    styles: { backgroundColor: 'blue' },
  })(() => <BaseButton label="Button" />)
);

storiesOf('Addon Info.Decorator', module)
  .addDecorator((story, context) =>
    withInfo('Info could be used as a global or local decorator as well.')(story)(context)
  )
  .add('Use Info as story decorator', () => <BaseButton label="Button" />);

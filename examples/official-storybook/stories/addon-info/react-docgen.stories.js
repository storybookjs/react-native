import React from 'react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';

import { DocgenButton } from '../../components/DocgenButton';
import FlowTypeButton from '../../components/FlowTypeButton';
import BaseButton from '../../components/BaseButton';
import { NamedExportButton } from '../../components/NamedExportButton';

export default {
  title: 'Addons/Info/React Docgen',
  component: DocgenButton,
  decorators: [withInfo],
};

export const CommentsFromPropTypeDeclarations = () => (
  <DocgenButton
    onClick={action('clicked')}
    label="Docgen Button"
    disabled={false}
    one={{ key: 1 }}
    shape={{
      id: 3,
      arr: [],
      shape: {
        shape: {
          foo: 'bar',
        },
      },
      func: () => {},
    }}
    arrayOf={[1, 2, 3]}
  />
);

CommentsFromPropTypeDeclarations.story = {
  name: 'Comments from PropType declarations',

  parameters: {
    info:
      'Comments above the PropType declarations should be extracted from the React component file itself and rendered in the Info Addon prop table',
  },
};

export const CommentsFromFlowDeclarations = () => (
  <FlowTypeButton onClick={action('clicked')} label="Flow Typed Button" />
);

CommentsFromFlowDeclarations.story = {
  name: 'Comments from Flow declarations',

  parameters: {
    info:
      'Comments above the Flow declarations should be extracted from the React component file itself and rendered in the Info Addon prop table',
  },
};

export const CommentsFromComponentDeclaration = () => (
  <BaseButton onClick={action('clicked')} label="Button" />
);

CommentsFromComponentDeclaration.story = {
  name: 'Comments from component declaration',

  parameters: {
    info:
      'Comments above the component declaration should be extracted from the React component file itself and rendered below the Info Addon heading',
  },
};

export const CommentsFromNamedExportComponentDeclaration = () => (
  <NamedExportButton onClick={action('clicked')} label="Button" />
);

CommentsFromNamedExportComponentDeclaration.story = {
  name: 'Comments from named export component declaration',

  parameters: {
    info:
      'Comments above the component declaration should be extracted from the React component file itself and rendered below the Info Addon heading',
  },
};

const markdownDescription = `
#### You can use markdown in your withInfo description.

Sometimes you might want to manually include some \`code\` examples:

~~~js
const Button = () => <button />;
~~~

classes in javascript

~~~javascript
export class FromComponent {
  form = new FormControl({
    searchTerm: new FromControl(''),
    searchDate: new FromControl(''),
    endDate: new FromControl(''),
  })
}
~~~

html with special formatting

~~~html
<foo-outer property-a="value"
           property-b="value"
           property-c="value">
  <foo-inner property-a="value"
             property-b="value" />
</foo-outer>
~~~


Maybe include a [link](http://storybook.js.org) to your project as well.
`;

import React from 'react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';

import BaseButton from '../../components/BaseButton';
import externalMdDocs from './EXAMPLE.md';

export default {
  title: 'Addons|Info/Markdown',
  decorators: [withInfo],
  excludeStories: ['markdownDescription'],
};

export const markdownDescription = `
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

export const displaysMarkdownInDescription = () => (
  <BaseButton onClick={action('clicked')} label="Button" />
);

displaysMarkdownInDescription.story = {
  name: 'Displays Markdown in description',
  parameters: { info: markdownDescription },
};

export const fromInternalMarkdownFile = () => (
  <BaseButton onClick={action('clicked')} label="Button" />
);

fromInternalMarkdownFile.story = {
  name: 'From internal Markdown file',

  parameters: {
    info: `
    # internal
    ## markdown
    file
  `,
  },
};

export const fromExternalMarkdownFile = () => (
  <BaseButton onClick={action('clicked')} label="Button" />
);

fromExternalMarkdownFile.story = {
  name: 'From external Markdown file',
  parameters: { info: externalMdDocs },
};

import React from 'react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import BaseButton from '../../components/BaseButton';

import { markdownDescription } from '../addon-info/markdown.stories';

export default {
  title: 'Addons/Info/deprecated',
};

export const DisplaysMarkdown = withInfo(markdownDescription)(() => (
  <BaseButton onClick={action('clicked')} label="Button" />
));

DisplaysMarkdown.story = { name: 'Displays Markdown in description' };

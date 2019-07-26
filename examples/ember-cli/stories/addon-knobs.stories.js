import hbs from 'htmlbars-inline-precompile';
import { withKnobs, text, color, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Addon|Knobs',
  decorators: [withKnobs],

  parameters: {
    options: { selectedPanel: 'storybookjs/knobs/panel' },
  },
};

export const withText = () => ({
  template: hbs`
      {{welcome-banner
        style=(if hidden "display: none")
        backgroundColor=backgroundColor
        titleColor=titleColor
        subTitleColor=subTitleColor
        title=title
        subtitle=subtitle
        click=(action onClick)
      }}
    `,
  context: {
    hidden: boolean('hidden', false),
    backgroundColor: color('backgroundColor', '#FDF4E7'),
    titleColor: color('titleColor', '#DF4D37'),
    subTitleColor: color('subTitleColor', '#B8854F'),
    title: text('title', 'Welcome to storybook'),
    subtitle: text('subtitle', 'This environment is completely editable'),
    onClick: action('clicked'),
  },
});

withText.story = {
  name: 'with text',
};

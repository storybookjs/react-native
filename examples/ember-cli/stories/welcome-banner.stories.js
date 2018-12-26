import hbs from 'htmlbars-inline-precompile';
import { storiesOf } from '@storybook/ember';
import { action } from '@storybook/addon-actions';

storiesOf('welcome-banner', module).add('basic', () => ({
  template: hbs`
      {{welcome-banner
        backgroundColor=backgroundColor
        titleColor=titleColor
        subTitleColor=subTitleColor
        title=title
        subtitle=subtitle
        click=(action onClick)
      }}
    `,
  context: {
    backgroundColor: '#FDF4E7',
    titleColor: '#DF4D37',
    subTitleColor: '#B8854F',
    title: 'Welcome to storybook',
    subtitle: 'This environment is completely editable',
    onClick: action('clicked'),
  },
}));

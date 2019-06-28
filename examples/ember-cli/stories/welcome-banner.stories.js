import hbs from 'htmlbars-inline-precompile';
import { action } from '@storybook/addon-actions';

export default {
  title: 'welcome-banner',
};

export const basic = () => ({
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
});

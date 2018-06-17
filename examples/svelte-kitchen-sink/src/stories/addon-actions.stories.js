import { storiesOf } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';

import ButtonView from './views/ButtonView.svelte';
import Button from '../components/Button.svelte';

storiesOf('Addon|Actions', module)
  .add('Action on view method', () => ({
    Component: ButtonView,
    methods: {
      onButtonClicked: action('I am logging in the actions tab'),
    },
  }))
  .add('Action on component method', () => ({
    Component: Button,
    methods: {
      onClick: action('I am logging in the actions tab too'),
    },
  }));

import renderStorybookUI from '@storybook/storybook-ui';
import Provider from './provider';

const rootEl = document.getElementById('root');
renderStorybookUI(rootEl, new Provider({ url: location.host, options: window.storybookOptions }));

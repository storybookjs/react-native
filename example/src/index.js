import render from '@kadira/storybook-ui';
import Provider from './provider';
import './addons';

const root = document.getElementById('root');
render(root, new Provider());

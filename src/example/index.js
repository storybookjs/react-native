import render from '@kadira/storybook-ui';
import Provider from './provider';
import './addons';

const root = document.getElementById('react-app');
render(root, new Provider());

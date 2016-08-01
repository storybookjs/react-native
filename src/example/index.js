import { EventEmitter } from 'events';
import render from '@kadira/storybook-ui';
import addons from '@kadira/storybook-addons';
import Provider from './provider';
import './addons';

const channel = new EventEmitter();
const root = document.getElementById('react-app');
render(root, new Provider(channel));

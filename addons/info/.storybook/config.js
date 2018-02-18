import React from 'react';
import { configure, setAddon, addDecorator } from '@storybook/react';
import InfoAddon from '../src/';

addDecorator(story => <div style={{ padding: 20 }}>{story()}</div>);

setAddon(InfoAddon);

configure(() => {
  require('../example/story');
}, module);

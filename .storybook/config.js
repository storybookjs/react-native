import React from 'react';
import { configure, setAddon, addDecorator } from '@kadira/storybook';
import InfoAddon from '../src/';

addDecorator((story) => (
  <div style={{padding: 20}}>
    {story()}
  </div>
));

setAddon(InfoAddon);

configure(function () {
  require('../example/story');
}, module);

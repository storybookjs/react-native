import { configure, addDecorator } from '@storybook/react';

addDecorator((story) => (<div style={{padding: 20}}>{story()}</div>));

const req = require.context('../src/', true, /\.story.js$/);
configure(() => { req.keys().forEach(req) }, module);

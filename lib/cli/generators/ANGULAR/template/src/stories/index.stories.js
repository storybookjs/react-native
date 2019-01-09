"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/angular");
var addon_actions_1 = require("@storybook/addon-actions");
var addon_links_1 = require("@storybook/addon-links");
var demo_1 = require("@storybook/angular/demo");
angular_1.storiesOf('Welcome', module).add('to Storybook', function () { return ({
    component: demo_1.Welcome,
    props: {},
}); });
angular_1.storiesOf('Button', module)
    .add('with text', function () { return ({
    component: demo_1.Button,
    props: {
        text: 'Hello Button',
    },
}); })
    .add('with some emoji', function () { return ({
    component: demo_1.Button,
    props: {
        text: '😀 😎 👍 💯',
    },
}); }, { notes: 'My notes on a button with emojis' })
    .add('with some emoji and action', function () { return ({
    component: demo_1.Button,
    props: {
        text: '😀 😎 👍 💯',
        onClick: addon_actions_1.action('This was clicked OMG'),
    },
}); }, { notes: 'My notes on a button with emojis' });
angular_1.storiesOf('Another Button', module).add('button with link to another story', function () { return ({
    component: demo_1.Button,
    props: {
        text: 'Go to Welcome Story',
        onClick: addon_links_1.linkTo('Welcome'),
    },
}); });

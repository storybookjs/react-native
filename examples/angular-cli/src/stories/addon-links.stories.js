"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var addon_links_1 = require("@storybook/addon-links");
var angular_1 = require("@storybook/angular");
var demo_1 = require("@storybook/angular/demo");
angular_1.storiesOf('Addon|Links', module).add('button with link to another story', function () { return ({
    component: demo_1.Button,
    props: {
        text: 'Go to Welcome Story',
        onClick: addon_links_1.linkTo('Welcome'),
    },
}); });

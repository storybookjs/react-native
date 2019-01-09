"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/angular");
var addon_actions_1 = require("@storybook/addon-actions");
var demo_1 = require("@storybook/angular/demo");
angular_1.storiesOf('Addon|Actions', module)
    .add('Action only', function () { return ({
    component: demo_1.Button,
    props: {
        text: 'Action only',
        onClick: addon_actions_1.action('log 1'),
    },
}); })
    .add('Action and method', function () { return ({
    component: demo_1.Button,
    props: {
        text: 'Action and Method',
        onClick: function (e) {
            console.log(e);
            e.preventDefault();
            addon_actions_1.action('log2')(e.target);
        },
    },
}); });

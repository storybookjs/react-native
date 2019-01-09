"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/angular");
var demo_1 = require("@storybook/angular/demo");
var angular_2 = require("@storybook/angular");
var addon_links_1 = require("@storybook/addon-links");
var environment_1 = require("environments/environment");
if (environment_1.environment) {
    // This ensures that the basePath typeScript feature works with storybook
}
angular_1.storiesOf('Welcome', module).add('to Storybook', function () { return ({
    template: "<storybook-welcome-component (showApp)=\"showApp()\"></storybook-welcome-component>",
    props: {
        showApp: addon_links_1.linkTo('Button'),
    },
    moduleMetadata: {
        declarations: [demo_1.Welcome],
    },
}); });
angular_1.storiesOf('Button', module)
    .addDecorator(angular_2.moduleMetadata({
    declarations: [demo_1.Button],
}))
    .add('with text', function () { return ({
    template: "<storybook-button-component [text]=\"text\" (onClick)=\"onClick($event)\"></storybook-button-component>",
    props: {
        text: 'Hello Button',
        onClick: function (event) {
            console.log('some bindings work');
            console.log(event);
        },
    },
}); })
    .add('with some emoji', function () { return ({
    template: "<storybook-button-component [text]=\"text\" (onClick)=\"onClick($event)\"></storybook-button-component>",
    props: {
        text: '😀 😎 👍 💯',
        onClick: function () { },
    },
}); });

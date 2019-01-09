"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/angular");
var addon_actions_1 = require("@storybook/addon-actions");
var angular_2 = require("@storybook/addon-knobs/angular");
var demo_1 = require("@storybook/angular/demo");
angular_1.storiesOf('Custom|Style', module)
    .addDecorator(angular_1.moduleMetadata({
    declarations: [demo_1.Button],
}))
    .add('Default', function () { return ({
    template: "<storybook-button-component [text]=\"text\" (onClick)=\"onClick($event)\"></storybook-button-component>",
    props: {
        text: 'Button with custom styles',
        onClick: addon_actions_1.action('log'),
    },
    styles: [
        "\n      storybook-button-component {\n        background-color: yellow;\n        padding: 25px;\n      }\n    ",
    ],
}); })
    .addDecorator(angular_2.withKnobs)
    .add('With Knobs', function () { return ({
    template: "<storybook-button-component [text]=\"text\" (onClick)=\"onClick($event)\"></storybook-button-component>",
    props: {
        text: angular_2.text('text', 'Button with custom styles'),
        onClick: addon_actions_1.action('log'),
    },
    styles: [
        "\n      storybook-button-component {\n        background-color: red;\n        padding: 25px;\n      }\n    ",
    ],
}); });

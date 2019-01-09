"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/addon-centered/angular");
var angular_2 = require("@storybook/angular");
var demo_1 = require("@storybook/angular/demo");
var app_component_1 = require("../app/app.component");
angular_2.storiesOf('Addon|Centered', module)
    .addDecorator(angular_1.centered)
    .add('centered component', function () { return ({
    component: app_component_1.AppComponent,
    props: {},
}); });
angular_2.storiesOf('Addon|Centered', module)
    .addDecorator(angular_2.moduleMetadata({
    declarations: [demo_1.Button],
}))
    .addDecorator(angular_1.centered)
    .add('centered template', function () { return ({
    template: "<storybook-button-component [text]=\"text\" (onClick)=\"onClick($event)\"></storybook-button-component>",
    props: {
        text: 'Hello Button',
        onClick: function (event) {
            console.log('some bindings work');
            console.log(event);
        },
    },
}); });

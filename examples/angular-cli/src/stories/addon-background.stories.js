"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/angular");
var demo_1 = require("@storybook/angular/demo");
var app_component_1 = require("../app/app.component");
angular_1.storiesOf('Addon|Background', module)
    .addParameters({
    backgrounds: [
        { name: 'twitter', value: '#00aced', default: true },
        { name: 'facebook', value: '#3b5998' },
    ],
})
    .add('background component', function () { return ({
    component: app_component_1.AppComponent,
    props: {},
}); });
angular_1.storiesOf('Addon|Background', module)
    .addDecorator(angular_1.moduleMetadata({
    declarations: [demo_1.Button],
}))
    .addParameters({
    backgrounds: [
        { name: 'twitter', value: '#00aced', default: true },
        { name: 'facebook', value: '#3b5998' },
    ],
})
    .add('background template', function () { return ({
    template: "<storybook-button-component [text]=\"text\" (onClick)=\"onClick($event)\"></storybook-button-component>",
    props: {
        text: 'Hello Button',
        onClick: function (event) {
            console.log('some bindings work');
            console.log(event);
        },
    },
}); });

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/angular");
var angular_2 = require("@storybook/addon-knobs/angular");
var di_component_1 = require("./di.component");
angular_1.storiesOf('Custom|Dependencies', module)
    .add('inputs and inject dependencies', function () { return ({
    component: di_component_1.DiComponent,
    props: {
        title: 'Component dependencies',
    },
}); })
    .addDecorator(angular_2.withKnobs)
    .add('inputs and inject dependencies with knobs', function () { return ({
    component: di_component_1.DiComponent,
    props: {
        title: angular_2.text('title', 'Component dependencies'),
    },
}); });

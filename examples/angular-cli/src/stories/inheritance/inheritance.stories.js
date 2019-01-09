"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/angular");
var icon_button_component_1 = require("./icon-button.component");
var base_button_component_1 = require("./base-button.component");
angular_1.storiesOf('Custom|Inheritance', module)
    .add('icon button', function () { return ({
    component: icon_button_component_1.IconButtonComponent,
    props: {
        icon: 'this is icon',
        label: 'this is label',
    },
}); })
    .add('base button', function () { return ({
    component: base_button_component_1.BaseButtonComponent,
    props: {
        label: 'this is label',
    },
}); });

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/angular");
var addon_actions_1 = require("@storybook/addon-actions");
var custom_cva_component_1 = require("./custom-cva.component");
var description = "\n  This is an example of component that implements ControlValueAccessor interface\n";
angular_1.storiesOf('Custom|ngModel', module).add('custom ControlValueAccessor', function () { return ({
    component: custom_cva_component_1.CustomCvaComponent,
    props: {
        ngModel: 'Type anything',
        ngModelChange: addon_actions_1.action('ngModelChnange'),
    },
}); }, { notes: description });

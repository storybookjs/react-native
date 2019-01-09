"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/angular");
var angular_2 = require("@storybook/addon-knobs/angular");
var name_component_1 = require("./moduleMetadata/name.component");
var custom_pipe_1 = require("./moduleMetadata/custom.pipe");
var angular_3 = require("@storybook/angular");
angular_1.storiesOf('Custom|Pipes', module)
    .addDecorator(angular_3.moduleMetadata({
    imports: [],
    schemas: [],
    declarations: [custom_pipe_1.CustomPipePipe],
    providers: [],
}))
    .add('Simple', function () { return ({
    component: name_component_1.NameComponent,
    props: {
        field: 'foobar',
    },
}); })
    .addDecorator(angular_2.withKnobs)
    .add('With Knobs', function () { return ({
    component: name_component_1.NameComponent,
    props: {
        field: angular_2.text('field', 'foobar'),
    },
}); });

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/angular");
var angular_2 = require("@storybook/addon-knobs/angular");
var dummy_service_1 = require("./moduleMetadata/dummy.service");
var service_component_1 = require("./moduleMetadata/service.component");
var angular_3 = require("@storybook/angular");
angular_1.storiesOf('Custom|Providers', module)
    .addDecorator(angular_3.moduleMetadata({
    imports: [],
    schemas: [],
    declarations: [],
    providers: [dummy_service_1.DummyService],
}))
    .add('Simple', function () { return ({
    component: service_component_1.ServiceComponent,
    props: {
        name: 'Static name',
    },
}); })
    .addDecorator(angular_2.withKnobs)
    .add('With knobs', function () {
    var name = angular_2.text('name', 'Dynamic knob');
    return {
        component: service_component_1.ServiceComponent,
        props: {
            name: name,
        },
    };
});

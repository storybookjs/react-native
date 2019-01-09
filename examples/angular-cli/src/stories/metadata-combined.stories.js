"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/angular");
var token_component_1 = require("./moduleMetadata/token.component");
var custom_pipe_1 = require("./moduleMetadata/custom.pipe");
angular_1.storiesOf('Metadata|Combined', module)
    .addDecorator(angular_1.moduleMetadata({
    imports: [],
    declarations: [token_component_1.TokenComponent],
    providers: [
        {
            provide: token_component_1.ITEMS,
            useValue: ['Joe', 'Jane'],
        },
        {
            provide: token_component_1.DEFAULT_NAME,
            useValue: 'Provider Name',
        },
    ],
}))
    .add('Combined 1', function () { return ({
    template: "<storybook-simple-token-component [name]=\"name\"></storybook-simple-token-component>",
    props: {
        name: 'Prop Name',
    },
}); })
    .add('Combined 2', function () { return ({
    template: "<storybook-simple-token-component [name]=\"name | customPipe\"></storybook-simple-token-component>",
    props: {
        name: 'Prop Name',
    },
    moduleMetadata: {
        declarations: [custom_pipe_1.CustomPipePipe],
    },
}); });

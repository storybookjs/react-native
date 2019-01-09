"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/angular");
var token_component_1 = require("./moduleMetadata/token.component");
angular_1.storiesOf('Metadata|Shared', module)
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
    .add('Shared 1', function () { return ({
    template: "<storybook-simple-token-component [name]=\"name\"></storybook-simple-token-component>",
    props: {
        name: 'Prop Name',
    },
}); })
    .add('Shared 2', function () { return ({
    template: "<storybook-simple-token-component></storybook-simple-token-component>",
}); });

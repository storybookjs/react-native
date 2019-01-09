"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/angular");
var token_component_1 = require("./moduleMetadata/token.component");
angular_1.storiesOf('Metadata|Individual', module)
    .add('Individual 1', function () { return ({
    template: "<storybook-simple-token-component [name]=\"name\"></storybook-simple-token-component>",
    props: {
        name: 'Prop Name',
    },
    moduleMetadata: {
        imports: [],
        declarations: [token_component_1.TokenComponent],
        providers: [
            {
                provide: token_component_1.ITEMS,
                useValue: ['Joe', 'Jane'],
            },
        ],
    },
}); })
    .add('Individual 2', function () { return ({
    template: "<storybook-simple-token-component></storybook-simple-token-component>",
    moduleMetadata: {
        imports: [],
        declarations: [token_component_1.TokenComponent],
        providers: [
            {
                provide: token_component_1.ITEMS,
                useValue: ['Jim', 'Jill'],
            },
            {
                provide: token_component_1.DEFAULT_NAME,
                useValue: 'Provider Name',
            },
        ],
    },
}); });

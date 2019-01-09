"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/angular");
var demo_1 = require("@storybook/angular/demo");
angular_1.storiesOf('Addon|Notes', module)
    .add('Simple note', function () { return ({
    component: demo_1.Button,
    props: {
        text: 'Notes on some Button',
        onClick: function () { },
    },
}); }, { notes: 'My notes on some button' })
    .add('Note with HTML', function () { return ({
    component: demo_1.Button,
    props: {
        text: 'Notes with HTML',
        onClick: function () { },
    },
}); }, {
    notes: "\n      <h2>My notes on emojis</h2>\n\n      <em>It's not all that important to be honest, but..</em>\n\n      Emojis are great, I love emojis, in fact I like using them in my Component notes too! \uD83D\uDE07\n    ",
});

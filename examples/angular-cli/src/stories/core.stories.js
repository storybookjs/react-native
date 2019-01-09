"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/angular");
var demo_1 = require("@storybook/angular/demo");
var globalParameter = 'globalParameter';
var chapterParameter = 'chapterParameter';
var storyParameter = 'storyParameter';
angular_1.addParameters({ globalParameter: globalParameter });
angular_1.storiesOf('Core|Parameters', module)
    .addParameters({ chapterParameter: chapterParameter })
    .add('passed to story', function (_a) {
    var _b = _a.parameters, fileName = _b.fileName, parameters = __rest(_b, ["fileName"]);
    return ({
        component: demo_1.Button,
        props: {
            text: "Parameters are " + JSON.stringify(parameters),
            onClick: function () { return 0; },
        },
    });
}, { storyParameter: storyParameter });

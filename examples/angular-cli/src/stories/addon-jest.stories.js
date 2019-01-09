"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/angular");
var addon_jest_1 = require("@storybook/addon-jest");
var app_component_1 = require("../app/app.component");
var results = __importStar(require("../../addon-jest.testresults.json"));
angular_1.storiesOf('Addon|Jest', module)
    .addDecorator(addon_jest_1.withTests({
    results: results,
    filesExt: '((\\.specs?)|(\\.tests?))?(\\.ts)?$',
}))
    .add('app.component with jest tests', function () { return ({
    component: app_component_1.AppComponent,
    props: {},
}); }, {
    jest: 'app.component',
});

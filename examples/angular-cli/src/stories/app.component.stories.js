"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/angular");
var app_component_1 = require("../app/app.component");
angular_1.storiesOf('App Component', module).add('Component with separate template', function () { return ({
    component: app_component_1.AppComponent,
    props: {},
}); });

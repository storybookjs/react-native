"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/angular");
var styled_component_1 = require("./styled.component");
angular_1.storiesOf('Custom|styleUrls', module).add('Component with styles', function () { return ({
    component: styled_component_1.StyledComponent,
}); });

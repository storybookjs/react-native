"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angular_1 = require("@storybook/angular");
var WithNgContentComponent = /** @class */ (function () {
    function WithNgContentComponent() {
    }
    WithNgContentComponent = __decorate([
        core_1.Component({
            selector: 'storybook-with-ng-content',
            template: "\n    <div style=\"color: #1e88e5;\"><ng-content></ng-content></div>\n  ",
        })
    ], WithNgContentComponent);
    return WithNgContentComponent;
}());
angular_1.storiesOf('Custom|ng-content', module).add('Default', function () { return ({
    template: "<storybook-with-ng-content><h1>This is rendered in ng-content</h1></storybook-with-ng-content>",
    moduleMetadata: {
        declarations: [WithNgContentComponent],
    },
}); });

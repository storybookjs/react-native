"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
exports.ITEMS = new core_1.InjectionToken('TokenComponent.Items');
exports.DEFAULT_NAME = new core_1.InjectionToken('TokenComponent.DefaultName');
var TokenComponent = /** @class */ (function () {
    function TokenComponent(defaultName, items) {
        this.name = defaultName;
        this.items = items;
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], TokenComponent.prototype, "name", void 0);
    TokenComponent = __decorate([
        core_1.Component({
            selector: 'storybook-simple-token-component',
            template: "\n    <h3>{{ name }}</h3>\n    <p>Items:</p>\n    <ul>\n      <li *ngFor=\"let item of items\">{{ item }}</li>\n    </ul>\n  ",
        }),
        __param(0, core_1.Optional()),
        __param(0, core_1.Inject(exports.DEFAULT_NAME)),
        __param(1, core_1.Inject(exports.ITEMS)),
        __metadata("design:paramtypes", [String, Array])
    ], TokenComponent);
    return TokenComponent;
}());
exports.TokenComponent = TokenComponent;

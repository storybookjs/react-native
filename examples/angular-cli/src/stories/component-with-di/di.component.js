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
exports.TEST_TOKEN = new core_1.InjectionToken('test');
var DiComponent = /** @class */ (function () {
    function DiComponent(injector, elRef, testToken) {
        this.injector = injector;
        this.elRef = elRef;
        this.testToken = testToken;
    }
    DiComponent.prototype.isAllDeps = function () {
        return Boolean(this.testToken && this.elRef && this.injector && this.title);
    };
    DiComponent.prototype.elRefStr = function () {
        return JSON.stringify(this.elRef);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DiComponent.prototype, "title", void 0);
    DiComponent = __decorate([
        core_1.Component({
            selector: 'storybook-di-component',
            templateUrl: './di.component.html',
            providers: [{ provide: exports.TEST_TOKEN, useValue: 123 }],
        }),
        __param(2, core_1.Inject(exports.TEST_TOKEN)),
        __metadata("design:paramtypes", [core_1.Injector,
            core_1.ElementRef, Number])
    ], DiComponent);
    return DiComponent;
}());
exports.DiComponent = DiComponent;

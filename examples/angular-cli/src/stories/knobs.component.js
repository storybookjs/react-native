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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var SimpleKnobsComponent = /** @class */ (function () {
    function SimpleKnobsComponent() {
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SimpleKnobsComponent.prototype, "name", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SimpleKnobsComponent.prototype, "age", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SimpleKnobsComponent.prototype, "phoneNumber", void 0);
    SimpleKnobsComponent = __decorate([
        core_1.Component({
            selector: 'storybook-simple-knobs-component',
            template: "\n    <div>I am {{ name }} and I'm {{ age }} years old.</div>\n    <div>Phone Number: {{ phoneNumber }}</div>\n  ",
        })
    ], SimpleKnobsComponent);
    return SimpleKnobsComponent;
}());
exports.SimpleKnobsComponent = SimpleKnobsComponent;

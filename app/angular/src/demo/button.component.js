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
var ButtonComponent = /** @class */ (function () {
    function ButtonComponent() {
        this.text = '';
        this.onClick = new core_1.EventEmitter();
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ButtonComponent.prototype, "text", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ButtonComponent.prototype, "onClick", void 0);
    ButtonComponent = __decorate([
        core_1.Component({
            selector: 'storybook-button-component',
            template: "\n    <button (click)=\"onClick.emit($event)\">{{ text }}</button>\n  ",
            styles: [
                "\n      button {\n        border: 1px solid #eee;\n        border-radius: 3px;\n        background-color: #ffffff;\n        cursor: pointer;\n        font-size: 15px;\n        padding: 3px 10px;\n        margin: 10px;\n      }\n    ",
            ],
        })
    ], ButtonComponent);
    return ButtonComponent;
}());
exports.default = ButtonComponent;

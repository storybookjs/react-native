"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var NOOP = function () { };
var CustomCvaComponent = /** @class */ (function () {
    function CustomCvaComponent() {
        this.onChange = NOOP;
        this.onTouch = NOOP;
    }
    CustomCvaComponent_1 = CustomCvaComponent;
    Object.defineProperty(CustomCvaComponent.prototype, "value", {
        get: function () {
            return this.internalValue;
        },
        set: function (value) {
            if (value !== this.internalValue) {
                this.internalValue = value;
                this.onChange(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    CustomCvaComponent.prototype.writeValue = function (value) {
        if (value !== this.internalValue) {
            this.internalValue = value;
        }
    };
    CustomCvaComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    CustomCvaComponent.prototype.registerOnTouched = function (fn) {
        this.onTouch = fn;
    };
    CustomCvaComponent.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    var CustomCvaComponent_1;
    CustomCvaComponent = CustomCvaComponent_1 = __decorate([
        core_1.Component({
            selector: 'storybook-custom-cva-component',
            template: "\n    <div>{{ value }}</div>\n    <input type=\"text\" [(ngModel)]=\"value\" />\n  ",
            providers: [
                {
                    provide: forms_1.NG_VALUE_ACCESSOR,
                    useExisting: core_1.forwardRef(function () { return CustomCvaComponent_1; }),
                    multi: true,
                },
            ],
        })
    ], CustomCvaComponent);
    return CustomCvaComponent;
}());
exports.CustomCvaComponent = CustomCvaComponent;

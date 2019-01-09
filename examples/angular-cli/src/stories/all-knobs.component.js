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
var AllKnobsComponent = /** @class */ (function () {
    function AllKnobsComponent() {
        console.log('constructor');
    }
    AllKnobsComponent.prototype.ngOnInit = function () {
        console.log('on init, user component');
    };
    AllKnobsComponent.prototype.ngOnChanges = function (changes) {
        console.log(changes);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], AllKnobsComponent.prototype, "price", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], AllKnobsComponent.prototype, "border", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], AllKnobsComponent.prototype, "fruit", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], AllKnobsComponent.prototype, "name", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], AllKnobsComponent.prototype, "items", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], AllKnobsComponent.prototype, "today", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], AllKnobsComponent.prototype, "stock", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], AllKnobsComponent.prototype, "nice", void 0);
    AllKnobsComponent = __decorate([
        core_1.Component({
            selector: 'storybook-simple-knobs-component',
            template: "\n    <div\n      [ngStyle]=\"{ border: '2px dotted ' + border, 'padding.px': '8 22', 'border-radius.px': '8' }\"\n    >\n      <h1>My name is {{ name }},</h1>\n      <h3>today is {{ today | date }}</h3>\n      <p *ngIf=\"stock\">I have a stock of {{ stock }} {{ fruit }}, costing $ {{ price }} each.</p>\n      <p *ngIf=\"!stock\">I'm out of {{ fruit }}.</p>\n      <p *ngIf=\"stock && nice\">Sorry.</p>\n      <p>Also, I have:</p>\n      <ul>\n        <li *ngFor=\"let item of items\">{{ item }}</li>\n      </ul>\n      <p *ngIf=\"nice\">Nice to meet you!</p>\n      <p *ngIf=\"!nice\">Leave me alone!</p>\n    </div>\n  ",
        }),
        __metadata("design:paramtypes", [])
    ], AllKnobsComponent);
    return AllKnobsComponent;
}());
exports.AllKnobsComponent = AllKnobsComponent;

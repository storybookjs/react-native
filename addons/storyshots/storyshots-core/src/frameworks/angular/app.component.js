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
// We could use NgComponentOutlet here but there's currently no easy way
// to provide @Inputs and subscribe to @Outputs, see
// https://github.com/angular/angular/issues/15360
// For the time being, the ViewContainerRef approach works pretty well.
var core_1 = require("@angular/core");
var app_token_1 = require("./app.token");
var AppComponent = /** @class */ (function () {
    function AppComponent(cfr, data) {
        this.cfr = cfr;
        this.data = data;
    }
    AppComponent.prototype.ngOnInit = function () {
        this.putInMyHtml();
    };
    AppComponent.prototype.ngOnDestroy = function () {
        this.target.clear();
    };
    AppComponent.prototype.putInMyHtml = function () {
        this.target.clear();
        var compFactory = this.cfr.resolveComponentFactory(this.data.component);
        var instance = this.target.createComponent(compFactory).instance;
        this.setProps(instance, this.data);
    };
    /**
     * Set inputs and outputs
     */
    AppComponent.prototype.setProps = function (instance, _a) {
        var _b = _a.props, props = _b === void 0 ? {} : _b;
        var changes = {};
        var hasNgOnChangesHook = !!instance['ngOnChanges'];
        Object.keys(props).map(function (key) {
            var value = props[key];
            var instanceProperty = instance[key];
            if (!(instanceProperty instanceof core_1.EventEmitter) && !!value) {
                instance[key] = value;
                if (hasNgOnChangesHook) {
                    changes[key] = new core_1.SimpleChange(undefined, value, instanceProperty === undefined);
                }
            }
            else if (typeof value === 'function' && key !== 'ngModelChange') {
                instanceProperty.subscribe(value);
            }
        });
        this.callNgOnChangesHook(instance, changes);
        this.setNgModel(instance, props);
    };
    /**
     * Manually call 'ngOnChanges' hook because angular doesn't do that for dynamic components
     * Issue: [https://github.com/angular/angular/issues/8903]
     */
    AppComponent.prototype.callNgOnChangesHook = function (instance, changes) {
        if (!!Object.keys(changes).length) {
            instance.ngOnChanges(changes);
        }
    };
    /**
     * If component implements ControlValueAccessor interface try to set ngModel
     */
    AppComponent.prototype.setNgModel = function (instance, props) {
        if (!!props['ngModel']) {
            instance.writeValue(props.ngModel);
        }
        if (typeof props.ngModelChange === 'function') {
            instance.registerOnChange(props.ngModelChange);
        }
    };
    __decorate([
        core_1.ViewChild('target', { read: core_1.ViewContainerRef }),
        __metadata("design:type", core_1.ViewContainerRef)
    ], AppComponent.prototype, "target", void 0);
    AppComponent = __decorate([
        core_1.Component({
            selector: 'storybook-dynamic-app-root',
            template: '<ng-template #target></ng-template>',
        }),
        __param(1, core_1.Inject(app_token_1.STORY)),
        __metadata("design:paramtypes", [core_1.ComponentFactoryResolver, Object])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;

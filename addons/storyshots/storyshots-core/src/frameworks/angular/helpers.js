"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var app_component_1 = require("./app.component");
var app_token_1 = require("./app.token");
var getModuleMeta = function (declarations, entryComponents, bootstrap, data, moduleMetadata) {
    return {
        declarations: declarations.concat((moduleMetadata.declarations || [])),
        imports: [platform_browser_1.BrowserModule, forms_1.FormsModule].concat((moduleMetadata.imports || [])),
        providers: [
            { provide: app_token_1.STORY, useValue: Object.assign({}, data) }
        ].concat((moduleMetadata.providers || [])),
        entryComponents: entryComponents.concat((moduleMetadata.entryComponents || [])),
        schemas: (moduleMetadata.schemas || []).slice(),
        bootstrap: bootstrap.slice(),
    };
};
var createComponentFromTemplate = function (template) {
    var componentClass = /** @class */ (function () {
        function DynamicComponent() {
        }
        return DynamicComponent;
    }());
    return core_1.Component({
        template: template,
    })(componentClass);
};
exports.initModuleData = function (storyObj) {
    var component = storyObj.component, template = storyObj.template, props = storyObj.props, _a = storyObj.moduleMetadata, moduleMetadata = _a === void 0 ? {} : _a;
    var AnnotatedComponent;
    if (template) {
        AnnotatedComponent = createComponentFromTemplate(template);
    }
    else {
        AnnotatedComponent = component;
    }
    var story = {
        component: AnnotatedComponent,
        props: props,
    };
    var moduleMeta = getModuleMeta([app_component_1.AppComponent, AnnotatedComponent], [AnnotatedComponent], [app_component_1.AppComponent], story, moduleMetadata);
    return {
        AppComponent: app_component_1.AppComponent,
        moduleMeta: moduleMeta,
    };
};

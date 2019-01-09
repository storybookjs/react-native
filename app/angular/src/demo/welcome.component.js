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
var WelcomeComponent = /** @class */ (function () {
    function WelcomeComponent() {
        this.showApp = new core_1.EventEmitter();
    }
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], WelcomeComponent.prototype, "showApp", void 0);
    WelcomeComponent = __decorate([
        core_1.Component({
            selector: 'storybook-welcome-component',
            template: "\n    <main>\n      <h1>Welcome to storybook</h1>\n      <p>This is a UI component dev environment for your app.</p>\n      <p>\n        We've added some basic stories inside the\n        <span class=\"inline-code\">src/stories</span> directory. <br />\n        A story is a single state of one or more UI components. You can have as many stories as you\n        want. <br />\n        (Basically a story is like a visual test case.)\n      </p>\n      <p>\n        See these sample\n        <a (click)=\"showApp.emit($event)\" role=\"button\" tabIndex=\"0\">stories</a> for a component\n        called <span class=\"inline-code\">Button</span> .\n      </p>\n      <p>\n        Just like that, you can add your own components as stories. <br />\n        You can also edit those components and see changes right away. <br />\n        (Try editing the <span class=\"inline-code\">Button</span> stories located at\n        <span class=\"inline-code\">src/stories/index.js</span>.)\n      </p>\n      <p>\n        Usually we create stories with smaller UI components in the app.<br />\n        Have a look at the\n        <a\n          href=\"https://storybook.js.org/basics/writing-stories\"\n          target=\"_blank\"\n          rel=\"noopener noreferrer\"\n        >\n          Writing Stories\n        </a>\n        section in our documentation.\n      </p>\n      <p class=\"note\">\n        <b>NOTE:</b> <br />\n        Have a look at the <span class=\"inline-code\">.storybook/webpack.config.js</span> to add\n        webpack loaders and plugins you are using in this project.\n      </p>\n    </main>\n  ",
            styles: [
                "\n      main {\n        margin: 15px;\n        max-width: 600;\n        line-height: 1.4;\n        fontfamily: 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, freesans, sans-serif;\n      }\n\n      .note {\n        opacity: 0.5;\n      }\n\n      .inline-code {\n        font-size: 15px;\n        font-weight: 600;\n        padding: 2px 5px;\n        border: 1px solid #eae9e9;\n        border-radius: 4px;\n        background-color: #f3f2f2;\n        color: #3a3a3a;\n      }\n\n      a {\n        color: #1474f3;\n        text-decoration: none;\n        border-bottom: 1px solid #1474f3;\n        padding-bottom: 2px;\n      }\n    ",
            ],
        })
    ], WelcomeComponent);
    return WelcomeComponent;
}());
exports.default = WelcomeComponent;

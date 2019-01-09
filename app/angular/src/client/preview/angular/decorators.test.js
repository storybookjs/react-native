"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var decorators_1 = require("./decorators");
var __1 = require("..");
var MockModule = /** @class */ (function () {
    function MockModule() {
    }
    return MockModule;
}());
var MockModuleTwo = /** @class */ (function () {
    function MockModuleTwo() {
    }
    return MockModuleTwo;
}());
var MockService = /** @class */ (function () {
    function MockService() {
    }
    return MockService;
}());
var MockComponent = /** @class */ (function () {
    function MockComponent() {
    }
    return MockComponent;
}());
describe('moduleMetadata', function () {
    it('should add metadata to a story without it', function () {
        var result = decorators_1.moduleMetadata({
            imports: [MockModule],
            providers: [MockService],
        })(function () { return ({
            component: MockComponent,
        }); });
        expect(result).toEqual({
            component: MockComponent,
            moduleMetadata: {
                declarations: [],
                entryComponents: [],
                imports: [MockModule],
                schemas: [],
                providers: [MockService],
            },
        });
    });
    it('should combine with individual metadata on a story', function () {
        var result = decorators_1.moduleMetadata({
            imports: [MockModule],
        })(function () { return ({
            component: MockComponent,
            moduleMetadata: {
                imports: [MockModuleTwo],
                providers: [MockService],
            },
        }); });
        expect(result).toEqual({
            component: MockComponent,
            moduleMetadata: {
                declarations: [],
                entryComponents: [],
                imports: [MockModule, MockModuleTwo],
                schemas: [],
                providers: [MockService],
            },
        });
    });
    it('should return the original metadata if passed null', function () {
        var result = decorators_1.moduleMetadata(null)(function () { return ({
            component: MockComponent,
            moduleMetadata: {
                providers: [MockService],
            },
        }); });
        expect(result).toEqual({
            component: MockComponent,
            moduleMetadata: {
                declarations: [],
                entryComponents: [],
                imports: [],
                schemas: [],
                providers: [MockService],
            },
        });
    });
    it('should work when added globally', function () {
        var metadata = {
            declarations: [MockComponent],
            providers: [MockService],
            entryComponents: [MockComponent],
            imports: [MockModule],
        };
        __1.addDecorator(decorators_1.moduleMetadata(metadata));
        __1.storiesOf('Test', module).add('Default', function () { return ({
            component: MockComponent,
        }); });
        var storybook = __1.getStorybook()[0];
        expect(storybook.stories[0].render().moduleMetadata).toEqual({
            declarations: [MockComponent],
            providers: [MockService],
            entryComponents: [MockComponent],
            imports: [MockModule],
            schemas: [],
        });
        __1.clearDecorators();
    });
});

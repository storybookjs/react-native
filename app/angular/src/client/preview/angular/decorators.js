"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleMetadata = function (metadata) { return function (storyFn) {
    var story = storyFn();
    var storyMetadata = story.moduleMetadata || {};
    metadata = metadata || {};
    return __assign({}, story, { moduleMetadata: {
            declarations: (metadata.declarations || []).concat((storyMetadata.declarations || [])),
            entryComponents: (metadata.entryComponents || []).concat((storyMetadata.entryComponents || [])),
            imports: (metadata.imports || []).concat((storyMetadata.imports || [])),
            schemas: (metadata.schemas || []).concat((storyMetadata.schemas || [])),
            providers: (metadata.providers || []).concat((storyMetadata.providers || [])),
        } });
}; };

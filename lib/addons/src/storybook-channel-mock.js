"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var channels_1 = __importDefault(require("@storybook/channels"));
function mockChannel() {
    var transport = {
        setHandler: function () { },
        send: function () { },
    };
    return new channels_1.default({ transport: transport });
}
exports.mockChannel = mockChannel;

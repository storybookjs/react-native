"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
jest.useFakeTimers();
describe('Channel', function () {
    var transport;
    var channel;
    beforeEach(function () {
        transport = { setHandler: jest.fn(), send: jest.fn() };
        channel = new _1.Channel({ transport: transport });
    });
    describe('constructor', function () {
        it('should set the handler if handler is preset', function () {
            channel = new _1.Channel({ transport: transport });
            expect(transport.setHandler).toHaveBeenCalled();
        });
        it('should not set transport if not passed as an argument', function () {
            channel = new _1.Channel();
            expect(channel.hasTransport).toBeFalsy();
        });
        it('should set transport if passed as an argument', function () {
            channel = new _1.Channel({ transport: transport });
            expect(channel.hasTransport).toBeTruthy();
        });
        it('should set isAsync to false as default value', function () {
            channel = new _1.Channel();
            expect(channel.isAsync).toBeFalsy();
        });
        it('should set isAsync to true if passed as an argument', function () {
            channel = new _1.Channel({ async: true });
            expect(channel.isAsync).toBeTruthy();
        });
    });
    describe('method:addListener', function () {
        it('should create one listener', function () {
            var eventName = 'event1';
            channel.addListener(eventName, jest.fn());
            expect(channel.listeners(eventName).length).toBe(1);
        });
    });
    describe('method:on', function () {
        it('should do the same as addListener', function () {
            var eventName = 'event1';
            channel.addListener(eventName, jest.fn());
            expect(channel.listeners(eventName).length).toBe(1);
        });
    });
    describe('method:emit', function () {
        it('should execute the callback fn of a listener', function () {
            var eventName = 'event1';
            var listenerInputData = ['string1', 'string2', 'string3'];
            var listenerOutputData = null;
            var mockListener = function (data) {
                listenerOutputData = data;
            };
            channel.addListener(eventName, mockListener);
            channel.emit(eventName, listenerInputData);
            expect(listenerOutputData).toBe(listenerInputData);
        });
        it('should be callable with a spread operator as event arguments', function () {
            var eventName = 'event1';
            var listenerInputData = ['string1', 'string2', 'string3'];
            var listenerOutputData = null;
            channel.addListener(eventName, function () {
                var data = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    data[_i] = arguments[_i];
                }
                listenerOutputData = data;
            });
            channel.emit.apply(channel, [eventName].concat(listenerInputData));
            expect(listenerOutputData).toEqual(listenerInputData);
        });
        it('should use setImmediate if async is true', function () {
            channel = new _1.Channel({ async: true, transport: transport });
            channel.addListener('event1', jest.fn());
        });
    });
    describe('method:addPeerListener', function () {
        it('should add a listener and set ignorePeer to true', function () {
            var eventName = 'event1';
            channel.addPeerListener(eventName, jest.fn());
            expect(channel.listeners(eventName)[0].ignorePeer).toBe(true);
        });
    });
    describe('method:eventNames', function () {
        it('should return a list of all registered events', function () {
            var eventNames = ['event1', 'event2', 'event3'];
            eventNames.forEach(function (eventName) { return channel.addListener(eventName, jest.fn()); });
            expect(channel.eventNames()).toEqual(eventNames);
        });
    });
    describe('method:listenerCount', function () {
        it('should return a list of all registered events', function () {
            var events = [
                { eventName: 'event1', listeners: [jest.fn(), jest.fn(), jest.fn()], listenerCount: 0 },
                { eventName: 'event2', listeners: [jest.fn()], listenerCount: 0 },
            ];
            events.forEach(function (event) {
                event.listeners.forEach(function (listener) {
                    channel.addListener(event.eventName, listener);
                    event.listenerCount++;
                });
            });
            events.forEach(function (event) {
                expect(channel.listenerCount(event.eventName)).toBe(event.listenerCount);
            });
        });
    });
    describe('method:once', function () {
        it('should execute a listener once and remove it afterwards', function () {
            var eventName = 'event1';
            channel.once(eventName, jest.fn());
            channel.emit(eventName);
            expect(channel.listenerCount(eventName)).toBe(0);
        });
        it('should pass all event arguments correctly to the listener', function () {
            var eventName = 'event1';
            var listenerInputData = ['string1', 'string2', 'string3'];
            var listenerOutputData = null;
            var mockListener = function (data) {
                listenerOutputData = data;
            };
            channel.once(eventName, function (args) { return mockListener(args); });
            channel.emit(eventName, listenerInputData);
            expect(listenerOutputData).toEqual(listenerInputData);
        });
        it('should be removable', function () {
            var eventName = 'event1';
            var listenerToBeRemoved = jest.fn();
            channel.once(eventName, listenerToBeRemoved);
            channel.removeListener(eventName, listenerToBeRemoved);
        });
    });
    describe('method:removeAllListeners', function () {
        it('should remove all listeners', function () {
            var eventName1 = 'event1';
            var eventName2 = 'event2';
            var listeners1 = [jest.fn(), jest.fn(), jest.fn()];
            var listeners2 = [jest.fn()];
            listeners1.forEach(function (fn) { return channel.addListener(eventName1, fn); });
            listeners2.forEach(function (fn) { return channel.addListener(eventName2, fn); });
            channel.removeAllListeners();
            expect(channel.listenerCount(eventName1)).toBe(0);
            expect(channel.listenerCount(eventName2)).toBe(0);
        });
        it('should remove all listeners of a certain event', function () {
            var eventName = 'event1';
            var listeners = [jest.fn(), jest.fn(), jest.fn()];
            listeners.forEach(function (fn) { return channel.addListener(eventName, fn); });
            expect(channel.listenerCount(eventName)).toBe(listeners.length);
            channel.removeAllListeners(eventName);
            expect(channel.listenerCount(eventName)).toBe(0);
        });
    });
    describe('method:removeListener', function () {
        it('should remove one listener', function () {
            var eventName = 'event1';
            var listenerToBeRemoved = jest.fn();
            var listeners = [jest.fn(), jest.fn()];
            var findListener = function (listener) {
                return channel.listeners(eventName).find(function (_listener) { return _listener === listener; });
            };
            listeners.forEach(function (fn) { return channel.addListener(eventName, fn); });
            channel.addListener(eventName, listenerToBeRemoved);
            expect(findListener(listenerToBeRemoved)).toBe(listenerToBeRemoved);
            channel.removeListener(eventName, listenerToBeRemoved);
            expect(findListener(listenerToBeRemoved)).toBeUndefined();
        });
    });
});

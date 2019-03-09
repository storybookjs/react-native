import { Channel, ChannelEvent, ChannelTransport, Listener } from '.';

jest.useFakeTimers();

describe('Channel', () => {
  let transport: ChannelTransport;
  let channel: Channel;

  beforeEach(() => {
    transport = { setHandler: jest.fn(), send: jest.fn() };
    channel = new Channel({ transport });
  });

  describe('constructor', () => {
    it('should set the handler if handler is preset', () => {
      channel = new Channel({ transport });
      expect(transport.setHandler).toHaveBeenCalled();
    });

    it('should not set transport if not passed as an argument', () => {
      channel = new Channel();
      expect(channel.hasTransport).toBeFalsy();
    });

    it('should set transport if passed as an argument', () => {
      channel = new Channel({ transport });
      expect(channel.hasTransport).toBeTruthy();
    });

    it('should set isAsync to false as default value', () => {
      channel = new Channel();
      expect(channel.isAsync).toBeFalsy();
    });

    it('should set isAsync to true if passed as an argument', () => {
      channel = new Channel({ async: true });
      expect(channel.isAsync).toBeTruthy();
    });
  });

  describe('method:addListener', () => {
    it('should create one listener', () => {
      const eventName = 'event1';

      channel.addListener(eventName, jest.fn());
      expect(channel.listeners(eventName).length).toBe(1);
    });
  });

  describe('method:on', () => {
    it('should do the same as addListener', () => {
      const eventName = 'event1';

      channel.addListener(eventName, jest.fn());
      expect(channel.listeners(eventName).length).toBe(1);
    });
  });

  describe('method:emit', () => {
    it('should execute the callback fn of a listener', () => {
      const eventName = 'event1';
      const listenerInputData = ['string1', 'string2', 'string3'];
      let listenerOutputData: string[] = null;
      const mockListener: Listener = data => {
        listenerOutputData = data;
      };

      channel.addListener(eventName, mockListener);
      channel.emit(eventName, listenerInputData);
      expect(listenerOutputData).toBe(listenerInputData);
    });

    it('should be callable with a spread operator as event arguments', () => {
      const eventName = 'event1';
      const listenerInputData = ['string1', 'string2', 'string3'];
      let listenerOutputData: string[] = null;

      channel.addListener(eventName, (...data) => {
        listenerOutputData = data;
      });
      channel.emit(eventName, ...listenerInputData);
      expect(listenerOutputData).toEqual(listenerInputData);
    });

    it('should use setImmediate if async is true', () => {
      channel = new Channel({ async: true, transport });
      channel.addListener('event1', jest.fn());
    });
  });

  describe('method:addPeerListener', () => {
    it('should add a listener and set ignorePeer to true', () => {
      const eventName = 'event1';

      channel.addPeerListener(eventName, jest.fn());
      expect(channel.listeners(eventName)[0].ignorePeer).toBe(true);
    });
  });

  describe('method:eventNames', () => {
    it('should return a list of all registered events', () => {
      const eventNames = ['event1', 'event2', 'event3'];
      eventNames.forEach(eventName => channel.addListener(eventName, jest.fn()));

      expect(channel.eventNames()).toEqual(eventNames);
    });
  });

  describe('method:listenerCount', () => {
    it('should return a list of all registered events', () => {
      const events = [
        { eventName: 'event1', listeners: [jest.fn(), jest.fn(), jest.fn()], listenerCount: 0 },
        { eventName: 'event2', listeners: [jest.fn()], listenerCount: 0 },
      ];
      events.forEach(event => {
        event.listeners.forEach(listener => {
          channel.addListener(event.eventName, listener);
          event.listenerCount++;
        });
      });

      events.forEach(event => {
        expect(channel.listenerCount(event.eventName)).toBe(event.listenerCount);
      });
    });
  });

  describe('method:once', () => {
    it('should execute a listener once and remove it afterwards', () => {
      const eventName = 'event1';
      channel.once(eventName, jest.fn());
      channel.emit(eventName);

      expect(channel.listenerCount(eventName)).toBe(0);
    });

    it('should pass all event arguments correctly to the listener', () => {
      const eventName = 'event1';
      const listenerInputData = ['string1', 'string2', 'string3'];
      let listenerOutputData = null;
      const mockListener: Listener = (data: string[]) => {
        listenerOutputData = data;
      };

      channel.once(eventName, args => mockListener(args));
      channel.emit(eventName, listenerInputData);

      expect(listenerOutputData).toEqual(listenerInputData);
    });

    it('should be removable', () => {
      const eventName = 'event1';
      const listenerToBeRemoved = jest.fn();

      channel.once(eventName, listenerToBeRemoved);
      channel.removeListener(eventName, listenerToBeRemoved);
    });
  });

  describe('method:removeAllListeners', () => {
    it('should remove all listeners', () => {
      const eventName1 = 'event1';
      const eventName2 = 'event2';
      const listeners1 = [jest.fn(), jest.fn(), jest.fn()];
      const listeners2 = [jest.fn()];

      listeners1.forEach(fn => channel.addListener(eventName1, fn));
      listeners2.forEach(fn => channel.addListener(eventName2, fn));
      channel.removeAllListeners();

      expect(channel.listenerCount(eventName1)).toBe(0);
      expect(channel.listenerCount(eventName2)).toBe(0);
    });

    it('should remove all listeners of a certain event', () => {
      const eventName = 'event1';
      const listeners = [jest.fn(), jest.fn(), jest.fn()];

      listeners.forEach(fn => channel.addListener(eventName, fn));
      expect(channel.listenerCount(eventName)).toBe(listeners.length);

      channel.removeAllListeners(eventName);
      expect(channel.listenerCount(eventName)).toBe(0);
    });
  });

  describe('method:removeListener', () => {
    it('should remove one listener', () => {
      const eventName = 'event1';
      const listenerToBeRemoved = jest.fn();
      const listeners = [jest.fn(), jest.fn()];
      const findListener = (listener: Listener) =>
        channel.listeners(eventName).find(_listener => _listener === listener);

      listeners.forEach(fn => channel.addListener(eventName, fn));
      channel.addListener(eventName, listenerToBeRemoved);
      expect(findListener(listenerToBeRemoved)).toBe(listenerToBeRemoved);

      channel.removeListener(eventName, listenerToBeRemoved);
      expect(findListener(listenerToBeRemoved)).toBeUndefined();
    });
  });
});

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

    it('should not try to set handler if handler is missing', () => {
      channel = new Channel();
      expect(channel.hasTransport()).not.toBeFalsy();
    });
  });

  // todo before, addListener was called with numbers; is this still the correct test?
  describe('method:addListener', () => {
    it('should call channel.on with args', () => {
      const testFn = jest.fn();
      channel.on = jest.fn();
      channel.addListener('A', testFn);
      expect(channel.on).toHaveBeenCalled();
      expect(channel.on).toHaveBeenCalledWith('A', testFn);
    });
  });

  describe('method:emit', () => {
    it('should call transport.send', () => {
      transport.send = jest.fn();
      const type = 'test-type';
      const args = [1, 2, 3];
      const expected = { type, args };

      channel.emit(type, ...args);
      expect(transport.send).toHaveBeenCalled();

      const event: ChannelEvent = transport.send.mock.calls[0][0];
      expect(typeof event.from).toEqual('string');

      delete event.from;
      expect(event).toEqual(expected);
    });

    it('should be type safe', () => {
      transport.send = jest.fn();
      const type = 'test-type';
      const args = [1, 2, 3];
      const expected = { type, args };

      // todo check if generic argument typing works
      expect(true).toBe(false);
    });

    it('should call handle async option', () => {
      transport.send = jest.fn();
      const type = 'test-type';
      const args = [1, 2, 3];

      channel = new Channel({ async: true, transport });

      channel.emit(type, ...args);
      expect(transport.send).not.toHaveBeenCalled();

      jest.runAllImmediates();
      expect(transport.send).toHaveBeenCalled();
    });
  });

  describe('method:eventNames', () => {
    it('should return an array of strings', () => {
      channel.on('type-1', jest.fn());
      channel.on('type-2', jest.fn());
      channel.on('type-2', jest.fn());
      const expected = ['type-1', 'type-2'];
      expect(channel.eventNames()).toEqual(expected);
    });
  });

  describe('method:listenerCount', () => {
    it('should return the correct count', () => {
      channel.on('type-1', jest.fn());
      channel.on('type-2', jest.fn());
      channel.on('type-2', jest.fn());
      expect(channel.listenerCount('type-1')).toEqual(1);
      expect(channel.listenerCount('type-2')).toEqual(2);
    });
  });

  describe('method:listeners', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const fn3 = jest.fn();

    it('should return an array of listeners', () => {
      channel.on('type-1', fn1);
      channel.on('type-2', fn2);
      channel.on('type-2', fn3);
      expect(channel.listeners('type-1')).toEqual([fn1]);
      expect(channel.listeners('type-2')).toEqual([fn2, fn3]);
    });
  });

  describe('method:on', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const fn3 = jest.fn();

    // todo kinda duplicated? See method:listeners => should return an array of listeners
    // todo _listeners is a private member now
    it('should add event listeners', () => {
      expect(true).toBeFalsy();
      // channel.on('type-1', fn1);
      // channel.on('type-2', fn2);
      // channel.on('type-2', fn3);
      // const expected = {
      //   'type-1': [11],
      //   'type-2': [21, 22],
      // };
      // expect(channel._listeners).toEqual(expected);
    });

    // todo _handleEvent is private; rewrite test
    it('should call event listeners on event', () => {
      expect(true).toBeFalsy();
      // const received: Listener[] = [];
      // channel.on('type-1', n => received.push(n));
      // channel._handleEvent({ type: 'type-1', args: [11] });
      // channel._handleEvent({ type: 'type-1', args: [12] });
      // expect(received).toEqual([11, 12]);
    });
  });

  // todo _listeners is private; rewrite test
  describe('method:once', () => {
    it('should add event listeners', () => {
      expect(true).toBeFalsy();
      // channel.once('type-1', 11);
      // channel.once('type-2', 21);
      // channel.once('type-2', 22);
      // expect(channel._listeners['type-1']).toHaveLength(1);
      // expect(channel._listeners['type-2']).toHaveLength(2);
    });

    // todo _handleEvent is private; rewrite test
    it('should call event listeners only once', () => {
      expect(true).toBeFalsy();
      // const received = [];
      // channel.once('type-1', n => received.push(n));
      // channel._handleEvent({ type: 'type-1', args: [11] });
      // channel._handleEvent({ type: 'type-1', args: [12] });
      // expect(received).toEqual([11]);
    });
  });

  // todo _listeners is private; rewrite test
  describe('method:addPeerListener', () => {
    it('should add event listeners', () => {
      expect(true).toBeFalsy();
      // channel.addPeerListener('type-1', () => {});
      // channel.addPeerListener('type-2', () => {});
      // channel.addPeerListener('type-2', () => {});
      // expect(channel._listeners['type-1']).toHaveLength(1);
      // expect(channel._listeners['type-2']).toHaveLength(2);
    });

    // todo _handleEvent is private; rewrite test
    it('should call event listeners on event', () => {
      expect(true).toBeFalsy();
      // const received = [];
      // channel.addPeerListener('type-1', n => received.push(n));
      // channel._handleEvent({ type: 'type-1', args: [11] });
      // channel._handleEvent({ type: 'type-1', args: [12] });
      // expect(received).toEqual([11, 12]);
    });
  });

  // todo _listeners is private; rewrite test
  describe('method:prependListener', () => {
    it('should add event listeners', () => {
      expect(true).toBeFalsy();
      // channel.prependListener('type-1', 11);
      // channel.prependListener('type-2', 21);
      // channel.prependListener('type-2', 22);
      // const expected = {
      //   'type-1': [11],
      //   'type-2': [22, 21],
      // };
      // expect(channel._listeners).toEqual(expected);
    });
  });

  describe('method:prependOnceListener', () => {
    // todo _listeners is private; rewrite test
    it('should add event listeners', () => {
      expect(true).toBeFalsy();
      // channel.prependOnceListener('type-1', 11);
      // channel.prependOnceListener('type-2', 21);
      // channel.prependOnceListener('type-2', 22);
      // expect(channel._listeners['type-1']).toHaveLength(1);
      // expect(channel._listeners['type-2']).toHaveLength(2);
    });

    // todo _handleEvent is private; rewrite test
    it('should call event listeners only once', () => {
      expect(true).toBeFalsy();
      // const received = [];
      // channel.prependOnceListener('type-1', n => received.push(n));
      // channel._handleEvent({ type: 'type-1', args: [11] });
      // channel._handleEvent({ type: 'type-1', args: [12] });
      // expect(received).toEqual([11]);
    });
  });

  // todo _listeners is private; rewrite test
  describe('method:removeAllListeners', () => {
    it('should remove all listeners', () => {
      expect(true).toBeFalsy();
      // channel.on('type-1', 11);
      // channel.on('type-2', 21);
      // channel.on('type-2', 22);
      // channel.removeAllListeners();
      // expect(channel._listeners).toEqual({});
    });

    it('should remove all listeners for a type', () => {
      expect(true).toBeFalsy();
      // channel.on('type-1', 11);
      // channel.on('type-2', 21);
      // channel.on('type-2', 22);
      // channel.removeAllListeners('type-2');
      // expect(channel._listeners).toEqual({ 'type-1': [11] });
    });
  });

  // todo _listeners is private; rewrite test
  describe('method:removeListener', () => {
    it('should remove all listeners', () => {
      expect(true).toBeFalsy();
      // channel.on('type-1', 11);
      // channel.on('type-2', 21);
      // channel.on('type-2', 22);
      // const expected = {
      //   'type-1': [11],
      //   'type-2': [21],
      // };
      // channel.removeListener('type-2', 22);
      // expect(channel._listeners).toEqual(expected);
    });
  });

  describe('_miscellaneous', () => {
    // todo _handleEvent is private; rewrite test
    it('should ignore if event came from own sender', () => {
      expect(true).toBeFalsy();
      // const received = [];
      // channel.on('type-1', n => received.push(n));
      // channel._handleEvent({ type: 'type-1', args: [11] });
      // channel._handleEvent({ type: 'type-1', args: [12], from: channel._sender });
      // expect(received).toEqual([11]);
    });

    // todo _handleEvent is private; rewrite test
    it('should not ignore peer event', () => {
      expect(true).toBeFalsy();
      // const received = [];
      // channel.on('type-1', n => received.push(n));
      // channel._handleEvent({ type: 'type-1', args: [11] });
      // channel._handleEvent({ type: 'type-1', args: [12] }, true);
      // expect(received).toEqual([11, 12]);
    });

    // todo _handleEvent is private; rewrite test
    it('should ignore if event handled by addPeerListener', () => {
      expect(true).toBeFalsy();
      // const received = [];
      // channel.addPeerListener('type-1', n => received.push(n));
      // channel._handleEvent({ type: 'type-1', args: [11], from: channel._sender });
      // channel._handleEvent({ type: 'type-1', args: [12], from: '_' });
      // channel._handleEvent({ type: 'type-1', args: [13] }, true);
      // expect(received).toEqual([12]);
    });
  });
});

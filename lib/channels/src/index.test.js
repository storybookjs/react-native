/* eslint no-underscore-dangle: 0 */

import Channel from './';

describe('Channel', () => {
  let transport = null;
  let channel = null;

  beforeEach(() => {
    transport = { setHandler: jest.fn(), send: jest.fn() };
    channel = new Channel({ transport });
  });

  describe('constructor', () => {
    it('should set the handler', () => {
      expect(transport.setHandler).toHaveBeenCalled();
    });
  });

  describe('method:addListener', () => {
    it('should call channel.on with args', () => {
      channel.on = jest.fn();
      channel.addListener(1, 2);
      expect(channel.on).toHaveBeenCalled();
      expect(channel.on).toHaveBeenCalledWith(1, 2);
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

      const event = transport.send.mock.calls[0][0];
      expect(typeof event.from).toEqual('string');

      delete event.from;
      expect(event).toEqual(expected);
    });
  });

  describe('method:eventNames', () => {
    it('should return an array of strings', () => {
      channel.on('type-1', 11);
      channel.on('type-2', 21);
      channel.on('type-2', 22);
      const expected = ['type-1', 'type-2'];
      expect(channel.eventNames()).toEqual(expected);
    });
  });

  describe('method:listenerCount', () => {
    it('should return the correct count', () => {
      channel.on('type-1', 11);
      channel.on('type-2', 21);
      channel.on('type-2', 22);
      expect(channel.listenerCount('type-1')).toEqual(1);
      expect(channel.listenerCount('type-2')).toEqual(2);
    });
  });

  describe('method:listeners', () => {
    it('should return an array of listeners', () => {
      channel.on('type-1', 11);
      channel.on('type-2', 21);
      channel.on('type-2', 22);
      expect(channel.listeners('type-1')).toEqual([11]);
      expect(channel.listeners('type-2')).toEqual([21, 22]);
    });
  });

  describe('method:on', () => {
    it('should add event listeners', () => {
      channel.on('type-1', 11);
      channel.on('type-2', 21);
      channel.on('type-2', 22);
      const expected = {
        'type-1': [11],
        'type-2': [21, 22],
      };
      expect(channel._listeners).toEqual(expected);
    });

    it('should call event listeners on event', () => {
      const received = [];
      channel.on('type-1', n => received.push(n));
      channel._handleEvent({ type: 'type-1', args: [11] });
      channel._handleEvent({ type: 'type-1', args: [12] });
      expect(received).toEqual([11, 12]);
    });
  });

  describe('method:once', () => {
    it('should add event listeners', () => {
      channel.once('type-1', 11);
      channel.once('type-2', 21);
      channel.once('type-2', 22);
      expect(channel._listeners['type-1']).toHaveLength(1);
      expect(channel._listeners['type-2']).toHaveLength(2);
    });

    it('should call event listeners only once', () => {
      const received = [];
      channel.once('type-1', n => received.push(n));
      channel._handleEvent({ type: 'type-1', args: [11] });
      channel._handleEvent({ type: 'type-1', args: [12] });
      expect(received).toEqual([11]);
    });
  });

  describe('method:addPeerListener', () => {
    it('should add event listeners', () => {
      channel.addPeerListener('type-1', () => {});
      channel.addPeerListener('type-2', () => {});
      channel.addPeerListener('type-2', () => {});
      expect(channel._listeners['type-1']).toHaveLength(1);
      expect(channel._listeners['type-2']).toHaveLength(2);
    });

    it('should call event listeners on event', () => {
      const received = [];
      channel.addPeerListener('type-1', n => received.push(n));
      channel._handleEvent({ type: 'type-1', args: [11] });
      channel._handleEvent({ type: 'type-1', args: [12] });
      expect(received).toEqual([11, 12]);
    });
  });

  describe('method:prependListener', () => {
    it('should add event listeners', () => {
      channel.prependListener('type-1', 11);
      channel.prependListener('type-2', 21);
      channel.prependListener('type-2', 22);
      const expected = {
        'type-1': [11],
        'type-2': [22, 21],
      };
      expect(channel._listeners).toEqual(expected);
    });
  });

  describe('method:prependOnceListener', () => {
    it('should add event listeners', () => {
      channel.prependOnceListener('type-1', 11);
      channel.prependOnceListener('type-2', 21);
      channel.prependOnceListener('type-2', 22);
      expect(channel._listeners['type-1']).toHaveLength(1);
      expect(channel._listeners['type-2']).toHaveLength(2);
    });

    it('should call event listeners only once', () => {
      const received = [];
      channel.prependOnceListener('type-1', n => received.push(n));
      channel._handleEvent({ type: 'type-1', args: [11] });
      channel._handleEvent({ type: 'type-1', args: [12] });
      expect(received).toEqual([11]);
    });
  });

  describe('method:removeAllListeners', () => {
    it('should remove all listeners', () => {
      channel.on('type-1', 11);
      channel.on('type-2', 21);
      channel.on('type-2', 22);
      channel.removeAllListeners();
      expect(channel._listeners).toEqual({});
    });

    it('should remove all listeners for a type', () => {
      channel.on('type-1', 11);
      channel.on('type-2', 21);
      channel.on('type-2', 22);
      channel.removeAllListeners('type-2');
      expect(channel._listeners).toEqual({ 'type-1': [11] });
    });
  });

  describe('method:removeListener', () => {
    it('should remove all listeners', () => {
      channel.on('type-1', 11);
      channel.on('type-2', 21);
      channel.on('type-2', 22);
      const expected = {
        'type-1': [11],
        'type-2': [21],
      };
      channel.removeListener('type-2', 22);
      expect(channel._listeners).toEqual(expected);
    });
  });

  describe('_miscellaneous', () => {
    it('should not ignore if event came from itself', () => {
      const received = [];
      channel.on('type-1', n => received.push(n));
      channel._handleEvent({ type: 'type-1', args: [11] });
      channel._handleEvent({ type: 'type-1', args: [12], from: channel._sender });
      expect(received).toEqual([11, 12]);
    });

    it('should ignore if event handled by addPeerListener', () => {
      const received = [];
      channel.addPeerListener('type-1', n => received.push(n));
      channel._handleEvent({ type: 'type-1', args: [11], from: channel._sender });
      channel._handleEvent({ type: 'type-1', args: [12], from: '_' });
      expect(received).toEqual([12]);
    });
  });
});

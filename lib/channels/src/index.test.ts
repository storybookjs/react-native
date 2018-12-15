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
      const keyValue = 'stringAsKey';

      channel.addListener(keyValue, jest.fn());
      expect(channel.listeners(keyValue).length).toBe(1);
    });
  });

  describe('method:emit', () => {
    // todo check if [] or string is returned
    it('should emit the added listener', () => {
      const keyValue = 'stringAsKey';
      const mockListener: Listener = (data: string) => {
        return data;
      };
      const mockReturnValue = ['string1', 'string2', 'string3'];

      channel.addListener(keyValue, mockListener);
      channel.emit<string>(keyValue, ...mockReturnValue);
      expect(mockListener).toReturnWith(mockReturnValue);
    });
  });

  describe('method:addPeerListener', () => {});

  // todo before, addListener was called with numbers; is this still the correct test?
  // describe('method:addListener', () => {
  //   it('should call channel.on with args', () => {
  //     const testFn = jest.fn();
  //     channel.on = jest.fn();
  //     channel.addListener('A', testFn);
  //     expect(channel.on).toHaveBeenCalled();
  //     expect(channel.on).toHaveBeenCalledWith('A', testFn);
  //   });
  // });
  //
  // describe('method:emit', () => {
  //   it('should call transport.send', () => {
  //     transport.send = jest.fn();
  //     const type = 'test-type';
  //     const args = [1, 2, 3];
  //     const expected = { type, args };
  //
  //     channel.emit(type, ...args);
  //     expect(transport.send).toHaveBeenCalled();
  //
  //     const event: ChannelEvent = transport.send.mock.calls[0][0];
  //     expect(typeof event.from).toEqual('string');
  //
  //     delete event.from;
  //     expect(event).toEqual(expected);
  //   });
  //
  //   it('should be type safe', () => {
  //     transport.send = jest.fn();
  //     const type = 'test-type';
  //     const args = [1, 2, 3];
  //     const expected = { type, args };
  //
  //     // todo check if generic argument typing works
  //     expect(true).toBe(false);
  //   });
  //
  //   it('should call handle async option', () => {
  //     transport.send = jest.fn();
  //     const type = 'test-type';
  //     const args = [1, 2, 3];
  //
  //     channel = new Channel({ async: true, transport });
  //
  //     channel.emit(type, ...args);
  //     expect(transport.send).not.toHaveBeenCalled();
  //
  //     jest.runAllImmediates();
  //     expect(transport.send).toHaveBeenCalled();
  //   });
  // });
  //
  // describe('method:eventNames', () => {
  //   it('should return an array of strings', () => {
  //     channel.on('type-1', jest.fn());
  //     channel.on('type-2', jest.fn());
  //     channel.on('type-2', jest.fn());
  //     const expected = ['type-1', 'type-2'];
  //     expect(channel.eventNames()).toEqual(expected);
  //   });
  // });
  //
  // describe('method:listenerCount', () => {
  //   it('should return the correct count', () => {
  //     channel.on('type-1', jest.fn());
  //     channel.on('type-2', jest.fn());
  //     channel.on('type-2', jest.fn());
  //     expect(channel.listenerCount('type-1')).toEqual(1);
  //     expect(channel.listenerCount('type-2')).toEqual(2);
  //   });
  // });
  //
  // describe('method:listeners', () => {
  //   const fn1 = jest.fn();
  //   const fn2 = jest.fn();
  //   const fn3 = jest.fn();
  //
  //   it('should return an array of listeners', () => {
  //     channel.on('type-1', fn1);
  //     channel.on('type-2', fn2);
  //     channel.on('type-2', fn3);
  //     expect(channel.listeners('type-1')).toEqual([fn1]);
  //     expect(channel.listeners('type-2')).toEqual([fn2, fn3]);
  //   });
  // });
  //
  // describe('method:on', () => {
  //   const fn1 = jest.fn();
  //   const fn2 = jest.fn();
  //   const fn3 = jest.fn();
  // });
});

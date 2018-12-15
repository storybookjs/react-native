export interface ChannelTransport {
  send: any; // todo Check actual type
  setHandler<TEventArgs = any>(handler: (event: ChannelEvent<TEventArgs>) => void): void;
}

export interface ChannelEvent<TEventArgs = any> {
  type: string; // todo deprecate in favor of prop name eventName? type totally confused me after I saw eventNames()
  from: string;
  args: TEventArgs[];
}

export interface Listener<TEventArgs = any> {
  (...args: TEventArgs[]): void;
  ignorePeer?: boolean;
}

interface EventsKeyValue {
  [key: string]: Listener[];
}

interface ChannelArgs {
  transport?: ChannelTransport;
  async?: boolean;
}

const generateRandomId = () => {
  // generates a random 13 character string
  return Math.random()
    .toString(16)
    .slice(2);
};

export class Channel {
  readonly isAsync: boolean;

  private _sender = generateRandomId();
  private _events: EventsKeyValue = {};
  private readonly _transport: ChannelTransport;

  constructor({ transport, async = false }: ChannelArgs = {}) {
    this.isAsync = async;
    if (transport) {
      this._transport = transport;
      this._transport.setHandler(event => this._handleEvent(event));
    }
  }

  get hasTransport() {
    return !!this._transport;
  }

  addListener(eventName: string, listener: Listener) {
    this._events[eventName] = this._events[eventName] || [];
    this._events[eventName].push(listener);
  }

  addPeerListener(eventName: string, listener: Listener) {
    const peerListener = listener;
    peerListener.ignorePeer = true;
    this.addListener(eventName, peerListener);
  }

  emit<TEventArgs = any>(eventName: string, ...args: TEventArgs[]) {
    const event = { type: eventName, args, from: this._sender };

    const handler = () => {
      if (this._transport) {
        this._transport.send(event);
      }
      this._handleEvent(event, true);
    };

    if (this.isAsync) {
      setImmediate(handler);
    } else {
      handler();
    }
  }

  eventNames() {
    return Object.keys(this._events);
  }

  listenerCount(eventName: string) {
    const listeners = this.listeners(eventName);
    return listeners ? listeners.length : 0;
  }

  listeners(eventName: string): Listener[] | undefined {
    const listeners = this._events[eventName];
    return listeners ? listeners : undefined;
  }

  once(eventName: string, listener: Listener) {
    const onceListener = this._onceListener(eventName, listener);
    this.addListener(eventName, onceListener);
  }

  prependListener(eventName: string, listener: Listener) {
    this._events[eventName] = this._events[eventName] || [];
    this._events[eventName].unshift(listener);
  }

  prependOnceListener(eventName: string, listener: Listener) {
    const onceListener = this._onceListener(eventName, listener);
    this.prependListener(eventName, onceListener);
  }

  removeAllListeners(eventName: string) {
    if (!eventName) {
      this._events = {};
    } else if (this._events[eventName]) {
      delete this._events[eventName];
    }
  }

  removeListener(eventName: string, listener: Listener) {
    const listeners = this._events[eventName];
    if (listeners) {
      this._events[eventName] = listeners.filter(l => l !== listener);
    }
  }

  /**
   * @deprecated use addListener
   */
  on(eventName: string, listener: Listener) {
    this.addListener(eventName, listener);
  }

  private _handleEvent(event: ChannelEvent, isPeer = false) {
    const listeners = this._events[event.type];
    if (listeners && (isPeer || event.from !== this._sender)) {
      listeners.forEach(fn => !(isPeer && fn.ignorePeer) && fn(...event.args));
    }
  }

  private _onceListener(eventName: string, listener: Listener) {
    const onceListener = (...args: any[]) => {
      this.removeListener(eventName, onceListener);
      return listener(...args);
    };
    return onceListener;
  }
}

export default Channel;

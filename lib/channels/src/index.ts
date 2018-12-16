export interface ChannelTransport<TEventArgs = any> {
  send(event: ChannelEvent<TEventArgs>): void;
  setHandler(handler: (event: ChannelEvent<TEventArgs>) => void): void;
}

export interface ChannelEvent<TEventArgs = any> {
  type: string; // eventName
  from: string;
  args: TEventArgs;
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

  addListener<TEventArgs = any>(eventName: string, listener: Listener<TEventArgs>) {
    this._events[eventName] = this._events[eventName] || [];
    this._events[eventName].push(listener);
  }

  addPeerListener<TEventArgs = any>(eventName: string, listener: Listener<TEventArgs[]>) {
    const peerListener = listener;
    peerListener.ignorePeer = true;
    this.addListener(eventName, peerListener);
  }

  emit<TEventArgs = any>(eventName: string, ...args: TEventArgs[]) {
    const event: ChannelEvent<TEventArgs[]> = { type: eventName, args, from: this._sender };

    const handler = () => {
      if (this._transport) {
        this._transport.send(event);
      }
      this._handleEvent(event, true);
    };

    if (this.isAsync) {
      // todo I'm not sure how to test this
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

  once<TEventArgs = any>(eventName: string, listener: Listener<TEventArgs>) {
    const onceListener: Listener = this._onceListener<TEventArgs>(eventName, listener);
    this.addListener<TEventArgs>(eventName, onceListener);
  }

  prependListener<TEventArgs = any>(eventName: string, listener: Listener<TEventArgs>) {
    this._events[eventName] = this._events[eventName] || [];
    this._events[eventName].unshift(listener);
  }

  // todo 'listener' is getting mutated by _onceListener, therefore: Input fn() !== Output fn(). This makes testing more difficult
  prependOnceListener<TEventArgs = any>(eventName: string, listener: Listener<TEventArgs>) {
    const onceListener: Listener = this._onceListener<TEventArgs>(eventName, listener);
    this.prependListener(eventName, onceListener);
  }

  removeAllListeners(eventName?: string) {
    if (!eventName) {
      this._events = {};
    } else if (this._events[eventName]) {
      delete this._events[eventName];
    }
  }

  removeListener(eventName: string, listener: Listener) {
    const listeners = this.listeners(eventName);
    if (listeners) {
      this._events[eventName] = listeners.filter(l => l !== listener);
    }
  }

  /**
   * @deprecated use addListener
   */
  on<TEventArgs = any>(eventName: string, listener: Listener<TEventArgs>) {
    this.addListener<TEventArgs>(eventName, listener);
  }

  private _handleEvent<TEventArgs = any>(event: ChannelEvent<TEventArgs[]>, isPeer = false) {
    const listeners = this._events[event.type];
    if (listeners && (isPeer || event.from !== this._sender)) {
      listeners.forEach(fn => !(isPeer && fn.ignorePeer) && fn(...event.args));
    }
  }

  private _onceListener<TEventArgs>(eventName: string, listener: Listener<TEventArgs>) {
    const onceListener: Listener<TEventArgs> = (...args: TEventArgs[]) => {
      this.removeListener(eventName, onceListener);
      return listener(...args);
    };
    return onceListener;
  }
}

export default Channel;

import { WebSocket } from 'global';
import { Channel } from '@storybook/channels';

type OnError = (message: Event) => void;

interface WebsocketTransportArgs {
  url: string;
  onError: OnError;
}

interface CreateChannelArgs {
  url: string;
  async: boolean;
  onError: OnError;
}

export class WebsocketTransport {
  private _socket: WebSocket;
  private _handler: any;
  private _buffer: string[] = [];
  private _isReady = false;

  constructor({ url, onError }: WebsocketTransportArgs) {
    this._connect(url, onError);
  }

  setHandler(handler) {
    this._handler = handler;
  }

  send(event) {
    if (!this._isReady) {
      this._sendLater(event);
    } else {
      this._sendNow(event);
    }
  }

  private _sendLater(event) {
    this._buffer.push(event);
  }

  private _sendNow(event) {
    const data = JSON.stringify(event);
    this._socket.send(data);
  }

  private _flush() {
    const buffer = this._buffer;
    this._buffer = [];
    buffer.forEach(event => this.send(event));
  }

  private _connect(url: string, onError: OnError) {
    this._socket = new WebSocket(url);
    this._socket.onopen = () => {
      this._isReady = true;
      this._flush();
    };
    this._socket.onmessage = e => {
      const event = JSON.parse(e.data);
      this._handler(event);
    };
    this._socket.onerror = e => {
      if (onError) {
        onError(e);
      }
    };
  }
}

export default function createChannel({ url, async, onError }: CreateChannelArgs) {
  const transport = new WebsocketTransport({ url, onError });
  return new Channel({ transport, async });
}

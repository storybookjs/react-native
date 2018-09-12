/* eslint-disable no-underscore-dangle */

import { WebSocket } from 'global';
import JSON from 'json-fn';
import Channel from '@storybook/channels';

const logger = console;

export class WebsocketTransport {
  constructor({ url }) {
    this._socket = null;
    this._buffer = [];
    this._handler = null;
    this._isReady = false;
    this._connect(url);
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

  _sendLater(event) {
    this._buffer.push(event);
  }

  _sendNow(event) {
    const data = JSON.stringify(event);
    this._socket.send(data);
  }

  _flush() {
    const buffer = this._buffer;
    this._buffer = [];
    buffer.forEach(event => this.send(event));
  }

  _connect(url) {
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
      logger.error('websocket: connection error', e.message);
    };
    this._socket.onclose = e => {
      logger.error('websocket: connection closed', e.code, e.reason);
    };
  }
}

export default function createChannel({ url }) {
  const transport = new WebsocketTransport({ url });
  return new Channel({ transport });
}

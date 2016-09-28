import Channel from '@kadira/storybook-channel';

export default function createChannel({ key }) {
  const transport = new PostmsgTransport({ key });
  return new Channel({ transport });
}

export class PostmsgTransport {
  constructor({ key }) {
    this._key = key;
    this._buffer = [];
    this._handler = null;
    window.addEventListener('message', this._handleEvent.bind(this), false);
    document.addEventListener('DOMContentLoaded', () => this._flush());
  }

  setHandler(handler) {
    this._handler = handler;
  }

  send(event) {
    const iframeWindow = this._getWindow();
    if (!iframeWindow) {
      return new Promise((resolve, reject) => {
        this._buffer.push({ event, resolve, reject });
      });
    }
    const data = { key: this._key, event };
    iframeWindow.postMessage(data, '*');
    return Promise.resolve(null);
  }

  _flush() {
    const buffer = this._buffer;
    this._buffer = [];
    buffer.forEach(item => {
      this.send(item.event)
        .then(item.resolve)
        .catch(item.reject);
    });
  }

  _getWindow() {
    if (window.top === window.self) {
      // FIXME this is a really bad idea! use a better way to do this.
      // This finds the storybook preview iframe to send messages to.
      const iframe = document.getElementById('storybook-preview-iframe');
      if (!iframe) {
        return null;
      }
      return iframe.contentWindow;
    }
    return window.top;
  }

  _handleEvent(e) {
    if(!e.data || typeof(e.data) !== 'object') {
      return;
    }
    const { key, event } = e.data;
    if (key !== this._key) {
      return null;
    }
    this._handler(event);
  }
}

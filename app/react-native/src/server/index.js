import express from 'express';
import querystring from 'querystring';
import http from 'http';
import ws from 'ws';
import storybook from './middleware';

export default class Server {
  constructor(options) {
    this.options = options;
    this.httpServer = http.createServer();
    this.expressApp = express();
    this.expressApp.use(storybook(options));
    this.httpServer.on('request', this.expressApp);
    this.wsServer = new ws.Server({ server: this.httpServer });
    this.wsServer.on('connection', (s, req) => this.handleWS(s, req));
  }

  handleWS(socket, req) {
    if (this.options.manualId) {
      const params = req.url ? querystring.parse(req.url.substr(1)) : {};

      if (params.pairedId) {
        socket.pairedId = params.pairedId; // eslint-disable-line
      }
    }

    socket.on('message', data => {
      this.wsServer.clients.forEach(c => {
        if (!this.options.manualId || (socket.pairedId && socket.pairedId === c.pairedId)) {
          c.send(data);
        }
      });
    });
  }

  listen(...args) {
    this.httpServer.listen(...args);
  }
}

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
    this.wsServer = ws.Server({ server: this.httpServer });
    this.wsServer.on('connection', s => this.handleWS(s));
  }

  handleWS(socket) {
    if (this.options.manualId) {
      const params = socket.upgradeReq && socket.upgradeReq.url
        ? querystring.parse(socket.upgradeReq.url.substr(1))
        : {};

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

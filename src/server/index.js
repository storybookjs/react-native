import express from 'express';
import http from 'http';
import ws from 'ws';
import storybook from './middleware';

export default class Server {
  constructor(options) {
    this.options = options;
    this.httpServer = http.createServer();
    this.expressApp = express();
    this.expressApp.use(storybook(options.configDir));
    this.httpServer.on('request', this.expressApp);
    this.wsServer = ws.Server({server: this.httpServer});
    this.wsServer.on('connection', s => this.handleWS(s));
  }

  handleWS(socket) {
    socket.on('message', data => {
      this.wsServer.clients.forEach(c => c.send(data));
    });
  }

  listen(...args) {
    this.httpServer.listen(...args);
  }
}

#!/usr/bin/env node

import querystring from 'querystring';
import ws from 'ws';
import storybook from '@storybook/core/standalone';

import extendOptions from './options';
import getCli from './cli';

export default class Server {
  constructor(options) {
    this.attachWS = this.attachWS.bind(this);
    this.options = extendOptions(options, this.attachWS);
  }

  start() {
    return storybook(this.options);
  }

  attachWS(server) {
    this.wsServer = new ws.Server({ server });
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
}

const server = new Server(getCli());
server.start();

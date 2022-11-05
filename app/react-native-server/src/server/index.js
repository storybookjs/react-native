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
    console.log({ port: this.options.port, host: this.options.host });
    return storybook({ ...this.options, port: 7007, host: '192.168.1.185' });
    // TODO: figure out why port/host are not getting passed correctly
  }

  attachWS(server) {
    this.wsServer = new ws.Server({ server });
    this.wsServer.on('connection', (s, req) => this.handleWS(s, req));
  }

  handleWS(socket, req) {
    if (this.options.manualId) {
      const params = req.url ? querystring.parse(req.url.substr(1)) : {};

      if (params.pairedId) {
        socket.pairedId = params.pairedId;
      }
    }

    socket.on('message', (data) => {
      this.wsServer.clients.forEach((c) => {
        if (!this.options.manualId || (socket.pairedId && socket.pairedId === c.pairedId)) {
          c.send(data);
        }
      });
    });
  }
}

const server = new Server(getCli());
server.start();

#!/usr/bin/env node

import querystring from 'querystring';
import ws, { ServerOptions } from 'ws';
import { buildDevStandalone } from '@storybook/core-server';
import extendOptions from './options';
import getCli, { RNServerCLIOptions } from './cli';
import { IncomingMessage } from 'http';
import WebSocket from 'ws';

export default class Server {
  options: RNServerCLIOptions;
  wsServer: ws.Server;

  constructor(options: RNServerCLIOptions) {
    this.attachWS = this.attachWS.bind(this);

    this.options = extendOptions(options, this.attachWS);
    //@ts-ignore
    this.options.extendedServer = this;
  }

  start() {
    return buildDevStandalone(this.options);
  }

  attachWS(server: ServerOptions['server']) {
    this.wsServer = new ws.Server({ server });

    this.wsServer.on('connection', (s, req) => this.handleWS(s, req));
  }

  handleWS(socket: WebSocket, req: IncomingMessage) {
    if (this.options.manualId) {
      const params = req.url ? querystring.parse(req.url.substr(1)) : {};

      if (params.pairedId) {
        // @ts-expect-error FIXME pairedId is not defined on WebSocket
        socket.pairedId = params.pairedId;
      }
    }

    socket.on('message', (data) => {
      this.wsServer.clients.forEach((c) => {
        // @ts-expect-error FIXME pairedId is not defined on WebSocket
        if (!this.options.manualId || (socket.pairedId && socket.pairedId === c.pairedId)) {
          c.send(data);
        }
      });
    });
  }
}

const server = new Server(getCli());

server.start();

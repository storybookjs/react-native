#!/usr/bin/env node

import getCli from '../server/cli';
import Server from '../server';

const server = new Server(getCli());
server.start();

#!/usr/bin/env node

import WebSocket from 'ws';
import fs from 'fs';

const host = process.argv[2] || 'localhost';
const port = process.argv[3] || 7007;
const url = `ws://${host}:${port}`;

console.log(`Connecting to ${url}...`);

const ws = new WebSocket(url);

ws.on('open', () => {
  console.log('Connected!');

  const message = JSON.stringify({
    type: 'RN_GET_INDEX',
    args: [],
    from: 'test-script',
  });

  console.log('Sending:', message);
  ws.send(message);
});

ws.on('message', async (data) => {
  const raw = data.toString();
  try {
    const parsed = JSON.parse(raw);
    if (parsed.from === 'test-script' || parsed.type !== 'RN_GET_INDEX_RESPONSE') {
      return;
    }
    fs.writeFileSync('index.json', JSON.stringify(parsed.args[0].index, null, 2));

    // const restIndex = await fetch(`http://${host}:${port}/index.json`);
    // const indexJson = await restIndex.json();
    // fs.writeFileSync('index-rest.json', JSON.stringify(indexJson, null, 2));

    process.exit(0);
  } catch {
    console.log('Received (raw):', raw);
  }
});

ws.on('error', (err) => {
  console.error('Error:', err.message);
});

ws.on('close', () => {
  console.log('Connection closed');
});

// Close after 10 seconds
setTimeout(() => {
  console.log('Timeout, closing...');
  ws.close();
}, 10000);

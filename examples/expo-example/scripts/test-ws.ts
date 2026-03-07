#!/usr/bin/env node

import WebSocket from 'ws';
import fs from 'fs';

const positionalArgs = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
const secured =
  process.argv.includes('--secure') || process.env.EXPO_PUBLIC_STORYBOOK_WS_SECURED === 'true';
const host = positionalArgs[0] || 'localhost';
const port = parseInt(positionalArgs[1] || '7007', 10);
const protocol = secured ? 'wss' : 'ws';
const url = `${protocol}://${host}:${port}`;

console.log(`Connecting to ${url}...`);

const ws = new WebSocket(url, secured ? { rejectUnauthorized: false } : undefined);

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

    // const restIndex = await fetch(`${secured ? 'https' : 'http'}://${host}:${port}/index.json`);
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

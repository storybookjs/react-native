#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createChannelServer } from '@storybook/react-native/node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, '../.rnstorybook');
const positionalArgs = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
const secured =
  process.argv.includes('--secure') || process.env.EXPO_PUBLIC_STORYBOOK_WS_SECURED === 'true';
const host = positionalArgs[0] || 'localhost';
const port = parseInt(positionalArgs[1] || '7007', 10);
const keyPath = path.resolve(__dirname, '../.certs/storybook-localhost-key.pem');
const certPath = path.resolve(__dirname, '../.certs/storybook-localhost-cert.pem');
const resolveTlsFile = (filePath: string, label: string) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing Storybook TLS ${label} file at ${filePath}`);
  }

  return fs.readFileSync(filePath);
};

const ssl = secured
  ? {
      key: resolveTlsFile(keyPath, 'key'),
      cert: resolveTlsFile(certPath, 'cert'),
    }
  : undefined;

console.log('🔌 Starting channel server...');
console.log(`   Config path: ${configPath}`);
console.log(`   Host: ${host}`);
console.log(`   Port: ${port}`);
console.log(`   Secure: ${secured ? 'yes' : 'no'}`);

createChannelServer({ port, host, configPath, secured, ssl });

console.log(`\n✅ Channel server running at ${secured ? 'https' : 'http'}://${host}:${port}`);
console.log('   Endpoints:');
console.log('   - GET  /index.json   - Get story index');
console.log('   - POST /send-event   - Send event to WebSocket clients');
console.log(
  '   - POST /select-story-sync/{story-id} - Set story and wait for render (500ms fallback for last render, 1000ms hard timeout)'
);
console.log(`   - ${secured ? 'WSS' : 'WS '}  /             - WebSocket connection`);
console.log('\nPress Ctrl+C to stop');

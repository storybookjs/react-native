#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
import { createChannelServer } from '@storybook/react-native/node';

// @ts-expect-error we run with esm
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, '../.rnstorybook');
const host = process.argv[2] || 'localhost';
const port = parseInt(process.argv[3] || '7007', 10);

console.log('🔌 Starting channel server...');
console.log(`   Config path: ${configPath}`);
console.log(`   Host: ${host}`);
console.log(`   Port: ${port}`);

createChannelServer({ port, host, configPath });

console.log(`\n✅ Channel server running at http://${host}:${port}`);
console.log('   Endpoints:');
console.log('   - GET  /index.json   - Get story index');
console.log('   - POST /send-event   - Send event to WebSocket clients');
console.log('   - WS   /             - WebSocket connection');
console.log('\nPress Ctrl+C to stop');

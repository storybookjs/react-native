#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { buildIndex } from '@storybook/react-native/node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, '../.rnstorybook');
const outputFile = process.argv[2] || 'index.json';

async function main() {
  console.log('📚 Building story index...');
  console.log(`   Config path: ${configPath}`);

  try {
    const index = await buildIndex({ configPath });

    const entryCount = Object.keys(index.entries).length;
    console.log(`   ✅ Built index with ${entryCount} stories`);

    fs.writeFileSync(outputFile, JSON.stringify(index, null, 2));
    console.log(`   📄 Saved to ${outputFile}`);

    // Show sample entries
    const entryIds = Object.keys(index.entries).slice(0, 5);
    console.log('\n   Sample entries:');
    for (const id of entryIds) {
      console.log(`   - ${id}`);
    }

    if (entryCount > 5) {
      console.log(`   ... and ${entryCount - 5} more`);
    }
  } catch (error) {
    console.error('❌ Failed to build index:', error);
    process.exit(1);
  }
}

main();

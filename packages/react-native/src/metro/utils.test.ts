import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

describe('resolveEntryPoint', () => {
  const { resolveEntryPoint } = require('./utils');
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-entry-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('resolves package.json main field (Expo-style)', () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ main: 'index.js' }));
    fs.writeFileSync(path.join(tmpDir, 'index.js'), '// entry');

    const result = resolveEntryPoint(tmpDir);
    expect(result).toBe(path.join(tmpDir, 'index.js'));
  });

  test('resolves main field without extension', () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ main: 'src/entry' }));
    fs.mkdirSync(path.join(tmpDir, 'src'));
    fs.writeFileSync(path.join(tmpDir, 'src', 'entry.tsx'), '// entry');

    const result = resolveEntryPoint(tmpDir);
    expect(result).toBe(path.join(tmpDir, 'src', 'entry.tsx'));
  });

  test('falls back to index.js when no package.json exists', () => {
    fs.writeFileSync(path.join(tmpDir, 'index.js'), '// entry');

    const result = resolveEntryPoint(tmpDir);
    expect(result).toBe(path.join(tmpDir, 'index.js'));
  });

  test('falls back to index.ts when no package.json main', () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'test-app' }));
    fs.writeFileSync(path.join(tmpDir, 'index.ts'), '// entry');

    const result = resolveEntryPoint(tmpDir);
    expect(result).toBe(path.join(tmpDir, 'index.ts'));
  });

  test('detects expo-router entry point', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ main: 'expo-router/entry' })
    );

    fs.mkdirSync(path.join(tmpDir, 'node_modules', 'expo-router'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpDir, 'node_modules', 'expo-router', 'entry.js'),
      '// expo-router entry'
    );

    const result = resolveEntryPoint(tmpDir);

    expect(result).toBe(path.resolve(__dirname, '../../../../node_modules/expo-router/entry.js'));
  });

  test('returns undefined when no entry file exists', () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ main: 'nonexistent.js' }));

    const result = resolveEntryPoint(tmpDir);
    expect(result).toBeUndefined();
  });

  test('resolves main field with .tsx extension', () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ main: 'App.tsx' }));
    fs.writeFileSync(path.join(tmpDir, 'App.tsx'), '// entry');

    const result = resolveEntryPoint(tmpDir);
    expect(result).toBe(path.join(tmpDir, 'App.tsx'));
  });
});

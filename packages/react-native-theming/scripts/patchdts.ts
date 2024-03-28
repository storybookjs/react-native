async function run() {
  const { readFile, writeFile } = await import('fs/promises');
  // add a string of text at the end of the dist/index.d.ts file
  console.log('writing to dist/index.d.ts');
  const contents = await readFile('dist/index.d.ts', 'utf-8');
  await writeFile(
    'dist/index.d.ts',
    contents.replace('interface Theme {}', 'export interface Theme extends StorybookTheme {}')
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

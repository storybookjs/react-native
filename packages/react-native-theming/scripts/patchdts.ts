async function run() {
  const { appendFile } = await import('fs/promises');
  // add a string of text at the end of the dist/index.d.ts file
  console.log('Appending to dist/index.d.ts');
  await appendFile('dist/index.d.ts', '\n export interface Theme extends StorybookTheme {}');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

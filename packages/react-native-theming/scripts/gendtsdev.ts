async function run() {
  const { writeFile } = await import('fs/promises');
  // add a string of text at the end of the dist/index.d.ts file
  console.log('creating dev dist/index.d.ts');
  const contents = `
    import { StorybookTheme } from '../src/index';
    export * from '../src/index';
    export interface Theme extends StorybookTheme {}
  `;
  await writeFile('dist/index.d.ts', contents);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

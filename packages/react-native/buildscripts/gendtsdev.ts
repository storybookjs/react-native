async function run() {
  const { writeFile } = await import('fs/promises');
  // add a string of text at the end of the dist/index.d.ts file
  console.log('creating dev dist/index.d.ts');
  const contents = `
    export * from '../src/index';
  `;
  await writeFile('dist/index.d.ts', contents);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

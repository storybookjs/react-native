async function main() {
  const { readFile, writeFile } = await import('fs/promises');
  // add a string of text at the end of the dist/index.d.ts file
  console.log('writing to dist/index.d.ts');
  const contents = await readFile('dist/index.d.ts', 'utf-8');
  if (contents.includes('interface Theme {}')) {
    await writeFile(
      'dist/index.d.ts',
      contents.replace('interface Theme {}', 'export interface Theme extends StorybookTheme {}')
    );
  } else {
    await writeFile(
      'dist/index.d.ts',
      `${contents}\nexport interface Theme extends StorybookTheme {}`
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

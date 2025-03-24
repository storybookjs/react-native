import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const run = async () => {
  const { buildIndex } = await import('storybook/internal/core-server');
  const index = await buildIndex({
    configDir: join(__dirname, '../.rnstorybook'),
  });

  // Ensure .maestro directory exists
  const maestroDir = join(__dirname, '../.maestro');
  mkdirSync(maestroDir, { recursive: true });

  // Generate Maestro test file content
  const stories = Object.values(index.entries)
    .filter((entry: any) => entry.type === 'story')
    .map((story: any) => ({
      id: story.id,
      name: story.title.replace(/\//g, '-') + ' - ' + story.name,
    }));

  const maestroContent = `appId: host.exp.Exponent
name: Take screenshots of all Storybook stories
---
- stopApp: host.exp.Exponent

${stories
  .map(
    (story, index) => `# Story ${index}
- openLink: 'exp://127.0.0.1:8081/--/?STORYBOOK_STORY_ID=${story.id}'
- waitForAnimationToEnd
- assertVisible:
    id: '${story.id}'
- takeScreenshot: '.maestro/screenshots/${story.name.replace(/ /g, '-')}'
`
  )
  .join('\n')}`;

  // Write the Maestro test file
  const maestroTestPath = join(maestroDir, 'storybook-screenshots.yaml');
  writeFileSync(maestroTestPath, maestroContent);

  console.log('Generated Maestro test file at:', maestroTestPath);
};

run()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { buildIndex } from 'storybook/internal/core-server';

const run = async () => {
  const index = await buildIndex({
    configDir: path.join(__dirname, '../.rnstorybook'),
  });

  // Ensure .maestro directory exists
  const maestroDir = path.join(__dirname, '../.maestro');
  mkdirSync(maestroDir, { recursive: true });

  // Generate Maestro test file content
  const stories = Object.values(index.entries)
    .filter((entry: any) => entry.type === 'story')
    .map((story: any) => ({
      id: story.id,
      name: story.title.replace(/\//g, '-') + ' - ' + story.name,
    }));

  const appId = 'host.exp.Exponent'; // Replace with your actual app ID if different

  const baseUri = 'exp://127.0.0.1:8081/--/'; // Replace with your actual base URI if different

  const maestroContent = `appId: ${appId}
name: Take screenshots of all Storybook stories
---
- stopApp: ${appId}

${stories
  .map(
    (story) => `# Story ${story.name}
- openLink: '${baseUri}?STORYBOOK_STORY_ID=${story.id}'
- waitForAnimationToEnd
- assertVisible:
    id: '${story.id}'
- takeScreenshot: '.maestro/screenshots/${story.name.replace(/ /g, '-')}'
`
  )
  .join('\n')}`;

  // Write the Maestro test file
  const maestroTestPath = path.join(maestroDir, 'storybook-screenshots.yaml');
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

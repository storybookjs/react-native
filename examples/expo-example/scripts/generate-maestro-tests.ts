import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Read the index.json file
const indexPath = join(__dirname, '../storybook-static/index.json');
const indexContent = readFileSync(indexPath, 'utf-8');
const index = JSON.parse(indexContent);

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

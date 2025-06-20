import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

export interface MaestroGeneratorOptions {
  index: any;
  outputDir: string;
  appId: string;
  baseUri: string;
  testName: string;
  screenshotsRelativePath?: string;
}

export async function generateMaestroTest(options: MaestroGeneratorOptions): Promise<boolean> {
  const {
    index,
    outputDir,
    appId,
    baseUri,
    testName,
    screenshotsRelativePath = 'screenshots',
  } = options;

  try {
    // Ensure output directory exists
    mkdirSync(outputDir, { recursive: true });

    // Generate Maestro test file content
    const stories = Object.values(index.entries)
      .filter((entry: any) => entry.type === 'story')
      .map((story: any) => ({
        id: story.id,
        name: story.title.replace(/\//g, '-') + ' - ' + story.name,
      }));

    if (stories.length === 0) {
      console.warn('No stories found. Make sure your Storybook config directory is correct.');
      return false;
    }

    console.log(`Found ${stories.length} stories`);

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
- takeScreenshot: '${screenshotsRelativePath}/${story.name.replace(/ /g, '-')}'
`
  )
  .join('\n')}`;

    // Write the Maestro test file
    const maestroTestPath = path.join(outputDir, `${testName}.yaml`);
    writeFileSync(maestroTestPath, maestroContent);

    console.log(`✅ Generated Maestro test file: ${maestroTestPath}`);
    return true;
  } catch (error) {
    console.error('Error generating Maestro test file:', error);
    return false;
  }
}

import { storyInstructions } from '../metro/manifest/storyInstructions';

/** Skill ids are public: agent skills and AGENTS.md sections refer to them, so treat renames as breaking. */
export const SKILL_IDS = ['ui-workflow', 'component-docs', 'write-story'] as const;
export type SkillId = (typeof SKILL_IDS)[number];

export const SKILL_DESCRIPTIONS: Record<SkillId, string> = {
  'ui-workflow':
    'The workflow for UI changes: look up components, write stories, and check them on the device.',
  'component-docs':
    "Look up the project's components with their props and usage examples, to reuse them or answer questions about them.",
  'write-story': 'How to write React Native Storybook stories.',
};

const componentDocsCommands = `\`\`\`sh
npx sb-rn docs list                        # every component, with its id
npx sb-rn docs list --withStoryIds         # ...and the ids of its stories
npx sb-rn docs show --id <id>              # props and example stories of one component
npx sb-rn docs show-story --storyId <id>   # the full code of one story
\`\`\`

- Do this before you build a new component or answer a question about props, so you reuse what exists instead of building a duplicate.
- Use only the props that \`docs show\` documents. Read the component source only when the commands return nothing relevant.
- Use only ids these commands print. Never build an id from a file name, a title or memory.
- These commands read the story files on disk. They do not need the app or the bundler running.`;

const componentDocs = `# Look up components with Storybook

${componentDocsCommands}

For a UI change, run \`npx sb-rn skills ui-workflow\` instead: it includes this lookup.
`;

const uiWorkflow = `# Storybook workflow for React Native UI changes

Follow these steps in order. Run every command from the app's directory, where its \`.rnstorybook\` folder is (pass \`--config-dir\` if the folder has another name).

## 1. Look up components first

${componentDocsCommands}

## 2. Write the component and its stories

- Write one story per state the component can reach, with realistic args.
- Run \`npx sb-rn skills write-story\` for how to write stories, and follow it.
- When you add a story file, the bundler regenerates \`storybook.requires\` if it uses \`withStorybook\`. Otherwise run \`npx sb-rn-get-stories\`.

## 3. Check the stories on the device

These commands drive the app through the Storybook channel server, so the app must be running with Storybook open and the channel server enabled (the \`websockets\` or \`experimental_mcp\` option of \`withStorybook\`).

\`\`\`sh
npx sb-rn status                                     # connected devices, current story, args, globals
npx sb-rn stories list                               # every story id
npx sb-rn stories select --storyId <id>              # show a story and wait until it has rendered
npx sb-rn args update --args '{"label":"Save"}'      # change args of the current story
npx sb-rn args reset                                 # back to the args the story defines
npx sb-rn globals update --globals '{"theme":"dark"}'
\`\`\`

- Select every story you added or changed. \`stories select\` fails with the device's error when a story throws while rendering: fix it before you move on.
- To see the result, take a screenshot with your device tool, such as agent-device, \`xcrun simctl io booted screenshot\` or \`adb exec-out screencap -p\`. \`sb-rn\` does not capture the screen.
- If \`npx sb-rn status\` cannot reach the channel server, tell the user how to enable it. Do not change their bundler config without asking.

## 4. Finish

List the stories you added or changed, with their ids, in your answer.
`;

export function getSkill(id: SkillId): string {
  switch (id) {
    case 'ui-workflow':
      return uiWorkflow;
    case 'component-docs':
      return componentDocs;
    case 'write-story':
      return storyInstructions;
  }
}

export function isSkillId(id: string): id is SkillId {
  return (SKILL_IDS as readonly string[]).includes(id);
}

export function getSkillCatalog(): string {
  return [
    '# Storybook React Native skills',
    '',
    'Print one with `npx sb-rn skills <id>`:',
    '',
    ...SKILL_IDS.map((id) => `- \`${id}\`: ${SKILL_DESCRIPTIONS[id]}`),
    '',
  ].join('\n');
}

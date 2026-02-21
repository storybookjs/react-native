import { recast } from 'storybook/internal/babel';
import { normalizeStories, loadMainConfig } from 'storybook/internal/common';
import { storyNameFromExport, toId } from 'storybook/internal/csf';
import { extractDescription, loadCsf } from 'storybook/internal/csf-tools';
import type { NormalizedStoriesSpecifier } from 'storybook/internal/types';
import { readFileSync } from 'node:fs';
import { sync as globSync } from 'glob';
import path from 'path';

import { getCodeSnippet } from './generateCodeSnippet';
import { getComponents, getImports } from './getComponentImports';
import { extractJSDocInfo } from './jsdocTags';
import type { DocObj } from './reactDocgen';
import { cachedFindUp, cachedReadFileSync, invalidateCache, invariant } from './utils';

const cwd = process.cwd();

interface Story {
  id?: string;
  name: string;
  snippet?: string;
  description?: string;
  summary?: string;
  error?: { name: string; message: string };
}

interface ComponentManifestEntry {
  id: string;
  name: string;
  path: string;
  description?: string;
  summary?: string;
  import?: string;
  stories: Story[];
  jsDocTags: Record<string, string[]>;
  reactDocgen?: DocObj;
  error?: { name: string; message: string };
}

interface ComponentsManifest {
  v: number;
  components: Record<string, ComponentManifestEntry>;
}

function ensureRelativePathHasDot(relativePath: string) {
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

function findMatchingComponent(
  components: ReturnType<typeof getComponents>,
  componentName: string | undefined,
  trimmedTitle: string
) {
  return components.find((it) =>
    componentName
      ? [it.componentName, it.localImportName, it.importName].includes(componentName)
      : trimmedTitle.includes(it.componentName) ||
        (it.localImportName && trimmedTitle.includes(it.localImportName)) ||
        (it.importName && trimmedTitle.includes(it.importName))
  );
}

function getPackageInfo(componentPath: string | undefined, fallbackPath: string) {
  const nearestPkg = cachedFindUp('package.json', {
    cwd: path.dirname(componentPath ?? fallbackPath),
  });

  try {
    return nearestPkg
      ? JSON.parse(cachedReadFileSync(nearestPkg, 'utf-8') as string).name
      : undefined;
  } catch {
    return undefined;
  }
}

export async function buildManifest({
  configPath,
}: {
  configPath: string;
}): Promise<ComponentsManifest> {
  const main = await loadMainConfig({ configDir: configPath, cwd });
  if (!main.stories || !Array.isArray(main.stories)) {
    throw new Error('No stories found');
  }

  const storiesSpecifiers = normalizeStories(main.stories, {
    configDir: configPath,
    workingDir: cwd,
  });

  invalidateCache();

  const startTime = performance.now();
  const components: Record<string, ComponentManifestEntry> = {};

  // Discover story files using same approach as buildIndex
  const specifierStoryPaths = storiesSpecifiers.map((specifier) => {
    return globSync(specifier.files, {
      cwd: path.resolve(process.cwd(), specifier.directory),
      absolute: true,
      ignore: ['**/node_modules'],
    }).map((storyPath: string) => {
      const normalizePathForWindows = (str: string) =>
        path.sep === '\\' ? str.replace(/\\/g, '/') : str;
      return normalizePathForWindows(storyPath);
    });
  });

  // Track unique component IDs (one per title prefix)
  const seenTitles = new Set<string>();

  for (let specifierIndex = 0; specifierIndex < specifierStoryPaths.length; specifierIndex++) {
    const storyPaths = specifierStoryPaths[specifierIndex];
    const specifier = storiesSpecifiers[specifierIndex];

    for (const storyPath of storyPaths) {
      try {
        const code = readFileSync(storyPath, { encoding: 'utf-8' }).toString();
        const relativePath = ensureRelativePathHasDot(path.posix.relative(cwd, storyPath));

        const makeTitle = (userTitle: string) => {
          if (userTitle) {
            return userTitle.replace('./', '');
          }
          // Auto-title from file path
          const rel = path.posix.relative(specifier.directory, relativePath);
          return rel.replace(/\.(stories|story)\.(tsx?|jsx?|mdx?)$/, '').replace(/\//g, '/');
        };

        const csf = loadCsf(code, {
          fileName: storyPath,
          makeTitle,
        }).parse();

        const { meta, stories } = csf;
        if (!stories || stories.length === 0) {
          continue;
        }

        const id = toId(meta.title, '').replace(/--$/, '');
        if (seenTitles.has(id)) {
          continue;
        }
        seenTitles.add(id);

        const componentName = (csf as any)._meta?.component;
        const title = meta.title.split('/').at(-1)!.replace(/\s+/g, '');

        const allComponents = getComponents({
          csf,
          storyFilePath: storyPath,
        });

        const component = findMatchingComponent(
          allComponents,
          componentName,
          meta.title.replace(/\s+/g, '')
        );

        const packageName = getPackageInfo(component?.path, storyPath);
        const fallbackImport =
          packageName && componentName
            ? `import { ${componentName} } from "${packageName}";`
            : '';
        const imports =
          getImports({ components: allComponents, packageName }).join('\n').trim() || fallbackImport;

        // Extract stories with snippets
        const storyEntries: Story[] = Object.entries((csf as any)._stories)
          .map(([storyExport, story]: [string, any]) => {
            try {
              const jsdocComment = extractDescription((csf as any)._storyStatements[storyExport]);
              const { tags = {}, description } = jsdocComment
                ? extractJSDocInfo(jsdocComment)
                : {};
              const finalDescription =
                (tags?.describe?.[0] || tags?.desc?.[0]) ?? description;

              return {
                id: story.id,
                name: story.name ?? storyNameFromExport(storyExport),
                snippet: recast.print(
                  getCodeSnippet(csf, storyExport, component?.componentName)
                ).code,
                description: finalDescription?.trim(),
                summary: tags.summary?.[0],
              };
            } catch (e) {
              const err = e instanceof Error ? e : new Error(String(e));
              return {
                id: story.id,
                name: story.name ?? storyNameFromExport(storyExport),
                error: { name: err.name, message: err.message },
              };
            }
          });

        // Extract component-level description
        const hasDocgen = component?.reactDocgen;
        const docgen =
          hasDocgen && hasDocgen.type === 'success' ? hasDocgen.data : undefined;

        const jsdocComment =
          extractDescription((csf as any)._metaStatement) || docgen?.description;
        const { tags = {}, description: descriptionFromJsDoc } = jsdocComment
          ? extractJSDocInfo(jsdocComment)
          : {};
        const componentDescription =
          ((tags?.describe?.[0] || tags?.desc?.[0]) ?? descriptionFromJsDoc)?.trim();

        const entry: ComponentManifestEntry = {
          id,
          name: componentName ?? title,
          path: relativePath,
          stories: storyEntries,
          import: imports,
          description: componentDescription,
          summary: tags.summary?.[0],
          jsDocTags: tags,
        };

        if (docgen) {
          entry.reactDocgen = docgen;
        } else if (!componentName) {
          entry.error = {
            name: 'No component found',
            message:
              'We could not detect the component from your story file. Specify meta.component.',
          };
        } else if (!component?.path) {
          entry.error = {
            name: 'No component import found',
            message: `No component file found for the "${componentName}" component.`,
          };
        } else if (hasDocgen && hasDocgen.type === 'error') {
          entry.error = hasDocgen.error;
        }

        components[id] = entry;
      } catch (e) {
        console.warn(`[Storybook MCP] Failed to process ${storyPath}:`, e);
      }
    }
  }

  const durationMs = Math.round(performance.now() - startTime);
  console.log(`[Storybook MCP] Generated manifest for ${Object.keys(components).length} components in ${durationMs}ms`);

  return {
    v: 0,
    components,
  };
}

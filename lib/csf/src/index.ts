import startCase from 'lodash/startCase';

// Remove punctuation https://gist.github.com/davidjrice/9d2af51100e41c6c4b4a
export const sanitize = (string: string) => {
  return (
    string
      .toLowerCase()
      // eslint-disable-next-line no-useless-escape
      .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  );
};

const sanitizeSafe = (string: string, part: string) => {
  const sanitized = sanitize(string);
  if (sanitized === '') {
    throw new Error(`Invalid ${part} '${string}', must include alphanumeric characters`);
  }
  return sanitized;
};

export const toId = (kind: string, name: string) =>
  `${sanitizeSafe(kind, 'kind')}--${sanitizeSafe(name, 'name')}`;

// Transform the CSF named export into a readable story name
export const storyNameFromExport = (key: string) => startCase(key);

type StoryDescriptor = string[] | RegExp;
export interface IncludeExcludeOptions {
  includeStories?: StoryDescriptor;
  excludeStories?: StoryDescriptor;
}

function matches(storyKey: string, arrayOrRegex?: StoryDescriptor) {
  if (Array.isArray(arrayOrRegex)) {
    return arrayOrRegex.includes(storyKey);
  }
  return storyKey.match(arrayOrRegex);
}

export function isExportStory(
  key: string,
  { includeStories, excludeStories }: IncludeExcludeOptions
) {
  return (
    // https://babeljs.io/docs/en/babel-plugin-transform-modules-commonjs
    key !== '__esModule' &&
    (!includeStories || matches(key, includeStories)) &&
    (!excludeStories || !matches(key, excludeStories))
  );
}

interface SeparatorOptions {
  rootSeparator: string | RegExp;
  groupSeparator: string | RegExp;
}

export const parseKind = (kind: string, { rootSeparator, groupSeparator }: SeparatorOptions) => {
  const [root, remainder] = kind.split(rootSeparator, 2);
  const groups = (remainder || kind).split(groupSeparator).filter(i => !!i);

  // when there's no remainder, it means the root wasn't found/split
  return {
    root: remainder ? root : null,
    groups,
  };
};

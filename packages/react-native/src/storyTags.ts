import { combineTags } from 'storybook/internal/csf';

const BuiltInTag = {
  DEV: 'dev',
  TEST: 'test',
  PLAY_FN: 'play-fn',
} as const;

const normalizeTags = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((tag): tag is string => typeof tag === 'string');
};

export const getStoryEntryTags = ({
  metaTags,
  storyTags,
  hasPlayFn = false,
}: {
  metaTags?: unknown;
  storyTags?: unknown;
  hasPlayFn?: boolean;
}) =>
  combineTags(
    BuiltInTag.DEV,
    BuiltInTag.TEST,
    ...normalizeTags(metaTags),
    ...(hasPlayFn ? [BuiltInTag.PLAY_FN] : []),
    ...normalizeTags(storyTags)
  );

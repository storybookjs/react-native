import { combineTags } from 'storybook/internal/csf';
import type { ModuleExports, Tag } from 'storybook/internal/types';

/** Stories tagged `dev` show up in the sidebar. Remove it with `!dev` to hide a story. */
const DEV_TAG = 'dev';

/** Tag added to stories that have a play function. */
export const PLAY_FN_TAG = 'play-fn';

/** The tags Storybook gives every story before the project, meta and story tags are applied. */
const DEFAULT_STORY_TAGS: Tag[] = [DEV_TAG, 'test', 'manifest'];

const toTags = (value: unknown): Tag[] =>
  Array.isArray(value) ? value.filter((tag): tag is Tag => typeof tag === 'string') : [];

/**
 * Reads the `tags` of the project annotations (for example `.rnstorybook/preview.tsx`), in the
 * same order Storybook composes them.
 */
export function getProjectTags(annotations: ModuleExports[]): Tag[] {
  return annotations.flatMap((moduleExports) =>
    toTags(moduleExports?.default?.tags ?? moduleExports?.tags)
  );
}

/**
 * Combines the tags of a story index entry the same way Storybook does for the web: the default
 * tags, then the project, meta and story tags, where `!tag` removes a tag added before it.
 */
export function combineStoryTags({
  projectTags,
  metaTags,
  storyTags,
}: {
  projectTags?: unknown;
  metaTags?: unknown;
  storyTags?: unknown;
}): Tag[] {
  return combineTags(
    ...DEFAULT_STORY_TAGS,
    ...toTags(projectTags),
    ...toTags(metaTags),
    ...toTags(storyTags)
  );
}

/** Whether an index entry is listed in the sidebar, which matches the `dev` tag like on the web. */
export function isShownInSidebar(entry: { tags?: Tag[] }): boolean {
  return !!entry.tags?.includes(DEV_TAG);
}

/** Hides index entries without the `dev` tag from the sidebar, like Storybook's static filter. */
export const SIDEBAR_FILTERS = { 'static-filter': isShownInSidebar };

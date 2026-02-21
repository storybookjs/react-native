import { parse } from 'comment-parser';

interface Tag {
  tag: string;
  name: string;
  type: string;
  description: string;
}

function groupByTag(tags: Tag[]): Record<string, Tag[]> {
  const result: Record<string, Tag[]> = {};
  for (const tag of tags) {
    (result[tag.tag] ??= []).push(tag);
  }
  return result;
}

export function extractJSDocInfo(jsdocComment: string) {
  const lines = jsdocComment.split('\n');
  const jsDoc = ['/**', ...lines.map((line) => ` * ${line}`), ' */'].join('\n');

  const parsed = parse(jsDoc);
  const grouped = groupByTag(parsed[0].tags);

  return {
    description: parsed[0].description,
    tags: Object.fromEntries(
      Object.entries(grouped).map(([key, tags]) => [
        key,
        tags.map((tag) => (tag.type ? `{${tag.type}} ` : '') + `${tag.name} ${tag.description}`),
      ])
    ),
  };
}

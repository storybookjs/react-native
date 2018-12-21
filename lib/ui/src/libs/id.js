// NOTE: this file is common to both `lib/ui` (manager) and `lib/core` (preview).
// For now it is reproduced in both places (ick) rather than create a new package.
// We should figure out what we are doing here.

// Create a id/slug compatible string from an arbitrary string. We:
//   1. replace all non-alphanumerics with '-', and downcase.
//   2. replace all runs of '-' with a single '-',
//        except if they are at the end, in which case, replace them with ''

function sanitize(string) {
  return string
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function sanitizeSafe(string, part) {
  const sanitized = sanitize(string);
  if (sanitized === '') {
    throw new Error(`Invalid ${part} '${string}', must include alphanumeric characters`);
  }
  return sanitized;
}

export default function toId(kind, story) {
  return `${sanitizeSafe(kind, 'kind')}--${sanitizeSafe(story, 'story')}`;
}

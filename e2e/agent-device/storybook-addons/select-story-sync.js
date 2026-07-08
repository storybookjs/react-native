/* eslint-disable no-undef */
const storyId = STORY_ID;
const host = typeof STORYBOOK_HOST === 'undefined' ? 'localhost' : STORYBOOK_HOST;
const port = typeof STORYBOOK_PORT === 'undefined' ? '7007' : STORYBOOK_PORT;
const endpoint = `http://${host}:${port}/select-story-sync/${storyId}`;

const response = http.post(endpoint, '');

if (!(response.status >= 200 && response.status < 300)) {
  throw new Error(`Failed to select story "${storyId}" (status ${response.status})`);
}

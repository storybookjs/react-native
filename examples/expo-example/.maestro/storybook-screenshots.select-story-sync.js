const storyId = STORY_ID;
const endpoint = `http://localhost:7007/select-story-sync/${storyId}`;
const response = http.request(endpoint, {
  method: 'POST',
  body: '',
});

if (!(response.status >= 200 && response.status < 300)) {
  throw new Error(`Failed to select story "${storyId}" (status ${response.status})`);
}

import { URL } from 'url';

export const constructUrl = (storybookUrl, kind, story) => {
  const encodedKind = encodeURIComponent(kind);
  const encodedStoryName = encodeURIComponent(story);
  const storyUrl = `/iframe.html?selectedKind=${encodedKind}&selectedStory=${encodedStoryName}`;
  const { protocol, host, pathname, search } = new URL(storybookUrl);
  const pname = pathname.replace(/\/$/, ''); // removes trailing /
  const query = search.replace('?', '&'); // convert leading ? to &
  return `${protocol}//${host}${pname}${storyUrl}${query}`;
};

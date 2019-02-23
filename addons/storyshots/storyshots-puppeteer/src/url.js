import { toId } from '@storybook/router/utils';

import { URL } from 'url';

export const constructUrl = (storybookUrl, kind, story) => {
  const id = toId(kind, story);

  const storyUrl = `/iframe.html?id=${id}`;
  const { protocol, host, pathname, search } = new URL(storybookUrl);
  const pname = pathname.replace(/\/$/, ''); // removes trailing /
  const query = search.replace('?', '&'); // convert leading ? to &
  return `${protocol}//${host}${pname}${storyUrl}${query}`;
};

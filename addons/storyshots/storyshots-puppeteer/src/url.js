import { toId } from '@storybook/core/client';

import { URL } from 'url';

export const constructUrl = (storybookUrl, kind, story) => {
  const id = toId(kind, story);

  const storyUrl = `/iframe.html?id=${id}`;
  const { protocol, host, pathname } = new URL(storybookUrl);
  const pname = pathname.replace(/\/$/, ''); // removes trailing /
  return `${protocol}//${host}${pname}${storyUrl}`;
};

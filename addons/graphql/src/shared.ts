import { fetch } from 'global';

import { FetcherParams } from './preview';

const FETCH_OPTIONS = {
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
};

export const getDefaultFetcher = (url: string) => {
  return (params: FetcherParams) => {
    const body = JSON.stringify(params);
    const options = { body, ...FETCH_OPTIONS };
    return fetch(url, options).then((res: any) => res.json());
  };
};

export const reIndentQuery = (query: string) => {
  const lines = query.trim().split('\n');
  const spaces = lines[lines.length - 1].length - 1;
  return lines.map((l, i) => (i === 0 ? l : l.slice(spaces))).join('\n');
};

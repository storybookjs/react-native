import { document, history } from 'global';
import qs from 'qs';

import { makeDecorator, StoryContext, StoryGetter } from '@storybook/addons';

import { PARAM_KEY } from './constants';

export const withQuery = makeDecorator({
  name: 'withQuery',
  parameterName: PARAM_KEY,
  wrapper: (getStory: StoryGetter, context: StoryContext, { parameters }) => {
    const { location } = document;
    const currentQuery = qs.parse(location.search, { ignoreQueryPrefix: true });
    const additionalQuery =
      typeof parameters === 'string'
        ? qs.parse(parameters, { ignoreQueryPrefix: true })
        : parameters;

    const newQuery = qs.stringify({ ...currentQuery, ...additionalQuery });
    const newLocation = location.href.replace(location.search, `?${newQuery}`);

    history.replaceState({}, document.title, newLocation);

    return getStory(context);
  },
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

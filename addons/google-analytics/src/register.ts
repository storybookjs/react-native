import { window } from 'global';
import { addons } from '@storybook/addons';
import { STORY_CHANGED, STORY_ERRORED, STORY_MISSING } from '@storybook/core-events';

import ReactGA from 'react-ga';

addons.register('storybook/google-analytics', api => {
  ReactGA.initialize(window.STORYBOOK_GA_ID, window.STORYBOOK_REACT_GA_OPTIONS);

  api.on(STORY_CHANGED, () => {
    const { path } = api.getUrlState();
    ReactGA.pageview(path);
  });
  api.on(STORY_ERRORED, ({ description }: { description: string }) => {
    ReactGA.exception({
      description,
      fatal: true,
    });
  });
  api.on(STORY_MISSING, (id: string) => {
    ReactGA.exception({
      description: `attempted to render ${id}, but it is missing`,
      fatal: false,
    });
  });
});

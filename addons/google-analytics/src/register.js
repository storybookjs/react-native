import addons from '@storybook/addons';
import { window } from 'global';
import ReactGA from 'react-ga';

addons.register('storybook/google-analytics', api => {
  ReactGA.initialize(window.STORYBOOK_GA_ID);

  api.onStory((kind, story) => {
    let path = window.location.pathname;

    if (path === '/') {
      path = '';
    }

    ReactGA.pageview(`${path}/${kind}/${story}`);
  });
});

import React, { Fragment } from 'react';
import AboutPage from './about';
import ShortcutsPage from './shortcuts';

const SettingsPages = () => (
  <Fragment>
    <AboutPage key="about" />
    <ShortcutsPage key="shortcuts" />
  </Fragment>
);

export { SettingsPages as default };

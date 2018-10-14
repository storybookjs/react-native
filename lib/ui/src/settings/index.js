import React from 'react';
import AboutPage from './about';
import ShortcutsPage from './shortcuts';

const SettingsPages = () => [<AboutPage key="about" />, <ShortcutsPage key="shortcuts" />];

export { SettingsPages as default };

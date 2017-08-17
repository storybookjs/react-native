import React from 'react';
import addons from '@storybook/addons';

import { Panel } from './components/Panel';

const ADDON_ID = 'storybook-addon-viewport';
const PANEL_ID = `${ADDON_ID}/addon-panel`;
const EVENT_ID = `${ADDON_ID}/addon-event`;

function init() {
    addons.register(ADDON_ID, api => {
        const channel = addons.getChannel();

        addons.addPanel(PANEL_ID, {
            title: 'Viewport',
            render() {
                return <Panel channel={channel} api={api} />;
            }
        });
    });
}

export { init }

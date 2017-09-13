import { defineTest } from 'jscodeshift/dist/testUtils';

defineTest(__dirname, 'move-buildin-addons', null, 'move-buildin-addons/default');
defineTest(__dirname, 'move-buildin-addons', null, 'move-buildin-addons/with-no-change');

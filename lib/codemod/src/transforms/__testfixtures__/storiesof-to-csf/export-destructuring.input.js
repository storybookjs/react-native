/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ComponentRow, { PureComponentRow } from './ComponentRow';
import * as SpecRowStories from './SpecRow.stories';
import Table from '../../components/Table';

const specNames = ['Default', 'Low data', 'empty', 'something', 'extra one'];

export const { actions } = SpecRowStories;

storiesOf('Webapp screens/Build/ComponentRow', module).add('pending', () => (
  <ComponentRow snapshots={snapshots.pending} buildNumber={2} {...actions} />
));

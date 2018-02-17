import React from 'react';
import { values } from 'lodash';

import Examples from '../../components/Grid/Examples';
import examples from './_examples.yml';

const examplesArray = values(examples).map(example => ({
  ...example,
  // eslint-disable-next-line import/no-dynamic-require, global-require
  thumbnailSrc: require(`./thumbnails/${example.thumbnail}`),
}));

export default () => <Examples items={examplesArray} />;

import React from 'react';
import Examples from 'components/Grid/Examples';
import { values } from 'lodash';

import data from './_examples.yml';

export default () => <Examples items={values(data)} />;

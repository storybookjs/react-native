import React from 'react';
import { values } from 'lodash-es';

import Examples from '../../components/Grid/Examples';
import data from './_examples.yml';

export default () => <Examples items={values(data)} />;

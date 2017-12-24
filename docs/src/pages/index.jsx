import React from 'react';
import { values } from 'lodash-es';
import Homepage from '../components/Homepage';
import users from './_users.yml';

export default () => <Homepage users={values(users)} />;

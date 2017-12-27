import React from 'react';
import { values } from 'lodash';
import Homepage from '../components/Homepage';
import users from './_users.yml';

const usersArray = values(users).map(user => ({
  ...user,
  // eslint-disable-next-line import/no-dynamic-require, global-require
  logoSrc: require(`./logos/${user.logo}`),
}));

export default () => <Homepage users={usersArray} />;

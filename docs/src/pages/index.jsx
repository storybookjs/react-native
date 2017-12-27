import React from 'react';
import { values } from 'lodash';
import Homepage from '../components/Homepage';
import users from './_users.yml';

const usersArray = values(users);
usersArray.forEach(user => {
  user.logoSrc = require(`./logos/${user.logo}`);
});

export default () => <Homepage users={values(users)} />;

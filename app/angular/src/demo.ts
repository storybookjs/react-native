/* eslint-disable global-require */
module.exports = {
  Welcome: require('../dist/demo/welcome.component').default,
  Button: require('../dist/demo/button.component').default,
};

export { WelcomeComponent as Welcome } from './demo/welcome.component';
export { ButtonComponent as Button } from './demo/button.component';

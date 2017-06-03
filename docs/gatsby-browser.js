const global = require('global');

const document = global;

exports.onRouteUpdate = location => {
  if (location.hash) {
    setTimeout(() => {
      document.querySelector(`${location.hash}`).scrollIntoView();
    }, 0);
  }
};

import merge from '../libs/merge';

const initial = {
  customQueryParams: {},
  storiesConfigured: false,
};

// Returns the initialState of the app
export default (...additions) => additions.reduce((acc, item) => merge(acc, item), initial);

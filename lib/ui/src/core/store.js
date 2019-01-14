// simple store implementation
const createStore = initialState => {
  let state = initialState;
  const listeners = [];

  function notify() {
    listeners.forEach(l => l());
  }

  function setState(patch) {
    if (typeof patch === 'function') {
      state = { ...state, ...patch(state) };
    } else {
      state = { ...state, ...patch };
    }
    notify();
  }

  return {
    getState() {
      return state;
    },
    setState,
    subscribe(listener) {
      listeners.push(listener);
      return function unsubscribe(l) {
        listeners.splice(listeners.indexOf(l), 1);
      };
    },
  };
};

export default createStore;

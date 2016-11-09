export default function getReduxLoader(fn) {
  return (props, onData, env) => {
    const { reduxStore } = env.context();

    const processState = () => {
      try {
        const state = reduxStore.getState();
        const data = fn(state, props, env);
        onData(null, data);
      } catch (ex) {
        onData(ex);
      }
    };

    processState();
    reduxStore.subscribe(processState);
  };
}

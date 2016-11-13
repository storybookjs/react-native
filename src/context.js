export default function (reduxStore, clientStore, domNode, provider) {
  return {
    reduxStore,
    clientStore,
    domNode,
    provider,
  };
}

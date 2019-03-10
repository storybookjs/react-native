export default ({ provider, api }) => {
  const providerAPI = {
    ...api,
  };

  provider.handleAPI(providerAPI);

  return providerAPI;
};

export default ({ provider, api }) => {
  const providerAPI = {
    ...api,
  };

  provider.handleAPI(providerAPI);

  if (provider.renderPreview) {
    providerAPI.renderPreview = provider.renderPreview;
  }

  return providerAPI;
};

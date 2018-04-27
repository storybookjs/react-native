export const config = {
  depth: 10,
  clearOnStoryChange: true,
  limit: 50,
};

export function configureActions(options = {}) {
  Object.assign(config, options);
}

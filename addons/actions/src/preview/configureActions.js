export const config = {
  depth: 10,
  clearOnStoryChange: true,
};

export function configureActions(options = {}) {
  Object.assign(config, options);
}

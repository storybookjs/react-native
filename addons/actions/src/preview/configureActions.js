export const config = {
  depth: 10,
};

export function configureActions(options = {}) {
  Object.assign(config, options);
}

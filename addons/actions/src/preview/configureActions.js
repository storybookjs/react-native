export const config = {
  depth: 10,
  clearActionLogger: false,
};

export function configureActions(options = {}) {
  Object.assign(config, options);
}

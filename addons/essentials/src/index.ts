type PresetOptions = {
  actions?: any;
  backgrounds?: any;
  docs?: any;
  knobs?: any;
  links?: any;
  viewport?: any;
};

export const presets = (options: PresetOptions = {}) => {
  const presetAddons = ['docs', 'knobs']
    .filter(addon => (options as any)[addon] !== null)
    .map(addon => ({
      name: `@storybook/addon-${addon}/preset`,
      options: (options as any)[addon] || {},
    }));
  return presetAddons;
};

export function addons(entry: any[] = [], options: PresetOptions = {}) {
  const registerAddons = ['actions', 'backgrounds', 'links', 'viewport']
    .filter(addon => (options as any)[addon] !== null)
    .map(addon => `@storybook/addon-${addon}/register`);
  return [...entry, ...registerAddons];
}

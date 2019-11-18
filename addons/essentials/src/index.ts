export const presets = () => ['@storybook/addon-docs/preset'];

export function addons(entry: any[] = [], options: any) {
  return [...entry, '@storybook/addon-actions/register'];
}

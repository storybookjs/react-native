type KnobsOptions = {
  addDecorator?: boolean;
};

export function managerEntries(entry: any[] = [], options: any) {
  return [...entry, require.resolve('../register')];
}

export function config(entry: any[] = [], { addDecorator = true }: KnobsOptions = {}) {
  const knobsConfig = [];
  if (addDecorator) {
    knobsConfig.push(require.resolve('./addDecorator'));
  }
  return [...entry, ...knobsConfig];
}

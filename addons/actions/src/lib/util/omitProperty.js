export default function omitProperty(name) {
  return name.startsWith('__') || name.startsWith('STORYBOOK_');
}

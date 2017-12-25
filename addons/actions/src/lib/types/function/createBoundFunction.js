import createFunction from './createFunction';

export default function createBoundFunction(name) {
  return createFunction(name).bind({});
}

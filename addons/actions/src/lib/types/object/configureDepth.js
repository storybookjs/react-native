export const DEPTH_KEY = '$___storybook.depthKey';

export default function configureDepth(obj, value) {
  if (value && value.preventDefault !== undefined) {
    obj[DEPTH_KEY] = 0; // eslint-disable-line no-param-reassign
  }
  return obj;
}

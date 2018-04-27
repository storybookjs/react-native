export const DEPTH_KEY = '$___storybook.depthKey';

export default function configureDepth(obj, depth = 0) {
  obj[DEPTH_KEY] = depth; // eslint-disable-line no-param-reassign

  return obj;
}

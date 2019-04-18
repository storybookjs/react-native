import { GetContextNodes, GetMergedSettings } from '../../@types';

/**
 * @private
 * Merges the top-level (global options) and the story-level (parameters) from a pair of setting;
 *
 * @return the normalized definition for a contextual environment (-> node).
 */
export const _getMergedSettings: GetMergedSettings = (topLevel, storyLevel) => ({
  nodeId: topLevel.title || storyLevel.title || '',
  icon: topLevel.icon || storyLevel.icon || '',
  title: topLevel.title || storyLevel.title || '',
  components: topLevel.components || storyLevel.components || [],
  params:
    topLevel.params || storyLevel.params
      ? Array()
          .concat(topLevel.params, storyLevel.params)
          .filter(Boolean)
      : [{ name: '', props: {} }],
  options: {
    deep: false,
    disable: false,
    cancelable: false,
    ...topLevel.options,
    ...storyLevel.options,
  },
});

/**
 * @nosideeffects
 * pairs up settings for merging normalizations to produce the contextual definitions (-> nodes);
 * it guarantee the adding order can be respected but not duplicated.
 */
export const getContextNodes: GetContextNodes = ({ options, parameters }) => {
  const titles = Array()
    .concat(options, parameters)
    .map(({ title } = {}) => title);
  return Array.from(new Set(titles))
    .filter(Boolean)
    .map(title =>
      _getMergedSettings(
        (options && options.find(option => option.title === title)) || {},
        (parameters && parameters.find(param => param.title === title)) || {}
      )
    );
};

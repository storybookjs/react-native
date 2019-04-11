import { GetContextNodes, GetMergedSettings } from '../../@types';

/**
 * @private
 * Merges the global (options) and the story (parameters) from a pair of setting;
 * @return the normalized definition for a contextual environment (-> node).
 */
export const _getMergedSettings: GetMergedSettings = (
  { icon, title, components = [], params = [], options = {} },
  { params: storyParams = [], options: storyOptions = {}, ...story }
) => ({
  nodeId: title || story.title || '',
  icon: icon || story.icon || '',
  title: title || story.title || '',
  components: components,
  params: !!(params.length || storyParams.length)
    ? params.concat(storyParams)
    : [{ name: '', props: {} }],
  options: Object.assign(
    {
      deep: false,
      disable: false,
      cancelable: false,
    },
    options,
    storyOptions
  ),
});

/**
 * pairs up settings for merging normalizations to produce the contextual definitions (-> nodes);
 * it guarantee the adding order can be respected but not duplicated.
 */
export const getContextNodes: GetContextNodes = ({ options, parameters }) => {
  const titles = Array()
    .concat(options, parameters)
    .map(({ title } = {}) => title);
  return Array.from(new Set(titles))
    .filter(Boolean)
    .map((title) =>
      _getMergedSettings(
        (options && options.find((option) => option.title === title)) || {},
        (parameters && parameters.find((param) => param.title === title)) || {}
      )
    );
};

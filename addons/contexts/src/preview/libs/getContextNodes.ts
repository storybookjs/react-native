import { AddonSetting, ContextNode, WrapperSettings } from '../../types';

/**
 * @private
 * Merge the top-level (global options) and the story-level (parameters) from a pair of setting;
 * @return the normalized definition for a contextual environment (i.e. a contextNode).
 */
type GetMergedSettings = (
  topLevel: Partial<AddonSetting>,
  storyLevel: Partial<AddonSetting>
) => ContextNode;

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
 * Pair up settings for merging normalizations to produce the contextual definitions (i.e. contextNodes);
 * it guarantee the adding order can be respected but not duplicated.
 */
type GetContextNodes = (settings: WrapperSettings) => ContextNode[];

export const getContextNodes: GetContextNodes = ({ options, parameters }) => {
  const titles = Array()
    .concat(options, parameters)
    .filter(Boolean)
    .map(({ title }) => title);

  return Array.from(new Set(titles))
    .filter(Boolean)
    .map(title =>
      _getMergedSettings(
        (options && options.find(option => option.title === title)) || {},
        (parameters && parameters.find(param => param.title === title)) || {}
      )
    );
};

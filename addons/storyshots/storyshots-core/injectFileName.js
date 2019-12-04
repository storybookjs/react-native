const { ScriptTransformer } = require('@jest/transform');

const getNextTransformer = (fileName, config) => {
  const self = config.transform.find(([pattern]) => new RegExp(pattern).test(fileName));
  return new ScriptTransformer({
    ...config,
    transform: config.transform.filter(entry => entry !== self),
  });
};

module.exports = {
  process(src, fileName, config, { instrument }) {
    const transformer = getNextTransformer(fileName, config);
    const { code } = transformer.transformSource(fileName, src, instrument);

    return `${code};
if(exports.default != null) {
  exports.default.parameters = exports.default.parameters || {};
  exports.default.parameters.fileName = '${fileName.replace(/\\/g, '\\\\')}';
}
`;
  },
};

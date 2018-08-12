import path from 'path';
import serverRequire from './serverRequire';

const webpackConfigs = ['webpack.config', 'webpackfile'];

export default configDir =>
  serverRequire(webpackConfigs.map(configName => path.resolve(configDir, configName)));

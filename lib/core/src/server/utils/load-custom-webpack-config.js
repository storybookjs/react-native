import path from 'path';
import serverRequire from './server-require';

const webpackConfigs = ['webpack.config', 'webpackfile'];

export default configDir =>
  serverRequire(webpackConfigs.map(configName => path.resolve(configDir, configName)));

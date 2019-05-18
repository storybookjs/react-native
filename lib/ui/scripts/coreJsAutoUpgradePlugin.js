import { NormalModuleReplacementPlugin } from 'webpack';

const rewriteAndPreservePrefix = (originalRequest, newPath, newModuleName = 'core-js') => {
  const result = originalRequest.match(/(.*\/)core-js\/.*/);
  const requestPrefix = result ? result[1] : '';

  return `${requestPrefix}${newModuleName}/${newPath}`;
};

export const upgradeCoreJsRequest = originalRequest => {
  if (/core-js\/modules\/(.*)/.test(originalRequest)) {
    const modulesInformations = originalRequest.match(/core-js\/modules\/es(6|7)\.(.*)/);
    const esVersion = modulesInformations[1];
    const originalPath = modulesInformations[2];

    if (esVersion === '6') {
      return rewriteAndPreservePrefix(originalRequest, `modules/es.${originalPath}`);
    }
    if (esVersion === '7') {
      return rewriteAndPreservePrefix(originalRequest, `modules/esnext.${originalPath}`);
    }
  }

  if (/core-js\/library\/fn\/(.*)/.test(originalRequest)) {
    const modulesInformations = originalRequest.match(/core-js\/library\/fn\/(.*)/);
    const originalPath = modulesInformations[1];

    return rewriteAndPreservePrefix(originalRequest, `features/${originalPath}`, 'core-js-pure');
  }

  if (/core-js\/es(5|6|7)(.*)/.test(originalRequest)) {
    const modulesInformations = originalRequest.match(/core-js\/es(5|6|7)(.*)?/);
    const esVersion = modulesInformations[1];
    const originalPath = modulesInformations[2];

    if (esVersion === '5') {
      return null;
    }
    if (esVersion === '6') {
      const asAModule = originalPath.replace('.js', '');

      return rewriteAndPreservePrefix(originalRequest, `es${asAModule}`);
    }
    if (esVersion === '7') {
      return null;
    }
  }

  if (/core-js\/(object)\/(.*)/.test(originalRequest)) {
    const modulesInformations = originalRequest.match(/core-js\/(.*)?/);
    const originalPath = modulesInformations[1];

    return rewriteAndPreservePrefix(originalRequest, `features/${originalPath}`);
  }

  return originalRequest;
};

export default require =>
  new NormalModuleReplacementPlugin(/core-js/, resource => {
    const originalRequest = resource.request;
    if (originalRequest.startsWith('./') || originalRequest.startsWith('../')) {
      return;
    }

    try {
      require.resolve(originalRequest);
    } catch (originalError) {
      const newRequest = upgradeCoreJsRequest(originalRequest);
      if (!newRequest) {
        throw originalError;
      }

      try {
        // eslint-disable-next-line no-param-reassign
        resource.request = require.resolve(newRequest);
      } catch (newRequestError) {
        throw originalError;
      }
    }
  });

const path = require('path');
const fs = require('fs');
const { generate } = require('../scripts/generate');

let alreadyReplaced = false;

module.exports = (config, { configPath, enabled }) => {
  if (!enabled) {
    return config;
  }

  generate({
    configPath: configPath ?? path.resolve(process.cwd(), './.storybook'),
  });

  return {
    ...config,
    transformer: {
      ...config.transformer,
      unstable_allowRequireContext: true,
    },
    resolver: {
      ...config.resolver,
      unstable_enablePackageExports: true,
      resolveRequest: (context, moduleName, platform) => {
        const defaultResolveResult = context.resolveRequest(context, moduleName, platform);

        // workaround for template files with invalid imports
        if (defaultResolveResult?.filePath?.includes?.('@storybook/react/template/cli')) {
          return {
            type: 'empty',
          };
        }

        // workaround for unsupported regex
        if (defaultResolveResult?.filePath?.includes?.('@storybook/core/dist/docs-tools/index')) {
          if (!alreadyReplaced) {
            const filepath = path.resolve(defaultResolveResult?.filePath);

            const input = fs.readFileSync(filepath, 'utf-8');

            const output = input.replace(/new RegExp\(([^)]+).*, "u"\)/g, 'new RegExp("")');

            fs.writeFileSync(filepath, output);
            alreadyReplaced = true;
          }
        }

        return defaultResolveResult;
      },
    },
  };
};

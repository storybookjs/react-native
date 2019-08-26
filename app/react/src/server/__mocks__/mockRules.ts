export default [
  { parser: { requireEnsure: false } },
  {
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    enforce: 'pre',
    use: [
      {
        options: {
          formatter: '/mock_folder/node_modules/react-dev-utils/eslintFormatter.js',
          eslintPath: '/mock_folder/node_modules/eslint/lib/api.js',
          baseConfig: {
            extends: ['/mock_folder/node_modules/eslint-config-react-app/index.js'],
          },
          ignore: false,
          useEslintrc: false,
        },
        loader: '/mock_folder/node_modules/eslint-loader/index.js',
      },
    ],
    include: '/mock_folder/src',
  },
  {
    oneOf: [
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: '/mock_folder/node_modules/url-loader/dist/cjs.js',
        options: { limit: 10000, name: 'static/media/[name].[hash:8].[ext]' },
      },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: '/mock_folder/src',
        loader: '/mock_folder/node_modules/babel-loader/lib/index.js',
        options: {
          customize: '/mock_folder/node_modules/babel-preset-react-app/webpack-overrides.js',
          babelrc: false,
          configFile: false,
          presets: ['/mock_folder/node_modules/babel-preset-react-app/index.js'],
          cacheIdentifier:
            'development:babel-plugin-named-asset-import@0.2.3:babel-preset-react-app@6.1.0:react-dev-utils@6.1.1:react-scripts@',
          plugins: [
            [
              '/mock_folder/node_modules/babel-plugin-named-asset-import/index.js',
              {
                loaderMap: {
                  svg: {
                    ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                  },
                },
              },
            ],
          ],
          cacheDirectory: true,
          cacheCompression: false,
          compact: false,
        },
      },
      {
        test: /\.(js|mjs)$/,
        exclude: {},
        loader: '/mock_folder/node_modules/babel-loader/lib/index.js',
        options: {
          babelrc: false,
          configFile: false,
          compact: false,
          presets: [
            ['/mock_folder/node_modules/babel-preset-react-app/dependencies.js', { helpers: true }],
          ],
          cacheDirectory: true,
          cacheCompression: false,
          cacheIdentifier:
            'development:babel-plugin-named-asset-import@0.2.3:babel-preset-react-app@6.1.0:react-dev-utils@6.1.1:react-scripts@',
          sourceMaps: false,
        },
      },
      {
        test: /\.css$/,
        exclude: {},
        use: [
          '/mock_folder/node_modules/bmr-react-scripts/node_modules/style-loader/index.js',
          {
            loader: '/mock_folder/node_modules/bmr-react-scripts/node_modules/css-loader/index.js',
            options: { importLoaders: 1, sourceMap: false },
          },
          {
            loader: '/mock_folder/node_modules/postcss-loader/src/index.js',
            options: { ident: 'postcss', sourceMap: false },
          },
        ],
        sideEffects: true,
      },
      {
        test: /\.module\.css$/,
        use: [
          '/mock_folder/node_modules/bmr-react-scripts/node_modules/style-loader/index.js',
          {
            loader: '/mock_folder/node_modules/bmr-react-scripts/node_modules/css-loader/index.js',
            options: { importLoaders: 1, sourceMap: false, modules: true },
          },
          {
            loader: '/mock_folder/node_modules/postcss-loader/src/index.js',
            options: { ident: 'postcss', sourceMap: false },
          },
        ],
      },
      {
        test: /\.(scss|sass)$/,
        exclude: {},
        use: [
          '/mock_folder/node_modules/bmr-react-scripts/node_modules/style-loader/index.js',
          {
            loader: '/mock_folder/node_modules/bmr-react-scripts/node_modules/css-loader/index.js',
            options: { importLoaders: 2, sourceMap: false },
          },
          {
            loader: '/mock_folder/node_modules/postcss-loader/src/index.js',
            options: { ident: 'postcss', sourceMap: false },
          },
          {
            loader: '/mock_folder/node_modules/sass-loader/lib/loader.js',
            options: { sourceMap: false },
          },
        ],
        sideEffects: true,
      },
      {
        test: /\.module\.(scss|sass)$/,
        use: [
          '/mock_folder/node_modules/bmr-react-scripts/node_modules/style-loader/index.js',
          {
            loader: '/mock_folder/node_modules/bmr-react-scripts/node_modules/css-loader/index.js',
            options: { importLoaders: 2, sourceMap: false, modules: true },
          },
          {
            loader: '/mock_folder/node_modules/postcss-loader/src/index.js',
            options: { ident: 'postcss', sourceMap: false },
          },
          {
            loader: '/mock_folder/node_modules/sass-loader/lib/loader.js',
            options: { sourceMap: false },
          },
        ],
      },
      {
        loader: '/mock_folder/node_modules/file-loader/dist/cjs.js',
        exclude: [{}, {}, {}],
        options: { name: 'static/media/[name].[hash:8].[ext]' },
      },
    ],
  },
];

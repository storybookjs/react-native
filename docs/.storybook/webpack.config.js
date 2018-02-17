const config = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.yml$/,
        use: ['json-loader', 'yaml-loader'],
      },
      {
        test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
        use: ['file-loader'],
      },
    ],
  },
};

module.exports = config;

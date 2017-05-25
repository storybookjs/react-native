const path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css',
        include: path.resolve(__dirname, '../'),
      },
      {
        test: /\.yml$/,
        loader: 'json!yaml',
        include: path.resolve(__dirname, '../')
      },
      {
        test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
        loader: 'file',
        include: path.resolve(__dirname, '../'),
      },
    ]
  }
};

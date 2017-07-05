const path = require("path");
const include = path.resolve(__dirname, '../');

module.exports = {
  module: {
    rules: [
      { test: /\.css?$/, loaders: ['style', 'raw'], include },
      { test: /\.json?$/, loaders: ['json'], include },
      { test: /\.js$/, loader: "babel-loader", include }
    ]
  },
  externals: {
    "jsdom": "window",
    "cheerio": "window",
    "react/lib/ExecutionEnvironment": true,
    "react/lib/ReactContext": "window",
    "react/addons": true,
  }
};

class BaseTestPlugin1 {}
class BaseTestPlugin2 {}

export default {
  devtool: 'cheap-eval-source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      baseAlias: 'base-alias',
    },
    modules: [],
  },
  module: {
    noParse: /jquery/,
    rules: [
      {
        test: /\.js$/,
        include: 'app/baseSrc',
        loader: 'babel-loader',
        options: {},
      },
    ],
  },
  plugins: [new BaseTestPlugin1(), new BaseTestPlugin2()],
};

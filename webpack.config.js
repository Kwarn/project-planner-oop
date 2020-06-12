const path = require('path');
const CleanPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: './src/app.js',
  mode: 'development',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'assets', 'scripts'),
    publicPath: 'assets/scripts/',
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new CleanPlugin.CleanWebpackPlugin()
  ]
};


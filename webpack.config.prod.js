const path = require('path');
const CleanPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: './src/app.js',
  mode: 'production',
  output: {
    filename: '[contenthash].app.js',
    path: path.resolve(__dirname, 'assets', 'scripts'),
    publicPath: 'assets/scripts/',
  },
  devtool: 'cheap-source-map',
  plugins: [
    new CleanPlugin.CleanWebpackPlugin()
  ]
};


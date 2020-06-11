const path = require('path');
module.exports = {
  entry: './src/app.js',
  mode: 'production',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'assets', 'scripts'),
    publicPath: 'assets/scripts/',
  },
  devtool: 'cheap-source-map',
};


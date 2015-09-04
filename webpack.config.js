var path = require('path');
var merge = require('webpack-merge');
var webpack = require('webpack');

var TARGET = process.env.npm_lifecycle_event;
var ROOT_PATH = path.resolve(__dirname);

var common = {

  entry: [path.resolve(ROOT_PATH, 'app/main')],

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  output: {
    path: path.resolve(ROOT_PATH, 'build'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: path.resolve(ROOT_PATH, 'app')
      },

      {
        test: /\.css$/,
        loaders: ['style', 'css']
      }
    ]
  }
};

if (TARGET === 'start') {
  module.exports = merge(common, {
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      quiet: false,
      inline: false,
      progress: true,
      host: "0.0.0.0",
      watchOptions: {
        aggregateTimeout: 300,
        poll: 500
      }
    }
  });
} else {
  module.exports = common;
}

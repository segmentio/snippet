const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      index: './src/index.js',
    },
    devtool: 'inline-source-map',
    devServer: {
      static: path.resolve(__dirname),
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Development',
      }),
      new webpack.DefinePlugin({
        'process.env': {
          WRITE_KEY: JSON.stringify(process.env.WRITE_KEY),
          WORKSPACE_ID: JSON.stringify(process.env.WORKSPACE_ID),
          ALIAS_NAME: JSON.stringify(process.env.ALIAS_NAME),
          HOST: JSON.stringify(process.env.HOST),
          AJS_PATH: JSON.stringify(process.env.HOST),
        }
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
  }
};

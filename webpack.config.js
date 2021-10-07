const path = require('path');
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!phaser-webpack-loader)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg|ogg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true,
            },
          },
        ],
      },
      { test: /\.xml$/, loader: 'xml-loader' } // will load all .xml files with xml-loader by default
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new webpack.DefinePlugin({
      'CANVAS_RENDERER': JSON.stringify(true),
      'WEBGL_RENDERER': JSON.stringify(true)
    })
  ],
  resolve: {
    alias: {
      assets: path.join(__dirname, './src/assets'),
    },
  },
};

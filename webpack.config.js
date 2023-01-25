const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();

const {
  HOST_SERVER,
  HOST_PORT,
  BACKEND_API_KEY,
  GOOGLE_CLIENT_ID,
  FILE_API_ENDPOINT,
  SAINT_API_ENDPOINT,
  USER_API_ENDPOINT
} = process.env

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.json', '.ts', '.tsx']
    },
    module: {
        rules: [
          {
            test: /\.(ts|tsx)$/,
            loader: 'ts-loader'
          },
          {
            enforce: 'pre',
            test: /\.js$/,
            loader: 'source-map-loader'
          },
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader'
            ]
          },
          {
            test: /\.m?js/,
            resolve: {
                fullySpecified: false
            }
          }
        ]
      },
      devServer: {
        host: HOST_SERVER,
        port: HOST_PORT,
        historyApiFallback: true,
        open: true,
        proxy: {
          '/api/files': {
            target: FILE_API_ENDPOINT,
            changeOrigin: true,
            secure: false
          },
          '/api/saints': {
            target: SAINT_API_ENDPOINT,
            changeOrigin: true,
            secure: false
          },
          '/api/users': {
            target: USER_API_ENDPOINT,
            changeOrigin: true,
            secure: false
          }
        }
      },
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, 'public', 'index.html'),
        }),
        new webpack.ProgressPlugin(),
        new webpack.DefinePlugin({
           'process.env': {
              BACKEND_API_KEY: JSON.stringify(BACKEND_API_KEY),
              GOOGLE_CLIENT_ID: JSON.stringify(GOOGLE_CLIENT_ID)
            }
        })
      ]
}

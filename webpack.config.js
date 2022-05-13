const path = require("path");
const webpack = require('webpack')
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    resolve: {
        extensions: [".js", ".json", ".ts", ".tsx"]
    },
    module: {
        rules: [
          {
            test: /\.(ts|tsx)$/,
            loader: "ts-loader"
          },
          {
            enforce: "pre",
            test: /\.js$/,
            loader: "source-map-loader"
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
        host: 'localhost',
        port: 4444,
        historyApiFallback: true,
        open: true,
        proxy: {
          "/api/saints": {
            target: "http://localhost:3009",
            changeOrigin: true
          },
          "/api/files": {
            target: "http://localhost:3001",
            changeOrigin: true
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
          template: path.resolve(__dirname, "public", "index.html"),
        })
      ]
}

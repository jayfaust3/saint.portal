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
          }
        ]
      },
      devServer: {
        host: 'localhost',
        port: 3000,
        historyApiFallback: true,
        open: true,
        proxy: {
          "/saints": {
            target: "http://localhost:3009",
            changeOrigin: true
          },
          "/files": {
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

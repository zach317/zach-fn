const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 相对路径转绝对路径
const pathResolve = (_path) => path.resolve(__dirname, _path);

module.exports = {
  entry: pathResolve("../src/index.tsx"),
  output: {
    path: pathResolve("../dist"),
    filename: "scripts/[name].[hash].bundle.js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: pathResolve("../public/index.html"),
      filename: "index.html",
      title: "zach",
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx", ".json"],
    alias: {
      "@": pathResolve("../src/components"),
      "#": pathResolve("../src/common"),
    },
  },
};

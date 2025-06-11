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
    assetModuleFilename: "images/[contenthash][ext]",
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
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images/",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: pathResolve("../public/index.html"),
      filename: "index.html",
      title: "zach",
      favicon: pathResolve("../public/favicon.ico"),
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx", ".json"],
    alias: {
      "@": pathResolve("../src/components"),
      "#": pathResolve("../src/common"),
      images: pathResolve("../src/images"),
      utils: pathResolve("../src/utils"),
      hooks: pathResolve("../src/hooks"),
      styles: pathResolve("../src/styles"),
    },
  },
};

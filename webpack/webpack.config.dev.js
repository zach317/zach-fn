const path = require("path");

module.exports = {
  mode: "development",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          {
            loader: "less-loader",
            options: {
              additionalData: `@import "${path.resolve(
                __dirname,
                "../src/variables.less"
              )}";`,
            },
          },
        ],
      },
    ],
  },
  devServer: {
    host: "127.0.0.1",
    port: 9000,
    open: true,
    hot: true,
    // react配置路由之后，直接输入url显示404,是因为少了下面的配置
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000/",
        pathRewrite: { "^/api": "" },
        // changeOrigin: true,     // target是域名的话，需要这个参数，
        // secure: false,          // 设置支持https协议的代理
      },
    },
  },
};

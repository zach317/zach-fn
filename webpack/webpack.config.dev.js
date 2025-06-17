const path = require("path");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
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
                "../src/styles/variables.less"
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
    proxy: [
      {
        context: "/api", // 指定需要代理的路径
        target: "http://127.0.0.1:3000", // 代理的目标地址
        pathRewrite: { "^/api": "" }, // 重写路径，去掉 /api 前缀
        // changeOrigin: true,     // 如果目标是域名，需要这个参数
        // secure: false,          // 如果目标支持 HTTPS，需要设置为 false
      },
    ],
  },
};

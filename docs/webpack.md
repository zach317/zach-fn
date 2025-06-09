### 安装 Webpack 及相关依赖

推荐使用以下命令安装 Webpack 及其常用开发依赖：

```shell
# 安装 webpack 核心和 CLI 工具
npm install --save-dev webpack webpack-cli

# 安装开发服务器（用于本地调试）
npm install --save-dev webpack-dev-server
```

### 基础配置

初始配置文件 [webpack.config.js](../webpack/webpack.config.js) 示例，适用于项目起步阶段的基本打包需求：

```javascript
const path = require('path');

module.exports = {
  mode: 'development', // 开发模式，便于调试
  entry: './src/index.js', // 入口文件
  output: {
    filename: 'bundle.js', // 输出的打包文件名
    path: path.resolve(__dirname, 'dist') // 输出目录为 dist 文件夹
  }
};
```

在 [package.json](../package.json) 中添加如下脚本命令，便于执行构建与启动开发服务器：

```json
"scripts": {
  "build": "webpack --config webpack.config.js", // 执行打包
  "start": "webpack serve" // 启动开发服务器
}
```

### 安装常用 Loader 和插件

为了支持现代 JavaScript 特性、JSX 语法以及样式处理，需要安装以下 loader 和插件：

```shell
# 安装 Babel 相关 loader（支持 JSX 和 ES6+ 语法）
npm install --save-dev babel-loader @babel/core @babel/preset-env @babel/preset-react

# 安装 HTML 插件（自动生成 HTML 文件并注入打包资源）
npm install --save-dev html-webpack-plugin

# 安装 CSS/LESS 处理相关的 loader
npm install --save-dev css-loader style-loader postcss-loader less-loader
```

### 配置 Loader 和插件

完整的 Webpack 配置示例（包含模块规则、插件等），适用于支持 JSX、CSS 和 LESS 的项目：

```javascript
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.jsx", // 支持 JSX 入口文件
  output: {
    filename: "bundle.[hash].js", // 带 hash 的输出文件名，防止缓存问题
    clean: true, // 清空输出目录后再写入
    path: path.resolve(__dirname, "dist") // 输出路径
  },
  module: {
    rules: [
      {
        test: /\.jsx$/, // 匹配 .jsx 文件
        use: {
          loader: "babel-loader", // 使用 Babel 编译 JSX 和 ES6+
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"] // 使用 React 和 Env 预设
          }
        }
      },
      {
        test: /\.css$/, // 匹配 .css 文件
        use: ["style-loader", "css-loader", "postcss-loader"] // CSS 注入到 DOM
      },
      {
        test: /\.less$/, // 匹配 .less 文件
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"] // 支持 Less
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html" // 指定 HTML 模板
    })
  ],
  resolve: {
    extensions: [".js", ".jsx", ".json"] // 自动解析扩展名
  }
};
```

## 配置拆分建议

为了适应不同环境（如开发和生产）的需求，可以将 Webpack 配置拆分为多个文件进行管理。

### 推荐的配置文件结构

```
webpack/
├── webpack.config.common.js       # 公共配置（entry、output、基础 loaders 等）
├── webpack.config.dev.js          # 开发环境配置（devServer、热更新等）
├── webpack.config.prod.js         # 生产环境配置（压缩、优化等）
└── webpack.config.js              # 主入口配置，根据模式加载对应配置
```

### 1. 安装配置合并工具

推荐使用 `webpack-merge` 来合并公共配置与环境特定配置：

```shell
npm install --save-dev webpack-merge
```

### 2. 公共配置 - [webpack.config.common.js](../webpack/webpack.config.common.js)

该文件包含所有环境通用的配置项，例如入口、输出、基础 loader 和插件：

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 路径转换函数
const pathResolve = (_path) => path.resolve(__dirname, _path);

module.exports = {
  entry: pathResolve('../src/index.jsx'), // 统一入口
  output: {
    path: pathResolve('../dist'), // 输出路径
    filename: 'scripts/[name].[hash].bundle.js', // 输出文件名
    clean: true // 清空输出目录
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: pathResolve('../public/index.html'), // HTML 模板
      filename: 'index.html',
      title: 'zach' // 页面标题
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'] // 自动解析扩展名
  }
};
```

### 3. 开发环境配置 - [webpack.config.dev.js](../webpack/webpack.config.dev.js)

此配置专注于开发体验，启用热更新和本地服务器：

```javascript
const path = require('path');

module.exports = {
  mode: 'development', // 开发模式
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
      }
    ]
  },
  devServer: {
    host: '127.0.0.1',
    port: 9000,
    open: true, // 自动打开浏览器
    hot: true // 启用热更新
  }
};
```

### 4. 生产环境配置 - [webpack.config.prod.js](../webpack/webpack.config.prod.js)

此配置专注于性能优化和代码压缩，适合部署上线：

```shell
npm install --save-dev css-minimizer-webpack-plugin mini-css-extract-plugin
```

```javascript
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production', // 生产模式
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css' // 提取 CSS 到单独文件
    })
  ],
  optimization: {
    minimizer: [new CssMinimizerWebpackPlugin()] // 压缩 CSS
  }
};
```

### 5. 主配置文件 - [webpack.config.js](../webpack/webpack.config.js)

根据不同的构建模式动态合并对应的配置：

```javascript
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.config.common');
const devConfig = require('./webpack.config.dev');
const prodConfig = require('./webpack.config.prod');

module.exports = (env) => {
  switch (true) {
    case env.development:
      return merge(commonConfig, devConfig); // 合并开发配置
    case env.production:
      return merge(commonConfig, prodConfig); // 合并生产配置
    default:
      return merge(commonConfig, devConfig); // 默认使用开发配置
  }
};
```

### 6. 更新 [package.json](package.json) 中的脚本命令

确保脚本指向主配置文件 [webpack.config.js](../webpack/webpack.config.js)：

```json
"scripts": {
  "build": "webpack --config webpack.config.js", // 构建生产版本
  "start": "webpack serve" // 启动开发服务器
}
```
通过以上配置，我们实现了 Webpack 配置的模块化拆分，使项目更易维护，并根据不同环境提供最佳构建策略。
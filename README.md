# zach-fn 

## 项目搭建
如需初始化新项目，请参考：[新项目搭建指南](docs/init.md)

## 开发环境配置
### Webpack
详细配置说明请查阅 [Webpack 配置文档](docs/webpack.md)

### 路由配置
本项目使用 `react-router-dom` 进行路由管理，具体配置方式请参阅 [路由配置文档](docs/router.md)

## 环境要求
为确保项目正常运行，请使用以下版本的开发环境：
- Node.js: v18.20.8
- npm: 10.8.2

## 项目结构概览
项目核心目录采用清晰的层级化组织，便于快速定位文件。整体结构如下（后续文档将详细说明各目录用途）：

```
.
├── docs                # 项目文档目录
├── patches             # 补丁目录
├── public              # 静态资源目录
├── src                 # 源代码目录
│   ├── components      # 组件目录
│   ├── common          # 公共模块目录
│   ├── unils           # 工具类目录
│   ├── assets          # 静态资源目录
│   ├── app.jsx         # 包含项目路由
│   └── index.jsx       # 项目入口文件
├── webpack             # 配置文件目录
├── package.json        # 项目依赖包管理文件
├── README.md           # 项目说明文档
└── jsconfig.json       # 项目配置文件
```

## 项目启动与运行




## 项目启动与运行
- `npm install` - 安装依赖
- `npm run start` - 启动开发服务器
- `npm run build` - 构建用于生产的优化版本

更多详细信息，请参阅 [package.json](package.json) 中的 `scripts` 配置部分。

## Commit Message 格式规范
为了便于团队协作和自动化处理，我们采用简洁明了的 Commit Message 格式，具体格式如下：
```json
<type>: <subject>
```

> **注意：** 冒号 `:` 后需有一个空格  
> 示例：`feat: 增加了小程序模板消息相关功能`

### 提交类型说明
| 类型     | 描述 |
|----------|------|
| feat     | 新功能 feature |
| fix      | 修复 bug |
| docs     | 文档注释 |
| style    | 代码格式（不影响代码运行的变动）|
| refactor | 重构、优化（既不增加新功能，也不是修复bug）|
| perf     | 性能优化 |
| test     | 增加测试 |
| chore    | 构建过程或辅助工具的变动 |
| revert   | 回退 |
| build    | 打包 |

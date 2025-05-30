# zach-fn 

## 快速开始
如需快速初始化项目，请参考 [项目初始化指南](docs/init.md)。

## 目录结构
项目主要目录结构如下：
- `docs/` - 包含项目相关文档
  - [init.md](file:///Users/zach/Desktop/mine/zach-fn/docs/init.md) - 提供项目初始化步骤
  - [webpack.md](file:///Users/zach/Desktop/mine/zach-fn/docs/webpack.md) - Webpack 配置说明文档
- [package.json](file:///Users/zach/Desktop/mine/zach-fn/node_modules/@babel/core/package.json) - 项目的配置核心文件，包含依赖管理和脚本命令定义

## 命令脚本
项目常用命令如下：
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

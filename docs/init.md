### 初始化项目
```bash
npm init -y
```

### 安装依赖
```bash
npm install --save react react-dom
```

### 创建项目结构
按照以下方式组织项目文件结构：
```
src/
  ├── app.jsx
  └── index.jsx
.gitignore
public/
  └── index.html
```

在 [public/index.html](file:///Users/zach/Desktop/mine/zach-fn/public/index.html) 文件中，确保包含以下内容：
```html
<body>
  <div id="root"></div>
</body>
```

### 使用 Less 样式预处理器
安装 Less 支持：
```bash
npm install --save-dev less
```
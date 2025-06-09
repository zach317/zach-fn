## React 路由配置指南

### 1. 安装路由依赖
```bash
npm install react-router-dom
```

### 2. 配置路由模式
本项目采用 [BrowserRouter](../node_modules/react-router-dom/dist/index.d.ts#L65-L65) 作为路由模式，需在入口文件中配置：

```javascript
// src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.less";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <App />
  </Router>
);
```

### 3. 创建路由组件
#### 登录页面组件
```javascript
// components/auth/login.jsx
import React from "react";

const Login = () => {
  return <div>Login</div>;
};

export default Login;
```

#### 注册页面组件
```javascript
// components/auth/register.jsx
import React from "react";

const Register = () => {
  return <div>Register</div>;
};

export default Register;
```

#### 布局组件
```javascript
// components/auth/user-layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div>
      用户页面布局
      <Outlet /> {/* 子路由渲染位置 */}
    </div>
  );
};

export default UserLayout;
```

### 4. 配置路由规则
```javascript
// src/app.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "@/auth/register";
import UserLayout from "@/auth/user-layout";
import Login from "@/auth/login";

const App = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
};

export default App;
```

### 5. 解决刷新404问题
在开发环境配置中添加 history API 回退支持：

```javascript
// webpack.config.dev.js
devServer: {
  // ...
  historyApiFallback: true, // 支持HTML5 History API
}
```

### 最佳实践建议
- 使用 `<Route>` 的 [element](../node_modules/react-router/dist/lib/components.d.ts#L67-L67) 属性替代旧版的 `component` 
- 确保所有路由组件都通过 `<Outlet>` 渲染子路由
- 将公共布局组件提取为独立模块以复用
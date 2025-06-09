## 配置 Axios

### 安装 Axios

在项目中通过 npm 安装 Axios：

```shell
npm install axios --save
```

### 创建 Axios 实例

我们可以通过创建一个 Axios 实例来定制请求配置。以下是一个基础示例：

路径: `utils/request.js`

```javascript
import axios from "axios";

// 创建 Axios 实例
const request = axios.create({
  timeout: 5000, // 请求超时时间（毫秒）
  baseURL: "/api", // 基础 URL，请求时会自动拼接
});
```

### 配置拦截器

Axios 提供了强大的拦截器功能，可以对请求和响应进行统一处理。

#### 请求拦截器

请求拦截器可以在发送请求前对请求进行修改或添加逻辑，例如：

```javascript
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么，比如添加 token
    return config;
  },
  function (error) {
    // 对请求错误做统一处理
    return Promise.reject(error);
  }
);
```

#### 响应拦截器

响应拦截器可以统一处理响应数据或错误，例如：

```javascript
request.interceptors.response.use(
  function (response) {
    // 对响应数据做统一处理（2xx 范围内的状态码都会触发）
    return response;
  },
  function (error) {
    // 对超出 2xx 范围的状态码进行统一处理
    return Promise.reject(error);
  }
);
```

### 开发环境代理配置

在开发过程中，为了避免跨域问题，我们使用 Webpack DevServer 的 proxy 功能进行请求代理设置。

路径: `webpack.config.dev.js`

```javascript
devServer: {
  proxy: [
    {
      context: "/api", // 指定需要代理的路径
      target: "http://127.0.0.1:3000", // 代理的目标地址
      pathRewrite: { "^/api": "" }, // 重写路径，去掉 /api 前缀
      // changeOrigin: true,     // 如果目标是域名，需要这个参数
      // secure: false,          // 如果目标支持 HTTPS，需要设置为 false
    },
  ],
}
```

### 登录鉴权说明

关于登录鉴权的详细内容，请参考 [登录鉴权文档](./authentication.md)。

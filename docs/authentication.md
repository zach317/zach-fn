## 登录鉴权机制

本项目采用 Token 鉴权方式实现用户登录状态管理，具体流程如下：

1. **Token 获取**：首次登录后，后端会在接口响应头中返回 `authorization` 字段
2. **本地存储**：前端通过响应拦截器自动保存 token 到 localStorage
3. **请求携带**：后续请求通过请求拦截器自动添加 Authorization 请求头
4. **异常处理**：当遇到 401 未授权错误时，自动清理缓存并跳转到登录页

### 拦截器配置

#### 响应拦截器

```javascript
const excludeRouter = ["/"]; // 免登录白名单路由

request.interceptors.response.use(
  (response) => {
    // 自动保存 token
    const { authorization } = response.headers;
    authorization && localStorage.setItem("token", authorization);
    return response.data;
  },
  (error) => {
    // 统一异常处理
    if (error.response?.status === 401) {
      localStorage.clear();

      // 非免登录页面触发跳转
      if (!excludeRouter.includes(window.location.pathname)) {
        window.location.pathname = "/login";
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);
```

#### 请求拦截器

```javascript
request.interceptors.request.use(
  (config) => {
    // 自动注入 token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

登陆注册时密码需要加密，使用 crypto-js

```shell
npm install crypto-js --save
```

untils/crypto.js

```javascript
import CryptoJS from "crypto-js";

const secret = "zach_front";

const crypto = {
  // 加密
  encrypt: (data) =>
    CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString(),
  // 解密
  decrypt: (data) =>
    JSON.parse(CryptoJS.AES.decrypt(data, secret).toString(CryptoJS.enc.Utf8)),
};

export default crypto;
```

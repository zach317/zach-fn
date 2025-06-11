import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { BrowserRouter as Router } from "react-router-dom";
import { HappyProvider } from "@ant-design/happy-work-theme";
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import dayjs from "dayjs";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import "dayjs/locale/zh-cn";
import "./index.less";

dayjs.locale("zh-cn");
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ConfigProvider locale={zhCN}>
    <Router
      /**
       * 配置 React Router 的 future 选项，启用实验性功能：
       * - v7_startTransition: 启用过渡模式，提升路由切换时的用户体验
       * - v7_relativeSplatPath: 启用相对路径匹配规则，增强动态路由匹配灵活性
       */
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <HappyProvider>
        <App />
      </HappyProvider>
    </Router>
  </ConfigProvider>
);

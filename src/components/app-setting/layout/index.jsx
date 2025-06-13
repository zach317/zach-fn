import React from "react";
import { Breadcrumb } from "antd";
import "./index.less";
import { Link, Outlet } from "react-router-dom";

const AppSetting = () => {
  return (
    <div className="app-setting-wrap">
      <Breadcrumb items={[{ title: "交易设置" }]} />
      <Outlet />
    </div>
  );
};

export default AppSetting;

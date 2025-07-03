import React from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  HomeOutlined,
  SettingOutlined,
  ApartmentOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import "./index.less";

const AppSetting = () => {
  const location = useLocation();

  // 路由配置映射
  const routeConfig = {
    "/setting": { title: "交易设置", icon: <SettingOutlined /> },
    "/setting/category": { title: "分类设置", icon: <ApartmentOutlined /> },
    "/setting/tag": { title: "标签设置", icon: <TagsOutlined /> },
    "/setting/account": { title: "账户设置", icon: <TagsOutlined /> },
    "/setting/bill": { title: "账单设置", icon: <TagsOutlined /> },
    "/setting/analysis": { title: "分析设置", icon: <TagsOutlined /> },
  };

  // 生成面包屑项目
  const generateBreadcrumbItems = () => {
    const pathSnippets = location.pathname.split("/").filter((i) => i);
    const items = [
      {
        title: (
          <Link to="/" className="breadcrumb-home">
            <HomeOutlined />
            <span>首页</span>
          </Link>
        ),
      },
    ];

    let currentPath = "";
    pathSnippets.forEach((snippet, index) => {
      currentPath += `/${snippet}`;
      const config = routeConfig[currentPath];

      if (config) {
        const isLast = index === pathSnippets.length - 1;
        items.push({
          title: isLast ? (
            <span className="breadcrumb-current">
              {config.icon}
              <span>{config.title}</span>
            </span>
          ) : (
            <Link to={currentPath} className="breadcrumb-link">
              {config.icon}
              <span>{config.title}</span>
            </Link>
          ),
        });
      }
    });

    return items;
  };

  return (
    <div className="app-setting-wrap">
      <div className="breadcrumb-container">
        <Breadcrumb items={generateBreadcrumbItems()} separator="›" />
      </div>
      <Outlet />
    </div>
  );
};

export default AppSetting;

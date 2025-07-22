import React from "react";
import "./index.less";
import logo from "images/logo.png";
import { Link, useLocation } from "react-router-dom";
import HeaderDropdown from "./header-dropdown";

const Header = ({ user }) => {
  const location = useLocation();
  const navItems = [
    {
      key: "trade",
      label: "交易明细",
      path: "/transaction",
      matchPaths: ["/transaction"],
    },
    {
      key: "analysis",
      label: "账目分析",
      path: "/analysis",
      matchPaths: ["/analysis"],
    },
    {
      key: "assets",
      label: "资产趋势",
      // path:'/',
      matchPaths: [],
    },
    {
      key: "setting",
      label: "交易设置",
      path: "/setting",
      matchPaths: ["/setting"],
    },
  ];

  const isActive = (navItem) => {
    return navItem.matchPaths.some((path) => {
      if (path === "/") {
        // 首页精确匹配
        return location.pathname === "/";
      }
      // 其他页面可以是前缀匹配
      return location.pathname.startsWith(path);
    });
  };
  return (
    <div className="header-wrap">
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>
      <div className="header-category">
        {!!user.id &&
          navItems.map((item) => (
            <Link
              key={item.key}
              className={`dropdown-link ${isActive(item) ? "active" : ""}`}
              to={isActive(item) ? "#" : item.path}
            >
              {item.label}
            </Link>
          ))}
      </div>
      <HeaderDropdown user={user} />
    </div>
  );
};

export default Header;

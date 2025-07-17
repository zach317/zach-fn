import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
// import { Spin } from "antd";
import Spin from "#/spin";
import Logo from "images/logo.png";
import "./index.less";

const UserLayout = () => {
  const [loading, setLoading] = useState(false);

  return (
    <Spin loading={loading}>
      <div className="zach-user-layout">
        <Link className="zach-logo-link" to="/">
          <img src={Logo} alt="logo" className="zach-logo" />
        </Link>
        <div className="zach-login-container light-line">
          <Outlet context={{ setLoading }} />
        </div>
      </div>
    </Spin>
  );
};
export default UserLayout;

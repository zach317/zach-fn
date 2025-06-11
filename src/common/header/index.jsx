import React from "react";
import "./index.less";
import logo from "images/logo.png";
import { Link } from "react-router-dom";
import HeaderDropdown from "./header-dropdown";

const Header = ({ user }) => {
  return (
    <div className="header-wrap">
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>
      <div className="header-category">
        <Link className="dropdown-link" to="/">
          交易
        </Link>
        <Link className="dropdown-link" to="/">
          分析
        </Link>
        <Link className="dropdown-link" to="/">
          资产
        </Link>
      </div>
      <HeaderDropdown user={user} />
    </div>
  );
};

export default Header;

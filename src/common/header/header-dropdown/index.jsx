/* eslint-disable react/prop-types */
import React from "react";
import { Dropdown, Space, Modal, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import Icon from "#/my-icon";
import "./index.less";

const HeaderDropdown = ({ user }) => {
  const { id, nickname } = user;
  const navigate = useNavigate();

  const handleLogout = () => {
    Modal.confirm({
      title: "确定要退出登录吗",
      onOk: () => {
        localStorage.clear();
        message.success("退出成功");
        navigate("/login");
      },
    });
  };

  const items = [
    {
      key: "user-profile",
      label: (
        <Link className="dropdown-item" to="/user-profile">
          个人中心
        </Link>
      ),
    },
    {
      key: "system",
      label: (
        <Link className="dropdown-item" to="/">
          交易设置
        </Link>
      ),
    },
    {
      key: "logout",
      label: (
        <a className="dropdown-item dropdown-logout" onClick={handleLogout}>
          退出登录
        </a>
      ),
    },
  ];

  return id ? (
    <Dropdown className="header-dropdown" menu={{ items }}>
      <Space>
        <Icon className="header-user-icon" type="icon-yonghu" />
        <span className="header-user-nickname">{nickname}</span>
      </Space>
    </Dropdown>
  ) : (
    <Link className="link-to-login" to="/login">
      登陆 / 注册
    </Link>
  );
};

export default HeaderDropdown;

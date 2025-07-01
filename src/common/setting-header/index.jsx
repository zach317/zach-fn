import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./index.less";

const SettingHeader = ({ title, handleAdd }) => {
  return (
    <div className="setting-header-wrapper light-line">
      <h2 className="page-title">{title}管理</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => handleAdd()}
        className="add-btn"
      >
        添加{title}
      </Button>
    </div>
  );
};

export default SettingHeader;

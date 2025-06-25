import React from "react";
import "./index.less";
import { Link } from "react-router-dom";
import {
  SettingOutlined,
  ApartmentOutlined,
  TagsOutlined,
} from "@ant-design/icons";

const AppSetting = () => {
  return (
    <div className="app-setting-container">
      <div className="setting-grid">
        <Link to="/setting/category" className="setting-card">
          <div className="setting-icon">
            <ApartmentOutlined />
          </div>
          <div className="setting-content">
            <h3>分类设置</h3>
            <p>管理收入和支出的分类结构</p>
          </div>
          <div className="setting-arrow">
            <span>→</span>
          </div>
        </Link>
        <Link to="/setting/tag" className="setting-card">
          <div className="setting-icon">
            <TagsOutlined />
          </div>
          <div className="setting-content">
            <h3>标签设置</h3>
            <p>管理每个账单中额外的标签结构</p>
          </div>
          <div className="setting-arrow">
            <span>→</span>
          </div>
        </Link>

        <Link to="#" className="setting-card">
          <div className="setting-icon">
            <TagsOutlined />
          </div>
          <div className="setting-content">
            <h3>账户设置</h3>
            <p>查看您每个账户的流水</p>
          </div>
          <div className="setting-arrow">
            <span>→</span>
          </div>
        </Link>

        <Link to="#" className="setting-card">
          <div className="setting-icon">
            <TagsOutlined />
          </div>
          <div className="setting-content">
            <h3>账单设置</h3>
            <p>根据您的需要个性化您的账单</p>
          </div>
          <div className="setting-arrow">
            <span>→</span>
          </div>
        </Link>
        <Link to="#" className="setting-card">
          <div className="setting-icon">
            <TagsOutlined />
          </div>
          <div className="setting-content">
            <h3>分析设置</h3>
            <p>自行选择您关注的信息</p>
          </div>
          <div className="setting-arrow">
            <span>→</span>
          </div>
        </Link>

        {/* 预留其他设置项 */}
        <div className="setting-card disabled">
          <div className="setting-icon">
            <SettingOutlined />
          </div>
          <div className="setting-content">
            <h3>其他设置</h3>
            <p>更多功能设置项</p>
          </div>
          <div className="setting-arrow">
            <span>→</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSetting;

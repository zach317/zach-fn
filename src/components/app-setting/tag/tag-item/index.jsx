import React from "react";
import { Button, Popconfirm, Tooltip } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TagOutlined,
} from "@ant-design/icons";
import "./index.less";

const Empty = ({ id, onAdd }) => (
  <div className="empty-sub-tags">
    <TagOutlined className="empty-icon" />
    <span>暂无子标签</span>
    <Button
      type="link"
      size="small"
      onClick={() => onAdd(id)}
      className="add-sub-tag-btn"
    >
      添加子标签
    </Button>
  </div>
);

const SubTag = ({ subTag, id, onEdit, onDelete }) => (
  <div key={subTag.id} className="sub-tag">
    <div className="sub-tag-color" style={{ backgroundColor: subTag.color }} />
    <span className="sub-tag-name">{subTag.name}</span>
    <div className="sub-tag-actions">
      <Button
        type="text"
        size="small"
        icon={<EditOutlined />}
        onClick={() => onEdit(subTag, id)}
        className="sub-action-btn"
      />
      <Popconfirm
        title="确定要删除这个子标签吗？"
        onConfirm={() => onDelete(subTag.id, id)}
        okText="确定"
        cancelText="取消"
      >
        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          className="sub-action-btn delete"
        />
      </Popconfirm>
    </div>
  </div>
);

const TagItem = ({ tag, onAdd, onEdit, onDelete }) => {
  return (
    <div key={tag.id} className="tag-card">
      <div className="tag-card-header">
        <div className="tag-info">
          <div className="tag-color" style={{ backgroundColor: tag.color }} />
          <span className="tag-name">{tag.name}</span>
          <span className="tag-count">
            {tag.children?.length || 0} 个子标签
          </span>
        </div>
        <div className="tag-actions">
          <Tooltip title="添加子标签">
            <Button
              type="text"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => onAdd(tag.id)}
              className="action-btn add-btn"
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(tag)}
              className="action-btn edit-btn"
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个标签吗？"
              description={
                tag.children?.length > 0
                  ? "删除后该标签的所有子标签也将被删除"
                  : ""
              }
              onConfirm={() => onDelete(tag.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                className="action-btn delete-btn"
              />
            </Popconfirm>
          </Tooltip>
        </div>
      </div>
      <div className="tag-card-body">
        {tag.children?.length > 0 ? (
          <div className="sub-tags">
            {tag.children.map((subTag) => (
              <SubTag
                key={subTag.id}
                subTag={subTag}
                id={tag.id}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <Empty id={tag.id} onAdd={onAdd} />
        )}
      </div>
    </div>
  );
};

export default TagItem;

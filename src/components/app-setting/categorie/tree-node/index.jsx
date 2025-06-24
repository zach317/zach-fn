import React from "react";
import { Button, Tooltip, Popconfirm } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DragOutlined,
} from "@ant-design/icons";
import "./index.less";

const TreeNode = ({ nodeData, onAdd, onEdit, onDelete }) => {
  const { key, title, level } = nodeData;

  return (
    <div className="tree-node-content">
      <div className="node-info">
        <DragOutlined className="drag-handle" />
        <span className={`node-title level-${level}`}>{title}</span>
        <span className="node-level">L{level}</span>
      </div>
      <div className="node-actions">
        {level < 3 && (
          <Tooltip title="添加子分类">
            <Button
              type="text"
              size="small"
              icon={<PlusOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onAdd(key, level + 1);
              }}
              className="action-btn add-btn"
            />
          </Tooltip>
        )}
        <Tooltip title="编辑">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(nodeData);
            }}
            className="action-btn edit-btn"
          />
        </Tooltip>
        <Tooltip title="删除">
          <Popconfirm
            title="确定要删除这个分类吗？"
            description="删除后该分类及其所有子分类都将被删除"
            onConfirm={(e) => {
              e?.stopPropagation();
              onDelete(key);
            }}
            okText="确定"
            cancelText="取消"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              className="action-btn delete-btn"
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </Tooltip>
      </div>
    </div>
  );
};

export default React.memo(TreeNode);

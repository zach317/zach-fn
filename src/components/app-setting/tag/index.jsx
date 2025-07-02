import React from "react";
import { Empty, Space } from "antd";
import { BgColorsOutlined } from "@ant-design/icons";
import SettingHeader from "#/setting-header";
import TagItem from "./tag-item";
import TagModal from "./modal";
import useTagManagement from "./useTagManagement";

import "./index.less";

const Tag = () => {
  const {
    form,
    handleAdd,
    editingTag,
    modalVisible,
    handleSubmit,
    handleEdit,
    tags,
    handleDelete,
    handleCancel,
  } = useTagManagement();

  return (
    <div className="tag-management">
      <SettingHeader title="标签" handleAdd={handleAdd} />
      <div className="tag-content">
        {tags.length > 0 ? (
          <div className="tag-grid">
            {tags.map((tag) => (
              <TagItem
                key={tag.id}
                tag={tag}
                onAdd={() => handleAdd(tag.id, tag.level + 1)}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Empty
              image={<BgColorsOutlined className="empty-icon" />}
              description={
                <Space direction="vertical" size={16}>
                  <span className="empty-text">
                    暂无标签，开始创建你的第一个标签吧
                  </span>
                </Space>
              }
            />
          </div>
        )}
      </div>

      <TagModal
        visible={modalVisible}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        form={form}
        editingTag={editingTag}
        fatherName={tags.find((t) => t.id === editingTag.parentId)?.name}
      />
    </div>
  );
};

export default Tag;

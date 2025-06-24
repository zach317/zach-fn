import React from "react";
import { Modal, Form, Input } from "antd";
import "./index.less";

const CategoryModal = ({ onSubmit, form, visible, editingNode, onCancel }) => {
  return (
    <Modal
      title={editingNode?.isNew ? "添加分类" : "编辑分类"}
      open={visible}
      onOk={onSubmit}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
      className="category-modal"
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="title"
          label="分类名称"
          rules={[
            { required: true, message: "请输入分类名称" },
            { max: 20, message: "分类名称不能超过20个字符" },
            { pattern: /^[^<>'"&]*$/, message: "分类名称不能包含特殊字符" },
          ]}
        >
          <Input placeholder="请输入分类名称" maxLength={20} showCount />
        </Form.Item>
        {editingNode?.level && (
          <div className="level-info">
            <span>分类层级：第 {editingNode.level} 级</span>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default React.memo(CategoryModal);

import React from "react";
import { Modal, Form, Input, ColorPicker } from "antd";
import "./index.less";

const TagModal = ({
  onSubmit,
  form,
  visible,
  editingTag,
  onCancel,
  fatherName,
}) => {
  // 预设颜色
  const presetColors = [
    "#0eb0c9",
    "#52c41a",
    "#1890ff",
    "#722ed1",
    "#ff6b6b",
    "#ffa940",
    "#eb2f96",
    "#13c2c2",
    "#f5222d",
    "#fa8c16",
    "#faad14",
    "#a0d911",
  ];

  return (
    <Modal
      title={
        editingTag?.isNew
          ? editingTag?.isSubTag
            ? "添加子标签"
            : "添加标签"
          : editingTag?.isSubTag
          ? "编辑子标签"
          : "编辑标签"
      }
      open={visible}
      onOk={onSubmit}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
      className="tag-modal"
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="name"
          label="标签名称"
          rules={[
            { required: true, message: "请输入标签名称" },
            { max: 10, message: "标签名称不能超过10个字符" },
            { pattern: /^[^<>'"&]*$/, message: "标签名称不能包含特殊字符" },
          ]}
        >
          <Input placeholder="请输入标签名称" maxLength={10} showCount />
        </Form.Item>

        <Form.Item
          name="color"
          label="标签颜色"
          rules={[{ required: true, message: "请选择标签颜色" }]}
        >
          <ColorPicker
            showText
            presets={[
              {
                label: "推荐颜色",
                colors: presetColors,
              },
            ]}
          />
        </Form.Item>

        {editingTag?.isSubTag && (
          <div className="parent-info">
            <span>父标签：{fatherName}</span>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default React.memo(TagModal);

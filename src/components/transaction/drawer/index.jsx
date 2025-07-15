import React, { useState, useEffect, useCallback } from "react";
import {
  Drawer,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Radio,
  message,
  Modal,
  Tree,
  Tag,
  Collapse,
  Divider,
} from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  TagsOutlined,
  SaveOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import crypto from "utils/crypto";
import {
  getAllCatrgories,
  getTags,
  addTransaction,
  updateTransaction,
} from "../services";
import { hexToRGBA } from "utils/helpers";
import "./index.less";

const { TextArea } = Input;
const { Panel } = Collapse;

const TransactionDrawer = ({
  visible,
  onClose,
  editData = null,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [tags, setTags] = useState([]);
  const [transactionType, setTransactionType] = useState("expense");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [tagCollapseActive, setTagCollapseActive] = useState([]);

  // 初始化数据
  useEffect(() => {
    if (visible) {
      initializeData();
    }
  }, [visible]);

  // 编辑数据回填
  useEffect(() => {
    if (editData && visible) {
      setTransactionType(editData.type);
      setSelectedCategory(editData.category);
      setSelectedTags(editData.tags || []);
      form.setFieldsValue({
        type: editData.type,
        amount: editData.amount,
        date: dayjs(editData.date),
        description: editData.description || "",
      });
    } else if (visible) {
      // 新增时重置
      setTransactionType("expense");
      setSelectedCategory(null);
      setSelectedTags([]);
      form.resetFields();
      form.setFieldsValue({
        type: "expense",
        date: dayjs(),
      });
    }
  }, [editData, visible, form]);

  const initializeData = async () => {
    await Promise.all([getCategories(), getTagList()]);
  };

  // 获取分类数据
  const getCategories = useCallback(async () => {
    const categoryStorage = localStorage.getItem("categories");
    if (categoryStorage) {
      const categories = crypto.decrypt(categoryStorage);
      if (categories.expense && categories.income) {
        setCategories(categories);
      } else {
        await fetchCategories();
      }
    } else {
      await fetchCategories();
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getAllCatrgories();
      if (res.success) {
        setCategories(res.data);
        localStorage.setItem("categories", crypto.encrypt(res.data));
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // 获取标签数据
  const getTagList = useCallback(async () => {
    const tagStorage = localStorage.getItem("tags");
    if (tagStorage) {
      const tags = crypto.decrypt(tagStorage);
      setTags(tags);
    } else {
      try {
        const res = await getTags();
        if (res.success) {
          setTags(res.data);
          localStorage.setItem("tags", crypto.encrypt(res.data));
        }
      } catch (error) {
        message.error(error.message);
      }
    }
  }, []);

  // 转换分类树数据，标记叶子节点
  const getCategoryTreeData = (categoryList) => {
    const convertNode = (node) => {
      const hasChildren = node.children && node.children.length > 0;
      return {
        title: (
          <span
            className={`tree-node ${
              !hasChildren ? "leaf-node" : "parent-node"
            }`}
          >
            {node.title || node.name}
            {!hasChildren && <CheckOutlined className="leaf-icon" />}
          </span>
        ),
        key: node.key || node.id,
        value: node.key || node.id,
        disabled: hasChildren, // 有子节点的不可选择
        children: hasChildren ? node.children.map(convertNode) : undefined,
        isLeaf: !hasChildren,
        nodeData: node,
      };
    };

    return categoryList.map(convertNode);
  };

  // 处理分类选择
  const handleCategorySelect = (selectedKeys, { node }) => {
    if (node.isLeaf) {
      setSelectedCategory(node.nodeData);
      setCategoryModalVisible(false);
    }
  };

  // 处理标签选择
  const handleTagSelect = (tag) => {
    const tagId = tag.id;
    const isSelected = selectedTags.some((t) => t.id === tagId);

    if (isSelected) {
      setSelectedTags(selectedTags.filter((t) => t.id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // 渲染标签选择器
  const renderTagSelector = () => {
    return (
      <div className="tag-selector">
        <Collapse
          ghost
          activeKey={tagCollapseActive}
          onChange={setTagCollapseActive}
          className="tag-collapse"
        >
          {tags.map((parentTag) => (
            <Panel
              key={parentTag.id}
              header={
                <div className="tag-panel-header">
                  <span>#{parentTag.name}</span>
                  <span className="tag-count">
                    {parentTag.children?.length || 0}个标签
                  </span>
                </div>
              }
            >
              <div className="tag-list">
                {parentTag.children?.map((childTag) => (
                  <Tag
                    key={childTag.id}
                    className={`tag-item`}
                    style={
                      selectedTags.some((t) => t.id === childTag.id)
                        ? {
                            backgroundColor: hexToRGBA(childTag.color, 0.1),
                            border: `1px solid ${hexToRGBA(
                              childTag.color,
                              0.3
                            )}`,
                            color: childTag.color,
                          }
                        : {}
                    }
                    onClick={() => handleTagSelect(childTag)}
                  >
                    #{childTag.name}
                  </Tag>
                ))}
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>
    );
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!selectedCategory) {
        message.error("请选择分类");
        return;
      }

      setLoading(true);

      const transactionData = {
        ...values,
        category: selectedCategory,
        tags: selectedTags,
        date: values.date.format("YYYY-MM-DD"),
      };

      // 这里调用实际的API
      if (editData) {
        await updateTransaction({
          transactionId: editData.id,
          ...transactionData,
        });
        message.success("更新成功");
      } else {
        await addTransaction(transactionData);
        message.success("添加成功");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      message.error(error.message || "操作失败");
    } finally {
      setLoading(false);
    }
  };

  const currentCategories = categories[transactionType] || [];

  return (
    <>
      <Drawer
        title={
          <div className="drawer-title">
            <div className="title-content">
              {editData ? "编辑" : "添加"}
              <span className={`transaction-type ${transactionType}`}>
                {transactionType === "income" ? "收入" : "支出"}
              </span>
            </div>
          </div>
        }
        width={480}
        open={visible}
        onClose={onClose}
        className="transaction-drawer"
        extra={
          <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
        }
        footer={
          <div className="drawer-footer">
            <Button onClick={onClose} disabled={loading}>
              取消
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={loading}
              onClick={handleSubmit}
            >
              {editData ? "更新" : "保存"}
            </Button>
          </div>
        }
      >
        <div className="transaction-form">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              type: "expense",
              date: dayjs(),
            }}
          >
            {/* 交易类型 */}
            <Form.Item
              name="type"
              label="交易类型"
              rules={[{ required: true, message: "请选择交易类型" }]}
            >
              <Radio.Group
                value={transactionType}
                onChange={(e) => {
                  setTransactionType(e.target.value);
                  setSelectedCategory(null); // 切换类型时清空分类
                }}
                className="type-radio-group"
              >
                <Radio.Button value="expense" className="expense-radio">
                  支出
                </Radio.Button>
                <Radio.Button value="income" className="income-radio">
                  收入
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            {/* 金额 */}
            <Form.Item
              name="amount"
              label="金额"
              rules={[
                { required: true, message: "请输入金额" },
                { type: "number", min: 0.01, message: "金额必须大于0" },
              ]}
            >
              <InputNumber
                prefix={<DollarOutlined />}
                placeholder="0.00"
                min={0.01}
                max={999999.99}
                precision={2}
                style={{ width: "100%" }}
                className="amount-input"
              />
            </Form.Item>

            {/* 分类选择 */}
            <Form.Item label="分类" required className="category-form-item">
              <div className="category-selector">
                <Button
                  type="dashed"
                  icon={<AppstoreOutlined />}
                  onClick={() => setCategoryModalVisible(true)}
                  className="category-btn"
                  block
                >
                  {selectedCategory ? (
                    <span className="selected-category">
                      {selectedCategory.name || selectedCategory.title}
                    </span>
                  ) : (
                    <span className="category-placeholder">点击选择分类</span>
                  )}
                </Button>
                {selectedCategory && (
                  <div className="selected-category-display">
                    <Tag color="blue" className="category-tag">
                      {selectedCategory.name || selectedCategory.title}
                    </Tag>
                  </div>
                )}
              </div>
            </Form.Item>

            {/* 日期 */}
            <Form.Item
              name="date"
              label="日期"
              rules={[{ required: true, message: "请选择日期" }]}
            >
              <DatePicker
                placeholder="选择日期"
                style={{ width: "100%" }}
                suffixIcon={<CalendarOutlined />}
                className="date-picker"
              />
            </Form.Item>

            {/* 标签选择 */}
            <Form.Item label="标签" className="tag-form-item">
              <div className="tag-section">
                <div className="tag-header">
                  <TagsOutlined />
                  <span>选择标签（可选）</span>
                  {selectedTags.length > 0 && (
                    <span className="selected-count">
                      已选择 {selectedTags.length} 个
                    </span>
                  )}
                </div>

                {selectedTags.length > 0 && (
                  <div className="selected-tags">
                    {selectedTags.map((tag) => (
                      <Tag
                        key={tag.id}
                        closable
                        onClose={() => handleTagSelect(tag)}
                        style={{
                          backgroundColor: hexToRGBA(tag.color, 0.1),
                          border: `1px solid ${hexToRGBA(tag.color, 0.3)}`,
                          color: tag.color,
                        }}
                      >
                        #{tag.name}
                      </Tag>
                    ))}
                  </div>
                )}

                {renderTagSelector()}
              </div>
            </Form.Item>

            <Divider />

            {/* 备注 */}
            <Form.Item
              name="description"
              label="备注"
              rules={[{ max: 50, message: "备注不能超过50个字符" }]}
            >
              <TextArea
                placeholder="添加备注信息（可选）"
                maxLength={50}
                rows={3}
                showCount
                prefix={<FileTextOutlined />}
                className="description-input"
              />
            </Form.Item>
          </Form>
        </div>
      </Drawer>

      {/* 分类选择弹框 */}
      <Modal
        title={
          <div className="category-modal-title">
            <AppstoreOutlined />
            选择{transactionType === "income" ? "收入" : "支出"}分类
          </div>
        }
        open={categoryModalVisible}
        onCancel={() => setCategoryModalVisible(false)}
        footer={null}
        width={600}
        className="category-modal"
      >
        <div className="category-modal-content">
          <div className="category-tip">
            <span>💡 只能选择最底层的分类</span>
          </div>
          <Tree
            showLine={{ showLeafIcon: false }}
            defaultExpandAll
            onSelect={handleCategorySelect}
            treeData={getCategoryTreeData(currentCategories)}
            className="category-tree"
            selectedKeys={
              selectedCategory
                ? [selectedCategory.key || selectedCategory.id]
                : []
            }
          />
        </div>
      </Modal>
    </>
  );
};

export default TransactionDrawer;

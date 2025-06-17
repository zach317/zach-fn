import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Tree,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Tabs,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DragOutlined,
  MoneyCollectOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import {
  addCategory,
  getCatrgories,
  updateCategory,
  deleteCategory,
  reorderCategory,
} from "@/app-setting/categorie/services";
import "./index.less";

const { Option } = Select;
const { TabPane } = Tabs;

const Categorie = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("income");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await getCatrgories({ type: activeTab });
      setData(res.data);
    } catch (error) {
      message.error(error.message);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [activeTab, fetchData]);

  // 查找节点
  const findNode = useCallback((data, key) => {
    for (let item of data) {
      if (item.key === key) {
        return item;
      }
      if (item.children) {
        const found = findNode(item.children, key);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // 查找父节点
  const findParentNode = useCallback((data, targetKey, parent = null) => {
    for (let item of data) {
      if (item.key === targetKey) {
        return parent;
      }
      if (item.children) {
        const found = findParentNode(item.children, targetKey, item);
        if (found !== null) return found;
      }
    }
    return null;
  }, []);

  // 删除节点
  const deleteNode = useCallback((data, key) => {
    return data.filter((item) => {
      if (item.key === key) {
        return false;
      }
      if (item.children) {
        item.children = deleteNode(item.children, key);
      }
      return true;
    });
  }, []);

  // 树节点标题渲染
  const renderTreeNode = useCallback((nodeData) => {
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
                  handleAdd(key, level + 1);
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
                handleEdit(nodeData);
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
                handleDelete(key);
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
  }, []);

  // 处理添加
  const handleAdd = useCallback(
    (parentKey = null, level = 1) => {
      setEditingNode({ parentKey, level, isNew: true });
      setIsModalVisible(true);
      form.resetFields();
    },
    [form]
  );

  // 处理编辑
  const handleEdit = useCallback(
    (nodeData) => {
      setEditingNode({ ...nodeData, isNew: false });
      setIsModalVisible(true);
      form.setFieldsValue({
        title: nodeData.title,
      });
    },
    [form]
  );

  // 处理删除
  const handleDelete = useCallback(
    async (key) => {
      try {
        const res = await deleteCategory({ key, type: activeTab });
        if (res.success) {
          setData(res.data);
          message.success("删除成功");
        }
      } catch (error) {
        message.error("删除失败：" + error.message);
      }
    },
    [data, deleteNode, activeTab]
  );

  // 处理表单提交
  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const { title } = values;
      if (editingNode.isNew) {
        // 添加新节点
        const newNode = {
          title,
          level: editingNode.level,
        };

        const res = await addCategory({
          ...newNode,
          type: activeTab,
          parentKey: editingNode.parentKey,
        });

        let newData = [...data];
        if (res.success) {
          if (editingNode.parentKey) {
            // 添加到父节点下
            const addToParent = (data) => {
              return data.map((item) => {
                if (item.key === editingNode.parentKey) {
                  return {
                    ...item,
                    children: [
                      ...(item.children || []),
                      { ...newNode, key: res.data.key },
                    ],
                  };
                }
                if (item.children) {
                  return {
                    ...item,
                    children: addToParent(item.children),
                  };
                }
                return item;
              });
            };
            newData = addToParent(newData);
            setData(newData);
          } else {
            // 添加到根级别
            newData.push(newNode);
            setData(newData);
          }
        }

        message.success("添加成功");
      } else {
        // 编辑节点
        const res = await updateCategory({
          key: editingNode.key,
          title,
          type: activeTab,
        });
        if (res.success) {
          setData(res.data);
          message.success("修改成功");
        }
      }

      setIsModalVisible(false);
      setEditingNode(null);
    } catch (error) {
      if (error.errorFields) {
        message.error("请检查表单输入");
      } else {
        message.error("操作失败：" + error.message);
      }
    }
  }, [form, editingNode, activeTab, data]);

  // 处理拖拽结束
  const handleDrop = useCallback(
    async (info) => {
      const { dragNode, node, dropPosition, dropToGap } = info;

      try {
        // 检查拖拽有效性
        if (dragNode.key === node.key) return;

        // 不能拖拽到自己的子节点
        const isChildOfDragged = (targetKey, sourceKey) => {
          return targetKey.startsWith(sourceKey + "-");
        };

        if (isChildOfDragged(node.key, dragNode.key)) {
          message.warning("不能移动到自己的子分类下");
          return;
        }

        const dragKey = dragNode.key;
        const dropKey = node.key;

        // 计算新的层级
        let newLevel;
        if (dropToGap) {
          // 移动到同级
          newLevel = node.level || 1;
        } else {
          // 移动到子级
          newLevel = (node.level || 1) + 1;
          if (newLevel > 3) {
            message.warning("分类层级不能超过3层");
            return;
          }
        }

        const res = await reorderCategory({
          dragKey,
          dropKey,
          dropPosition,
          dropToGap,
          type: activeTab,
        });
        if (res.success) {
          setData(res.data);
          message.success("移动成功");
        }
      } catch (error) {
        message.error("移动失败：" + error.message);
      }
    },
    [activeTab]
  );

  // 处理展开/收起
  const handleExpand = useCallback((expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  }, []);

  // Tab切换
  const handleTabChange = useCallback((key) => {
    setActiveTab(key);
    setExpandedKeys([]);
    setAutoExpandParent(true);
  }, []);

  return (
    <div className="category-management">
      <div className="category-header">
        <h2 className="page-title">分类管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleAdd()}
          className="add-category-btn"
        >
          添加一级分类
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        className="category-tabs"
        size="large"
      >
        <TabPane
          tab={
            <span className="tab-label income-tab">
              <MoneyCollectOutlined />
              收入分类
            </span>
          }
          key="income"
        >
          <div className="tree-container">
            {data.length > 0 ? (
              <Tree
                treeData={data}
                titleRender={renderTreeNode}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onExpand={handleExpand}
                draggable={{
                  icon: false,
                  nodeDraggable: () => true,
                }}
                onDrop={handleDrop}
                className="category-tree"
                blockNode
              />
            ) : (
              <div className="empty-state">
                <MoneyCollectOutlined className="empty-icon" />
                <p>暂无收入分类，点击上方按钮添加</p>
              </div>
            )}
          </div>
        </TabPane>
        <TabPane
          tab={
            <span className="tab-label expense-tab">
              <ShoppingOutlined />
              支出分类
            </span>
          }
          key="expense"
        >
          <div className="tree-container">
            {data.length > 0 ? (
              <Tree
                treeData={data}
                titleRender={renderTreeNode}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onExpand={handleExpand}
                draggable={{
                  icon: false,
                  nodeDraggable: () => true,
                }}
                onDrop={handleDrop}
                className="category-tree"
                blockNode
              />
            ) : (
              <div className="empty-state">
                <ShoppingOutlined className="empty-icon" />
                <p>暂无支出分类，点击上方按钮添加</p>
              </div>
            )}
          </div>
        </TabPane>
      </Tabs>

      <Modal
        title={editingNode?.isNew ? "添加分类" : "编辑分类"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingNode(null);
          form.resetFields();
        }}
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
    </div>
  );
};

export default Categorie;

import { useState, useCallback, useEffect } from "react";
import { message, Form } from "antd";
import {
  addCategory,
  getCatrgories,
  updateCategory,
  deleteCategory,
  reorderCategory,
} from "@/app-setting/category/services";

const useCategoryManagement = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("income");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNode, setEditingNode] = useState({});
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [data, setData] = useState([]);

  // 数据获取
  const fetchData = useCallback(async () => {
    try {
      const res = await getCatrgories({ type: activeTab });
      setData(res.data || []);
    } catch (error) {
      message.error(error.message);
    }
  }, [activeTab]);

  // 初始化加载和tab切换时获取数据
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  // Tab切换
  const handleTabChange = useCallback((key) => {
    setActiveTab(key);
    setExpandedKeys([]);
    setAutoExpandParent(true);
  }, []);

  // 处理展开/收起
  const handleExpand = useCallback((expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  }, []);

  // 处理添加
  const handleAdd = useCallback(
    (parentKey = "", level = 1) => {
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
    [activeTab]
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
            newData.push({ ...newNode, key: res.data.key });
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
      setEditingNode({});
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

        // 添加子节点深度检查
        const getMaxDepth = (nodeData, currentDepth = 0) => {
          if (!nodeData.children || nodeData.children.length === 0) {
            return currentDepth;
          }
          return Math.max(
            ...nodeData.children.map((child) =>
              getMaxDepth(child, currentDepth + 1)
            )
          );
        };
        const dragNodeMaxDepth = getMaxDepth(dragNode);

        // 计算新的层级
        if (!dropToGap) {
          // 移动到子级时检查
          const targetLevel = (node.level || 1) + 1;
          if (targetLevel + dragNodeMaxDepth > 3) {
            message.warning("移动会导致子分类层级超过3层限制");
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

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingNode({});
    form.resetFields();
  };

  return {
    activeTab,
    data,
    expandedKeys,
    autoExpandParent,
    isModalVisible,
    editingNode,
    form,
    handleTabChange,
    handleExpand,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleDrop,
    handleCancel,
  };
};

export default useCategoryManagement;

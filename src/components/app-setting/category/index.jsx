import React, { useCallback } from "react";
import { Tree, Tabs } from "antd";
import { MoneyCollectOutlined, ShoppingOutlined } from "@ant-design/icons";
import useCategoryManagement from "./useCategoryManagement";
import CategoryModal from "./modal";
import TreeNode from "./tree-node";
import SettingHeader from "#/setting-header";
import "./index.less";

const { TabPane } = Tabs;

const Category = () => {
  const {
    data,
    activeTab,
    expandedKeys,
    autoExpandParent,
    handleExpand,
    handleTabChange,
    handleAdd,
    handleEdit,
    handleDelete,
    handleDrop,
    handleSubmit,
    form,
    isModalVisible,
    editingNode,
    handleCancel,
  } = useCategoryManagement();

  // 树节点标题渲染
  const renderTreeNode = useCallback(
    (nodeData) => {
      return (
        <TreeNode
          nodeData={nodeData}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      );
    },
    [handleAdd, handleDelete, handleEdit]
  );

  return (
    <div className="category-management">
      <SettingHeader title="分类" handleAdd={handleAdd} />
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
      <CategoryModal
        onSubmit={handleSubmit}
        form={form}
        visible={isModalVisible}
        editingNode={editingNode}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default Category;

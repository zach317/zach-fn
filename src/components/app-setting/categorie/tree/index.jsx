import React from "react";
import { Tree } from "antd";
import PropTypes from "prop-types";

const CategoryTree = ({
  data,
  renderTreeNode,
  expandedKeys,
  autoExpandParent,
  onExpand,
  onDrop,
  emptyContent,
}) => {
  return (
    <div className="tree-container">
      {data.length > 0 ? (
        <Tree
          treeData={data}
          titleRender={renderTreeNode}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onExpand={onExpand}
          draggable={{
            icon: false,
            nodeDraggable: () => true,
          }}
          onDrop={onDrop}
          className="category-tree"
          blockNode
        />
      ) : (
        <div className="empty-state">{emptyContent}</div>
      )}
    </div>
  );
};

CategoryTree.propTypes = {
  data: PropTypes.array.isRequired,
  renderTreeNode: PropTypes.func.isRequired,
  expandedKeys: PropTypes.array,
  autoExpandParent: PropTypes.bool,
  onExpand: PropTypes.func,
  onDrop: PropTypes.func,
  emptyContent: PropTypes.node,
};

CategoryTree.defaultProps = {
  expandedKeys: [],
  autoExpandParent: false,
  onExpand: () => {},
  onDrop: () => {},
  emptyContent: null,
};

export default React.memo(CategoryTree);

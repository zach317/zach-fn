import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  Button,
  DatePicker,
  Input,
  Collapse,
  Tag,
  InputNumber,
  Radio,
  Switch,
  Tree,
  message,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  DownOutlined,
  AppstoreOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import crypto from "utils/crypto";
import { getAllCatrgories, getTags } from "../services";

import "./index.less";

const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const Filter = ({ setCurrentPage, getList }) => {
  const [filters, setFilters] = useState({
    categories: [],
    tags: [],
    dateRange: null,
    description: "",
    amountRange: [],
    transactionType: "all",
  });
  const [filterCollapsed, setFilterCollapsed] = useState(true);
  const [showCategories, setShowCategories] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  // 重置筛选
  const resetFilters = () => {
    setFilters({
      categories: [],
      tags: [],
      dateRange: null,
      description: "",
      amountRange: [],
      transactionType: "all",
    });
    setCurrentPage(1);
    getList();
  };

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

  const getCategories = useCallback(async () => {
    const categoryStorage = localStorage.getItem("categories");

    if (categoryStorage) {
      const categories = crypto.decrypt(categoryStorage);
      // 验证数据有效性，若无效则重新获取
      if (categories.expense && categories.income) {
        setCategories([...categories.income, ...categories.expense]);
      } else {
        await handleFetchAndCacheCategories();
      }
    } else {
      await handleFetchAndCacheCategories();
    }
  }, []);

  const handleFetchAndCacheCategories = async () => {
    try {
      const res = await getAllCatrgories();
      if (res.success) {
        const { income, expense } = res.data;
        const allCategories = [...income, ...expense];

        setCategories(allCategories);
        localStorage.setItem("categories", crypto.encrypt(res.data));
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const init = useCallback(async () => {
    getCategories();
    getTagList();
  }, [getCategories, getTagList]);

  useEffect(() => {
    init();
  }, [init]);

  // 将分类数据转换为Tree组件需要的格式
  const getCategoryTreeData = () => {
    return categories.map((category) => ({
      title: category.title,
      key: category.key,
      value: category.key,
      children: category.children
        ? category.children.map((child) => ({
            title: child.title,
            key: child.key,
            value: child.key,
            children: child.children
              ? child.children.map((grandChild) => ({
                  title: grandChild.title,
                  key: grandChild.key,
                  value: grandChild.key,
                }))
              : undefined,
          }))
        : undefined,
    }));
  };

  // 将标签数据转换为Tree组件需要的格式
  const getTagTreeData = () => {
    return tags.map((tag) => ({
      title: `#${tag.name}`,
      key: tag.id,
      value: tag.id,
      children: tag.children
        ? tag.children.map((child) => ({
            title: `#${child.name}`,
            key: child.id,
            value: child.id,
          }))
        : undefined,
    }));
  };

  // 处理分类树选择
  const handleCategoryTreeSelect = (checkedKeys) => {
    setFilters((prev) => ({
      ...prev,
      categories: checkedKeys,
    }));
  };

  // 处理标签树选择
  const handleTagTreeSelect = (checkedKeys) => {
    setFilters((prev) => ({
      ...prev,
      tags: checkedKeys,
    }));
  };

  // 获取选中的分类名称
  const getSelectedCategoryNames = () => {
    const names = [];
    const findNames = (categories, selectedIds) => {
      categories.forEach((category) => {
        if (selectedIds.includes(category.id)) {
          names.push(category.name);
        }
        if (category.children) {
          findNames(category.children, selectedIds);
        }
      });
    };
    findNames(categories, filters.categories);
    return names;
  };

  // 获取选中的标签名称
  const getSelectedTagNames = () => {
    const names = [];
    const findNames = (tags, selectedIds) => {
      tags.forEach((tag) => {
        if (selectedIds.includes(tag.id)) {
          names.push(tag.name);
        }
        if (tag.children) {
          findNames(tag.children, selectedIds);
        }
      });
    };
    findNames(tags, filters.tags);
    return names;
  };

  return (
    <Card className="filter-card" style={{ marginBottom: "24px" }}>
      <Collapse
        ghost
        activeKey={filterCollapsed ? [] : ["filters"]}
        onChange={(key) => setFilterCollapsed(key.length === 0)}
      >
        <Panel
          header={
            <div className="filter-header">
              <FilterOutlined />
              <span>筛选条件</span>
              <div className="filter-summary">
                {filters.categories?.length > 0 && (
                  <Tag size="small">分类: {filters.categories?.length}</Tag>
                )}
                {filters.tags?.length > 0 && (
                  <Tag size="small">标签: {filters.tags?.length}</Tag>
                )}
                {filters.dateRange && <Tag size="small">日期范围</Tag>}
                {filters.description && <Tag size="small">关键词</Tag>}
                {(!!filters.amountRange?.[0] || !!filters.amountRange?.[1]) && (
                  <Tag size="small">金额范围</Tag>
                )}
                {filters.transactionType !== "all" && (
                  <Tag size="small">类型</Tag>
                )}
              </div>
            </div>
          }
          key="filters"
          showArrow={false}
        >
          <div className="filter-container">
            <div className="filter-grid">
              {/* 收支类型 */}
              <div className="filter-group">
                <label className="filter-label">收支类型</label>
                <Radio.Group
                  value={filters.transactionType}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      transactionType: e.target.value,
                    }))
                  }
                >
                  <Radio value="all">全部</Radio>
                  <Radio value="income">收入</Radio>
                  <Radio value="expense">支出</Radio>
                </Radio.Group>
              </div>

              {/* 金额范围 */}
              <div className="filter-group">
                <label className="filter-label">金额范围</label>
                <div className="amount-range-container">
                  <InputNumber
                    min={0}
                    max={filters.amountRange[1]}
                    value={filters.amountRange[0]}
                    onChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        amountRange: [value || 0, prev.amountRange[1]],
                      }))
                    }
                    style={{ width: "100px" }}
                    placeholder="最小值"
                  />
                  <span className="range-separator">-</span>
                  <InputNumber
                    min={filters.amountRange[0]}
                    max={100000}
                    value={filters.amountRange[1]}
                    onChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        amountRange: [prev.amountRange[0], value || 10000],
                      }))
                    }
                    style={{ width: "100px" }}
                    placeholder="最大值"
                  />
                </div>
              </div>

              {/* 时间范围 */}
              <div className="filter-group">
                <label className="filter-label">时间范围</label>
                <RangePicker
                  value={filters.dateRange}
                  onChange={(dates) =>
                    setFilters((prev) => ({ ...prev, dateRange: dates }))
                  }
                  style={{ width: "100%" }}
                  placeholder={["开始日期", "结束日期"]}
                />
              </div>

              {/* 关键词搜索 */}
              <div className="filter-group">
                <label className="filter-label">备注搜索</label>
                <Input
                  placeholder="搜索备注"
                  value={filters.description}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, description: e.target.value }))
                  }
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </div>
            </div>

            {/* 分类筛选开关 */}
            <div className="filter-group">
              <div className="filter-toggle">
                <div className="toggle-header">
                  <AppstoreOutlined />
                  <span className="filter-label">按分类筛选</span>
                  <Switch
                    checked={showCategories}
                    onChange={(checked) => {
                      setShowCategories(checked);
                      if (!checked) {
                        setFilters((prev) => ({ ...prev, categories: [] }));
                      }
                    }}
                    size="small"
                  />
                </div>
                {showCategories && (
                  <div className="selected-items">
                    {getSelectedCategoryNames().map((name) => (
                      <Tag key={name} size="small" color="blue">
                        {name}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>

              {showCategories && (
                <div className="tree-container-filter">
                  <Tree
                    checkable
                    checkedKeys={filters.categories}
                    onCheck={handleCategoryTreeSelect}
                    treeData={getCategoryTreeData()}
                    height={200}
                    showLine={{ showLeafIcon: false }}
                    switcherIcon={<DownOutlined />}
                  />
                </div>
              )}
            </div>

            {/* 标签筛选开关 */}
            <div className="filter-group">
              <div className="filter-toggle">
                <div className="toggle-header">
                  <TagsOutlined />
                  <span className="filter-label">按标签筛选</span>
                  <Switch
                    checked={showTags}
                    onChange={(checked) => {
                      setShowTags(checked);
                      if (!checked) {
                        setFilters((prev) => ({ ...prev, tags: [] }));
                      }
                    }}
                    size="small"
                  />
                </div>
                {showTags && (
                  <div className="selected-items">
                    {getSelectedTagNames().map((name) => (
                      <Tag key={name} size="small" color="green">
                        #{name}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>

              {showTags && (
                <div className="tree-container-filter">
                  <Tree
                    checkable
                    checkedKeys={filters.tags}
                    onCheck={handleTagTreeSelect}
                    treeData={getTagTreeData()}
                    height={200}
                    showLine={{ showLeafIcon: false }}
                    switcherIcon={<DownOutlined />}
                  />
                </div>
              )}
            </div>

            <div className="filter-actions">
              <Button onClick={resetFilters}>重置</Button>
              <Button type="primary" onClick={() => getList(filters)}>
                确定
              </Button>
            </div>
          </div>
        </Panel>
      </Collapse>
    </Card>
  );
};

export default Filter;

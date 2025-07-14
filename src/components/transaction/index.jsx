import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Pagination, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TransactionFilter from "./filter";
import TransactionList from "./list";
import TransactionModal from "./modal";
import { getTransactionList } from "./services";
import { formatAmount } from "utils/helpers";

import "./index.less";

const Transaction = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [list, setList] = useState([]);
  const [totalStats, setTotalStats] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const getList = useCallback(
    async (filters) => {
      try {
        const res = await getTransactionList({
          page: currentPage,
          pageSize,
          ...filters,
        });
        if (res.success) {
          setList(res.data);
          setTotalStats(res.totalStats);
        }
      } catch (error) {
        message.warning(error.message);
      }
    },
    [currentPage, pageSize]
  );

  useEffect(() => {
    getList();
  }, [getList]);

  // 打开新增弹框
  const handleAdd = () => {
    setEditingTransaction(null);
    setModalVisible(true);
  };

  // 打开编辑弹框
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setModalVisible(true);
  };

  // 关闭弹框
  const handleModalClose = () => {
    setModalVisible(false);
    setEditingTransaction(null);
  };

  return (
    <div className="transaction-page">
      <div className="page-title">账单管理</div>

      {/* 筛选区域 */}
      <TransactionFilter setCurrentPage={setCurrentPage} getList={getList} />
      {/* 汇总卡片 */}
      <div className="summary-cards">
        <Card className="summary-card income">
          <div className="summary-content">
            <div className="summary-label">总收入</div>
            <div className="summary-amount income">
              {formatAmount(totalStats.totalIncome)}
            </div>
          </div>
        </Card>

        <Card className="summary-card expense">
          <div className="summary-content">
            <div className="summary-label">总支出</div>
            <div className="summary-amount expense">
              {formatAmount(totalStats.totalExpense)}
            </div>
          </div>
        </Card>

        <Card className="summary-card balance">
          <div className="summary-content">
            <div className="summary-label">差额</div>
            <div
              className={`summary-amount ${
                totalStats.balance >= 0 ? "positive" : "negative"
              }`}
            >
              {formatAmount(totalStats.balance)}
            </div>
          </div>
        </Card>
      </div>

      {/* 悬浮新增按钮 */}
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        size="large"
        className="floating-add-btn"
        onClick={handleAdd}
      />

      {/* 交易列表 */}
      <TransactionList list={list} onEdit={handleEdit} />

      {/* 分页 */}
      {totalStats.total > pageSize && (
        <div className="pagination-container">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalStats.total}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) =>
              `共 ${total} 条记录，当前显示 ${range[0]}-${range[1]} 条`
            }
          />
        </div>
      )}
      <TransactionModal
        visible={modalVisible}
        onClose={handleModalClose}
        editData={editingTransaction}
      />
    </div>
  );
};

export default Transaction;

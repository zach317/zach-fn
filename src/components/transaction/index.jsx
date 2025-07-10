import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Tag, Empty, Pagination, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import TransactionFilter from "./filter";
import { getTransactionList } from "./services";
import dayjs from "dayjs";
import "./index.less";

const Transaction = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [list, setList] = useState([]);
  const [totalStats, setTotalStats] = useState({});

  const getList = useCallback(async () => {
    try {
      const res = await getTransactionList({ page: currentPage, pageSize });
      if (res.success) {
        setList(res.data);
        setTotalStats(res.totalStats);
      }
    } catch (error) {
      message.warning(error.message);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    getList();
  }, [getList]);

  // 格式化金额
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
    }).format(Math.abs(amount));
  };

  return (
    <div className="transaction-page">
      <div className="page-title">账单管理</div>

      {/* 筛选区域 */}
      {/* <TransactionFilter setCurrentPage={setCurrentPage} /> */}
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
        onClick={() => console.log("新增交易")}
      />

      {/* 交易列表 */}
      <div className="transaction-list">
        {list.length === 0 ? (
          <Card>
            <Empty description="暂无交易记录" />
          </Card>
        ) : (
          list.map(({ date, transactions, summary }) => (
            <Card key={date} className="day-card">
              <div className="day-header">
                <div className="day-info">
                  <span className="day-date">
                    {dayjs(date).format("MM月DD日")}
                  </span>
                  <span className="day-weekday">
                    {dayjs(date).format("dddd")}
                  </span>
                </div>
                <div className="day-summary">
                  <span className="day-income">
                    收入 {formatAmount(summary.income)}
                  </span>
                  <span className="day-expense">
                    支出 {formatAmount(summary.expense)}
                  </span>
                  <span
                    className={`day-balance ${
                      summary.balance >= 0 ? "positive" : "negative"
                    }`}
                  >
                    {summary.balance >= 0 ? "+" : ""}
                    {formatAmount(summary.balance)}
                  </span>
                </div>
              </div>

              <div className="transaction-items">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-left">
                      <div
                        className="category-icon"
                        style={{
                          backgroundColor:
                            transaction.type === "expense"
                              ? "#dc3545"
                              : "#28a745",
                        }}
                      >
                        {transaction.category.name.charAt(0)}
                      </div>
                      <div className="transaction-info">
                        <div className="transaction-category">
                          {transaction.category.name}
                        </div>
                        <div className="transaction-note">
                          {transaction.note}
                        </div>
                        <div className="transaction-tags">
                          {transaction.tags.map((tag) => (
                            <Tag
                              key={tag}
                              size="small"
                              className="transaction-tag"
                            >
                              #{tag}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="transaction-right">
                      <div className={`transaction-amount ${transaction.type}`}>
                        {transaction.type === "income" ? "+" : "-"}
                        {formatAmount(transaction.amount)}
                      </div>
                      {/* <div className="transaction-time">{transaction.time}</div> */}
                      <div className="transaction-actions">
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => console.log("编辑", transaction.id)}
                        />
                        <Button
                          type="text"
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => console.log("删除", transaction.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))
        )}
      </div>

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
    </div>
  );
};

export default Transaction;

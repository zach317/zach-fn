import React from "react";
import { Card, Button, Tag, Empty, message, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { formatAmount, hexToRGBA } from "utils/helpers";
import dayjs from "dayjs";
import { deleteTransaction } from "../services";
import "./index.less";

const TransactionList = ({ list, onEdit, onSuccess }) => {
  const handleDelete = async (transactionId) => {
    try {
      await deleteTransaction({ transactionId });
      message.success("删除成功");
      onSuccess?.();
    } catch (error) {
      message.error(error.message || "删除失败");
    }
  };

  return (
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
                      <div className="transaction-note">{transaction.note}</div>
                      <div className="transaction-tags">
                        {transaction.tags.map((tag) => (
                          <Tag
                            key={tag.id}
                            size="small"
                            className="transaction-tag"
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
                    </div>
                  </div>

                  <div className="transaction-right">
                    <div className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === "income" ? "+" : "-"}
                      {formatAmount(transaction.amount)}
                    </div>
                    <div className="transaction-actions">
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(transaction)}
                      />
                      <Popconfirm
                        title="确认删除"
                        description="删除后无法恢复，确定要删除这条交易记录吗？"
                        onConfirm={() => handleDelete(transaction.id)}
                        okText="确定"
                        cancelText="取消"
                        okType="danger"
                      >
                        <Button
                          type="text"
                          size="small"
                          icon={<DeleteOutlined />}
                        />
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default TransactionList;

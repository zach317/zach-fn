import React from "react";
import { Card, Button, Tag, Empty } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { formatAmount } from "utils/helpers";
import dayjs from "dayjs";
import "./index.less";

const TransactionList = ({ list }) => {
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
  );
};

export default TransactionList;

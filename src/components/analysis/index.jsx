import React from "react";
import CategoryRadio from "./category-ratio";
import IncomeAndExpense from "./income-and-expense";
import Rank from "./rank";
import CalendarChart from "./calender";

const FinancialAnalysis = () => {
  return (
    <div
      style={{
        padding: "24px",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
      }}
    >
      {/* 页面标题和控制区 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#333",
              fontSize: "28px",
              fontWeight: 600,
            }}
          >
            财务分析中心
          </h1>
          <p style={{ margin: "8px 0 0 0", color: "#666" }}>
            深入了解您的财务状况
          </p>
        </div>
      </div>

      {/* 主要图表区域 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {/* 收支趋势图 */}
        <IncomeAndExpense />

        {/* 消费分类饼图 */}
        <CategoryRadio />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 3fr",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        <CalendarChart />
        <Rank />
      </div>
    </div>
  );
};

export default FinancialAnalysis;

import React, { useState, useCallback, useEffect } from "react";
import CategoryRadio from "./category-ratio";
import IncomeAndExpense from "./income-and-expense";
import Rank from "./rank";
import { getCategoryRank } from "./services";

const FinancialAnalysis = () => {
  const [data, setData] = useState({});
  const getData = useCallback(async () => {
    const res = await getCategoryRank();
    if (res.success) {
      setData(res.data);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);
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

      {/*TODO: 核心指标卡片 */}

      {/* 主要图表区域 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
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
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        <Rank type="expense" data={data.expense} />
        <Rank type="income" data={data.income} />
        {/* TODO: 日历图，分类排行等其他图表 */}
      </div>
    </div>
  );
};

export default FinancialAnalysis;

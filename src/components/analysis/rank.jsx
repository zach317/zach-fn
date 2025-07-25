import React, { useEffect, useRef } from "react";
import { Card } from "antd";
import { OrderedListOutlined } from "@ant-design/icons";
import * as echarts from "echarts";

const Rank = ({ type = "expense", data = [] }) => {
  // 图表refs
  const categoryBarRef = useRef(null);

  // 初始化分类条形图
  useEffect(() => {
    if (categoryBarRef.current) {
      const chart = echarts.init(categoryBarRef.current);
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
        },
        grid: {
          left: "4%",
          bottom: "4%",
          top: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          axisLabel: { color: "#999" },
          splitLine: { lineStyle: { color: "#f0f0f0" } },
        },
        yAxis: {
          type: "category",
          data: data.map((item) => item.name),
          axisLabel: { color: "#666" },
          inverse: true,
        },
        series: [
          {
            type: "bar",
            data: data.map((item) => ({
              value: item.amount,
              itemStyle: { color: item.color },
            })),
            barWidth: "80%",
            label: {
              show: true,
              position: "right",
              formatter: "¥{c}",
            },
          },
        ],
      };
      chart.setOption(option);
      return () => chart.dispose();
    }
  }, [data]);

  return (
    <Card
      title={
        <>
          <OrderedListOutlined style={{ color: "#0eb0c9", marginRight: 8 }} />
          {`分类${type === "income" ? "收入" : "支出"}排行`}
        </>
      }
      style={{
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      }}
    >
      <div ref={categoryBarRef} style={{ height: "320px" }} />
    </Card>
  );
};

export default Rank;

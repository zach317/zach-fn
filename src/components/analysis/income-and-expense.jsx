import React, { useEffect, useRef, useState } from "react";
import { Card } from "antd";
import { LineChartOutlined } from "@ant-design/icons";
import * as echarts from "echarts";
import { getIncomeAndExpense } from "./services";
import dayjs from "dayjs";

const IncomeAndExpense = () => {
  const [data, setData] = useState([]);
  const getData = async () => {
    const res = await getIncomeAndExpense();
    setData(res.data);
    return res;
  };

  useEffect(() => {
    getData();
  }, []);

  const trendChartRef = useRef(null);

  useEffect(() => {
    if (!trendChartRef.current) return;
    const chart = echarts.init(trendChartRef.current);
    chart.setOption({
      tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
      legend: { data: ["收入", "支出", "净收入"] },
      grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.map((d) => dayjs(d.date).format("MM/DD")),
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "收入",
          type: "line",
          smooth: true,
          data: data.map((d) => d.income),
          lineStyle: { color: "#28a745" },
        },
        {
          name: "支出",
          type: "line",
          smooth: true,
          data: data.map((d) => d.expense),
          lineStyle: { color: "#dc3545" },
        },
        {
          name: "净收入",
          type: "line",
          smooth: true,
          data: data.map((d) => d.income - d.expense),
          lineStyle: { color: "#0eb0c9", type: "dashed" },
        },
      ],
    });

    return () => chart.dispose();
  }, [data]);

  return (
    <Card
      title={
        <>
          <LineChartOutlined style={{ color: "#0eb0c9", marginRight: 8 }} />
          收支趋势
        </>
      }
      style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
    >
      <div ref={trendChartRef} style={{ height: 350 }} />
    </Card>
  );
};

export default IncomeAndExpense;

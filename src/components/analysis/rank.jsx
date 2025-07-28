import React, { useEffect, useRef, useState, useCallback } from "react";
import { Card, DatePicker, Select } from "antd";
import { OrderedListOutlined } from "@ant-design/icons";
import { getCategoryRank } from "./services";
import * as echarts from "echarts";
import dayjs from "dayjs";

const Rank = () => {
  // 图表refs
  const categoryBarRef = useRef(null);

  const [data, setData] = useState([]);
  const [type, setType] = useState("expense");
  const [rangeType, setRangeType] = useState("all"); // all = 不筛选
  const [dateRange, setDateRange] = useState([]);

  const getData = useCallback(async () => {
    const now = dayjs();
    let startDate = null,
      endDate = null;

    switch (rangeType) {
      case "thisMonth":
        startDate = now.startOf("month");
        endDate = now.endOf("month");
        break;
      case "lastMonth":
        startDate = now.subtract(1, "month").startOf("month");
        endDate = now.subtract(1, "month").endOf("month");
        break;
      case "ytd":
        startDate = now.startOf("year");
        endDate = now;
        break;
      case "lastYear":
        startDate = now.subtract(1, "year").startOf("year");
        endDate = now.subtract(1, "year").endOf("year");
        break;
      case "custom":
        if (dateRange.length === 2) {
          startDate = dayjs(dateRange[0]);
          endDate = dayjs(dateRange[1]);
        } else {
          return;
        }
        break;
      default:
        break;
    }
    const res = await getCategoryRank({
      type,
      startDate: startDate?.format("YYYY-MM-DD"),
      endDate: endDate?.format("YYYY-MM-DD"),
    });
    if (res.success) {
      setData(res.data);
    }
  }, [dateRange, rangeType, type]);

  useEffect(() => {
    getData();
  }, [getData]);

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
          分类排行
        </>
      }
      extra={
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "flex-end",
          }}
        >
          {/* 类型选择 */}
          <Select
            value={type}
            onChange={setType}
            options={[
              { label: "支出", value: "expense" },
              { label: "收入", value: "income" },
            ]}
            size="small"
            style={{ width: 80 }}
          />

          {/* 时间范围选择 */}
          <Select
            value={rangeType}
            onChange={(val) => setRangeType(val)}
            options={[
              { label: "不限时间", value: "all" },
              { label: "本月", value: "thisMonth" },
              { label: "上月", value: "lastMonth" },
              { label: "年初至今", value: "ytd" },
              { label: "去年", value: "lastYear" },
              { label: "自定义", value: "custom" },
            ]}
            size="small"
            style={{ width: 100 }}
          />

          {/* 日期范围选择器：仅在选择自定义时显示 */}
          {rangeType === "custom" && (
            <DatePicker.RangePicker
              value={dateRange}
              onChange={(val) => setDateRange(val || [])}
              size="small"
            />
          )}
        </div>
      }
      style={{
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      }}
    >
      <div ref={categoryBarRef} style={{ height: 400 }} />
    </Card>
  );
};

export default Rank;

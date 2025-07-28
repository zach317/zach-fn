import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, Button, Tag, Select, DatePicker } from "antd";
import { PieChartOutlined } from "@ant-design/icons";
import { getCategoryRatio } from "./services";
import dayjs from "dayjs";

import * as echarts from "echarts";

const CategoryRadio = () => {
  const categoryPieRef = useRef(null);
  const [categoryLevel, setCategoryLevel] = useState([]); // 路径数组
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

    const res = await getCategoryRatio({
      type,
      startDate: startDate?.format("YYYY-MM-DD"),
      endDate: endDate?.format("YYYY-MM-DD"),
    });

    if (res.success) setData(res.data);
  }, [dateRange, rangeType, type]);

  useEffect(() => {
    getData();
  }, [getData]);
  // 根据 categoryLevel 计算当前节点
  const findCurrentCategory = useCallback(
    (path) => {
      let node = { children: data };
      for (const name of path) {
        if (!node.children) return null;
        node = node.children.find((item) => item.name === name);
        if (!node) return null;
      }
      return node;
    },
    [data]
  );

  useEffect(() => {
    if (!categoryPieRef.current) return;
    const chart = echarts.init(categoryPieRef.current);

    // 根据当前路径计算节点 & 数据
    const category = findCurrentCategory(categoryLevel);
    const currentData = category?.children || data;

    const option = {
      tooltip: { trigger: "item", formatter: "{a} <br/>{b}: ¥{c} ({d}%)" },
      legend: { bottom: 10, textStyle: { color: "#666" } },
      series: [
        {
          name: category?.name || "消费分类",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["50%", "45%"],
          data: currentData.map((item) => ({
            value: item.amount,
            name: item.name,
            itemStyle: { color: item.color },
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: { formatter: "{b}\n¥{c}", fontSize: 12 },
        },
      ],
    };

    chart.setOption(option);

    // 点击事件：仅在前两层可下钻
    chart.on("click", (params) => {
      if (categoryLevel.length >= 2) return; // 第三层不再下钻
      const clickedItem = currentData.find((item) => item.name === params.name);
      if (clickedItem?.children) {
        setCategoryLevel((prev) => [...prev, clickedItem.name]);
      }
    });

    return () => chart.dispose();
  }, [categoryLevel, data, findCurrentCategory]);

  /* ---------- 渲染 ---------- */
  return (
    <Card
      title={
        <>
          <PieChartOutlined style={{ color: "#0eb0c9", marginRight: 4 }} />
          分类占比
        </>
      }
      style={{ borderRadius: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
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
    >
      {/* 返回按钮保留 */}
      {categoryLevel.length > 0 && (
        <Button
          size="small"
          onClick={() => setCategoryLevel((prev) => prev.slice(0, -1))}
          style={{ borderRadius: "8px", position: "absolute", zIndex: 1 }}
        >
          返回
        </Button>
      )}
      <div ref={categoryPieRef} style={{ height: "400px" }} />
      {categoryLevel.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "8px" }}>
          <Tag color="orange" style={{ borderRadius: "12px" }}>
            {categoryLevel.join(" > ")}
          </Tag>
        </div>
      )}
    </Card>
  );
};

export default CategoryRadio;

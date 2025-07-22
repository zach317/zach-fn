import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, Button, Tag } from "antd";
import { PieChartOutlined } from "@ant-design/icons";
import { getCategoryRatio } from "./services";
import * as echarts from "echarts";

const CategoryRadio = () => {
  const categoryPieRef = useRef(null);
  const [categoryLevel, setCategoryLevel] = useState([]); // 路径数组
  const [data, setData] = useState([]);

  const getData = async () => {
    const res = await getCategoryRatio();
    if (res.success) {
      setData(res.data);
    }
  };

  useEffect(() => {
    getData();
  }, []);
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

  /* ---------- 图表初始化 & 更新 ---------- */
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
          <PieChartOutlined style={{ color: "#0eb0c9", marginRight: 8 }} />
          消费分类占比
        </>
      }
      style={{ borderRadius: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
      extra={
        categoryLevel.length > 0 && (
          <Button
            size="small"
            onClick={() => setCategoryLevel((prev) => prev.slice(0, -1))}
            style={{ borderRadius: "8px" }}
          >
            返回
          </Button>
        )
      }
    >
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

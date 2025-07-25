import React, { useEffect, useRef, useState, useCallback } from "react";
import { Card, Space, Radio, DatePicker, Select, Tooltip } from "antd";
import { LineChartOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import * as echarts from "echarts";
import { getIncomeAndExpense } from "./services";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const IncomeAndExpense = () => {
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [outlierLevel, setOutlierLevel] = useState("none");
  const [rangeType, setRangeType] = useState("thisMonth");
  const [outlierOptions, setOutlierOptions] = useState([
    { label: "不过滤", value: "none" },
    { label: "L1", value: "L1" },
    { label: "L2", value: "L2" },
    { label: "L3", value: "L3" },
  ]);

  const getData = useCallback(
    async (startDate, endDate) => {
      const res = await getIncomeAndExpense({
        startDate: startDate?.format("YYYY-MM-DD"),
        endDate: endDate?.format("YYYY-MM-DD"),
      });
      let filtered = res.data || [];

      // 动态计算并设置下拉选项
      const values = filtered.map((d) => d.income - d.expense);
      const mean = values.reduce((a, b) => a + b, 0) / values.length || 0;
      const sd =
        Math.sqrt(
          values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
            values.length
        ) || 0;

      setOutlierOptions([
        { label: "不过滤", value: "none" },
        { label: `L1（>${(1.5 * sd).toFixed(2)} 元）`, value: "L1" },
        { label: `L2（>${(2 * sd).toFixed(2)} 元）`, value: "L2" },
        { label: `L3（>${(3 * sd).toFixed(2)} 元）`, value: "L3" },
      ]);

      if (outlierLevel !== "none") {
        const multiplier = { L1: 1.5, L2: 2, L3: 3 }[outlierLevel];
        const threshold = multiplier * sd;

        filtered = filtered.filter((d) => {
          const net = d.income - d.expense;
          return Math.abs(net - mean) <= threshold;
        });
      }

      setData(filtered);
    },
    [outlierLevel]
  );

  useEffect(() => {
    let start, end;
    const now = dayjs();

    switch (rangeType) {
      case "thisMonth":
        start = now.startOf("month");
        end = now.endOf("month");
        break;
      case "lastMonth":
        start = now.subtract(1, "month").startOf("month");
        end = now.subtract(1, "month").endOf("month");
        break;
      case "ytd":
        start = dayjs().startOf("year");
        end = dayjs();
        break;
      case "lastYear":
        start = now.subtract(1, "year").startOf("year");
        end = now.subtract(1, "year").endOf("year");
        break;
      case "custom":
        if (dateRange.length === 2) {
          start = dayjs(dateRange[0]);
          end = dayjs(dateRange[1]);
        } else {
          return; // ⛔ 自定义但未选择时间时不请求
        }
        break;
      default:
        return;
    }

    getData(start, end);
  }, [rangeType, dateRange, outlierLevel, getData]);

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
      extra={
        <Space size="middle" wrap>
          {/* 时间范围 */}
          <Radio.Group
            value={rangeType}
            onChange={(e) => setRangeType(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="thisMonth">本月</Radio.Button>
            <Radio.Button value="lastMonth">上月</Radio.Button>
            <Radio.Button value="ytd">年初至今</Radio.Button>
            <Radio.Button value="lastYear">去年</Radio.Button>
            <Radio.Button value="custom">自定义</Radio.Button>
          </Radio.Group>

          {rangeType === "custom" && (
            <DatePicker.RangePicker
              value={dateRange}
              onChange={(val) => setDateRange(val || [])}
              size="small"
            />
          )}

          {/* 离群值过滤 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "#555" }}>离群过滤:</span>
            <Tooltip
              overlayInnerStyle={{ width: 280, lineHeight: 1.6 }}
              title={
                <>
                  <div style={{ marginBottom: 6 }}>
                    离群交易是指在统计上明显偏离其他交易的记录。 我们基于
                    <strong>净收入 = 收入 - 支出</strong>计算标准差
                    σ，并引入过滤等级：
                  </div>
                  <ul style={{ paddingLeft: 20, margin: "4px 0" }}>
                    <li>L1：±1.5σ</li>
                    <li>L2：±2σ</li>
                    <li>L3：±3σ</li>
                  </ul>
                  <div style={{ marginTop: 6 }}>
                    你可以选择过滤离群交易以排除极端干扰，也可以选择不过滤以纵观全局。
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <strong>目的：</strong>
                    <ul style={{ paddingLeft: 20, margin: 0 }}>
                      <li>识别异常消费/收入行为</li>
                      <li>提升均值代表性</li>
                      <li>突出小额交易特征</li>
                    </ul>
                  </div>
                </>
              }
            >
              <QuestionCircleOutlined style={{ color: "#999", fontSize: 16 }} />
            </Tooltip>

            <Select
              value={outlierLevel}
              style={{ width: 200 }}
              onChange={setOutlierLevel}
              options={outlierOptions}
              size="small"
            />
          </div>
        </Space>
      }
      style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
    >
      <div ref={trendChartRef} style={{ height: 350 }} />
    </Card>
  );
};

export default IncomeAndExpense;

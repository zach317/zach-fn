import React, { useEffect, useRef, useState } from "react";
import { Card } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import * as echarts from "echarts";
import { getMonthAmount } from "./services";
import dayjs from "dayjs";

const CalendarChart = () => {
  const calendarRef = useRef(null);

  const [data, setData] = useState([]);

  // 图标布局
  const layouts = [
    [[0, 0]],
    [
      [-0.25, 0],
      [0.25, 0],
    ],
  ];

  const getData = async () => {
    const res = await getMonthAmount();
    if (res.success) {
      setData(res.data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // svg path
  const path =
    "M533.504 268.288q33.792-41.984 71.68-75.776 32.768-27.648 74.24-50.176t86.528-19.456q63.488 5.12 105.984 30.208t67.584 63.488 34.304 87.04 6.144 99.84-17.92 97.792-36.864 87.04-48.64 74.752-53.248 61.952q-40.96 41.984-85.504 78.336t-84.992 62.464-73.728 41.472-51.712 15.36q-20.48 1.024-52.224-14.336t-69.632-41.472-79.872-61.952-82.944-75.776q-26.624-25.6-57.344-59.392t-57.856-74.24-46.592-87.552-21.504-100.352 11.264-99.84 39.936-83.456 65.536-61.952 88.064-35.328q24.576-5.12 49.152-1.536t48.128 12.288 45.056 22.016 40.96 27.648q45.056 33.792 86.016 80.896z";

  // 颜色
  const colorExpense = "#c4332b";
  const colorIncome = "#16B644";

  useEffect(() => {
    if (!calendarRef.current) return;
    const chart = echarts.init(calendarRef.current);

    const yearMonth = dayjs().format("YYYY-MM");

    chart.setOption({
      tooltip: {
        formatter: (params) => {
          const [date, income, expense] = params.value;
          let html = `<div>${date}</div>`;
          if (expense)
            html += `<div style="color:${colorExpense}">支出: ¥${expense}</div>`;
          if (income)
            html += `<div style="color:${colorIncome}">收入: ¥${income}</div>`;
          return html;
        },
      },
      calendar: [
        {
          left: "center",
          top: "middle",
          cellSize: [70, 70],
          yearLabel: { show: false },
          orient: "vertical",
          dayLabel: { firstDay: 1, nameMap: "cn" },
          monthLabel: { show: false },
          range: yearMonth,
        },
      ],
      series: [
        {
          type: "custom",
          coordinateSystem: "calendar",
          renderItem: (params, api) => {
            const cellPoint = api.coord(api.value(0));
            const cellWidth = params.coordSys.cellWidth;
            const cellHeight = params.coordSys.cellHeight;

            const income = api.value(1);
            const expense = api.value(2);

            const items = [];
            if (expense) items.push({ type: "expense" });
            if (income) items.push({ type: "income" });

            if (isNaN(cellPoint[0]) || isNaN(cellPoint[1])) return;

            const layout = items.length === 2 ? layouts[1] : layouts[0];

            const group = {
              type: "group",
              children: items.map((item, idx) => ({
                type: "path",
                shape: { pathData: path, x: -8, y: -8, width: 16, height: 16 },
                position: [
                  cellPoint[0] +
                    echarts.number.linearMap(
                      layout[idx][0],
                      [-0.5, 0.5],
                      [-cellWidth / 2, cellWidth / 2]
                    ),
                  cellPoint[1] +
                    echarts.number.linearMap(
                      layout[idx][1],
                      [-0.5, 0.5],
                      [-cellHeight / 2 + 20, cellHeight / 2]
                    ),
                ],
                style: api.style({
                  fill: item.type === "expense" ? colorExpense : colorIncome,
                }),
              })),
            };

            // 日期数字
            group.children.push({
              type: "text",
              style: {
                x: cellPoint[0],
                y: cellPoint[1] - cellHeight / 2 + 15,
                text: dayjs(api.value(0)).format("DD"),
                fill: "#777",
                textFont: api.font({ fontSize: 14 }),
              },
            });

            return group;
          },
          data,
        },
      ],
    });

    return () => chart.dispose();
  }, [data]);

  return (
    <Card
      title={
        <>
          <CalendarOutlined style={{ color: "#0eb0c9", marginRight: 8 }} />
          收支日历
        </>
      }
      style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
    >
      <div ref={calendarRef} style={{ height: 350 }} />
    </Card>
  );
};

export default CalendarChart;

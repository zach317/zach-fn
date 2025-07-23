import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useOutletContext } from "react-router-dom";

const Home = () => {
  const homeChartRef = useRef(null);
  const { user = {} } = useOutletContext();
  const { id, nickname } = user;

  useEffect(() => {
    if (!homeChartRef.current) return;
    const chart = echarts.init(homeChartRef.current);

    chart.setOption({
      backgroundColor: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [
          { offset: 0, color: "#0eb0c9" }, // 使用项目主色调
          { offset: 0.5, color: "#0a9bb5" }, // 稍深的主色调
          { offset: 1, color: "#087a8a" }, // 更深的主色调
        ],
      },
      graphic: {
        elements: [
          // 顶部装饰线条 - 模仿Header的光效
          {
            type: "rect",
            left: 0,
            top: 0,
            shape: { width: "100%", height: 1 },
            style: {
              fill: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: "transparent" },
                  { offset: 0.5, color: "rgba(255, 255, 255, 0.4)" },
                  { offset: 1, color: "transparent" },
                ],
              },
            },
          },
          // 背景装饰圆圈 - 使用更柔和的效果
          {
            type: "circle",
            left: "center",
            top: "center",
            shape: { r: 200 },
            style: {
              fill: "transparent",
              stroke: "rgba(255, 255, 255, 0.08)",
              lineWidth: 1,
            },
            keyframeAnimation: {
              duration: 8000,
              loop: true,
              keyframes: [
                {
                  percent: 0,
                  style: { scaleX: 0.9, scaleY: 0.9, opacity: 0.3 },
                },
                {
                  percent: 0.5,
                  style: { scaleX: 1.1, scaleY: 1.1, opacity: 0.6 },
                },
                {
                  percent: 1,
                  style: { scaleX: 0.9, scaleY: 0.9, opacity: 0.3 },
                },
              ],
            },
          },
          // 主标题 - 调整为与Header风格一致
          {
            type: "text",
            left: "center",
            top: "35%",
            style: {
              text: id ? `Hello, ${nickname}` : "Hey! Welcome!",
              fontSize: 80,
              fontWeight: "600", // 与Header一致的字重
              fontFamily: "'Poppins', 'Arial', sans-serif", // 统一英文字体
              lineDash: [0, 700],
              lineDashOffset: 0,
              fill: "transparent",
              stroke: "#ffdd57", // 使用Header的悬停色
              lineWidth: 2.5,
              textAlign: "center",
              textVerticalAlign: "middle",
              shadowColor: "rgba(255, 221, 87, 0.25)",
              shadowBlur: 12,
              shadowOffsetY: 3,
            },
            keyframeAnimation: {
              duration: 4000,
              loop: true,
              delay: 0,
              keyframes: [
                {
                  percent: 0,
                  style: {
                    lineDash: [0, 700],
                    lineDashOffset: 0,
                    fill: "transparent",
                    opacity: 1,
                  },
                },
                {
                  percent: 0.35,
                  style: {
                    lineDash: [700, 0],
                    lineDashOffset: 700,
                  },
                },
                {
                  percent: 0.65,
                  style: {
                    fill: {
                      type: "linear",
                      x: 0,
                      y: 0,
                      x2: 1,
                      y2: 0,
                      colorStops: [
                        { offset: 0, color: "rgba(255, 255, 255, 0.95)" },
                        { offset: 0.5, color: "#ffdd57" },
                        { offset: 1, color: "rgba(255, 255, 255, 0.95)" },
                      ],
                    },
                    shadowColor: "#ffdd57",
                    shadowBlur: 20,
                  },
                },
                {
                  percent: 0.8,
                  style: {
                    scaleX: 1.02,
                    scaleY: 1.02,
                  },
                },
                {
                  percent: 0.9,
                  style: {
                    scaleX: 1,
                    scaleY: 1,
                  },
                },
                {
                  percent: 1,
                  style: {
                    opacity: 0,
                    scaleX: 0.98,
                    scaleY: 0.98,
                  },
                },
              ],
            },
          },
          // 副标题 - 使用Header的文字颜色
          {
            type: "text",
            left: "center",
            top: "50%",
            style: {
              text: id ? "Nice to see you !" : "We're glad to have you here !",
              fontSize: 42,
              fill: "rgba(255, 255, 255, 0.9)", // 与Header文字色一致
              fontWeight: "400",
              fontFamily: "'Poppins', 'Arial', sans-serif",
              textAlign: "center",
              opacity: 0,
              letterSpacing: 1,
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)", // 与Header一致的文字阴影
            },
            keyframeAnimation: {
              duration: 6000,
              loop: true,
              delay: 1200,
              keyframes: [
                { percent: 0, style: { opacity: 0, y: 15 } },
                { percent: 0.25, style: { opacity: 0.8, y: 0 } },
                { percent: 0.75, style: { opacity: 1, y: 0 } },
                { percent: 0.9, style: { opacity: 0.9, y: -3 } },
                { percent: 1, style: { opacity: 0, y: -8 } },
              ],
            },
          },
          // 底部装饰文字 - 简洁的欢迎信息
          {
            type: "text",
            left: "center",
            top: "70%",
            style: {
              text: id ? "Enjoy your experience !" : "Are you ready to join us ?",
              fontSize: 28,
              fill: "rgba(255, 255, 255, 0.7)",
              fontWeight: "300",
              fontFamily: "'Poppins', 'Arial', sans-serif",
              textAlign: "center",
              textVerticalAlign: "middle",
              opacity: 0,
              letterSpacing: 0.8,
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
            },
            keyframeAnimation: {
              duration: 8000,
              loop: true,
              delay: 2500,
              keyframes: [
                {
                  percent: 0,
                  style: { opacity: 0, scaleX: 0.95, scaleY: 0.95 },
                },
                { percent: 0.3, style: { opacity: 0.7, scaleX: 1, scaleY: 1 } },
                { percent: 0.7, style: { opacity: 0.9 } },
                { percent: 0.85, style: { opacity: 1 } },
                {
                  percent: 1,
                  style: { opacity: 0, scaleX: 1.02, scaleY: 1.02 },
                },
              ],
            },
          },
          // 微妙的浮动装饰 - 更贴合整体设计
          {
            type: "circle",
            left: "15%",
            top: "25%",
            shape: { r: 2 },
            style: {
              fill: "rgba(255, 255, 255, 0.4)",
              opacity: 0,
            },
            keyframeAnimation: {
              duration: 6000,
              loop: true,
              delay: 1000,
              keyframes: [
                { percent: 0, style: { opacity: 0, y: 0 } },
                { percent: 0.5, style: { opacity: 0.6, y: -20 } },
                { percent: 1, style: { opacity: 0, y: -40 } },
              ],
            },
          },
          {
            type: "circle",
            left: "85%",
            top: "35%",
            shape: { r: 3 },
            style: {
              fill: "rgba(255, 221, 87, 0.5)",
              opacity: 0,
            },
            keyframeAnimation: {
              duration: 7000,
              loop: true,
              delay: 2000,
              keyframes: [
                { percent: 0, style: { opacity: 0, y: 0 } },
                { percent: 0.4, style: { opacity: 0.7, y: -25 } },
                { percent: 1, style: { opacity: 0, y: -50 } },
              ],
            },
          },
          {
            type: "circle",
            left: "25%",
            top: "75%",
            shape: { r: 1.5 },
            style: {
              fill: "rgba(255, 255, 255, 0.6)",
              opacity: 0,
            },
            keyframeAnimation: {
              duration: 5000,
              loop: true,
              delay: 3500,
              keyframes: [
                { percent: 0, style: { opacity: 0, y: 0 } },
                { percent: 0.6, style: { opacity: 0.8, y: -30 } },
                { percent: 1, style: { opacity: 0, y: -60 } },
              ],
            },
          },
        ],
      },
    });

    return () => chart.dispose();
  }, [id, nickname]);

  return (
    <div
      ref={homeChartRef}
      style={{
        height: "100vh",
        cursor: "default",
        overflow: "hidden",
        position: "relative",
      }}
    />
  );
};

export default Home;

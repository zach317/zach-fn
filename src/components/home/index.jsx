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
          // 背景装饰圆圈 - 使用更柔和的效果
          {
            type: "circle",
            left: "center",
            top: "center",
            shape: { r: 300 },
            style: {
              fill: "transparent",
              stroke: "rgba(255, 255, 255, 0.05)",
              lineWidth: 1,
            },
          },
          {
            type: "text",
            left: "center",
            top: "30%",
            style: {
              text: id ? `Hello, ${nickname}` : "Hey! Welcome!",
              fontSize: 90,
              fontWeight: "600",
              fontFamily: "'Poppins', 'Arial', sans-serif",
              lineDash: [0, 700],
              lineDashOffset: 0,
              fill: "transparent",
              stroke: "#ffdd57",
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
          {
            type: "text",
            left: "center",
            top: "45%",
            style: {
              text: id ? "Nice to see you !" : "We're glad to have you here",
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
          {
            type: "text",
            left: "center",
            top: "60%",
            style: {
              text: id
                ? "Enjoy your experience ✨"
                : "Let's make something great together",
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
          // 左侧装饰元素组
          // 左上角装饰圆环
          {
            type: "circle",
            left: "10%",
            top: "20%",
            shape: { r: 100 },
            style: {
              fill: "transparent",
              stroke: "rgba(255, 255, 255, 0.25)",
              lineWidth: 3,
              opacity: 0.8,
              shadowColor: "rgba(255, 255, 255, 0.3)",
              shadowBlur: 15,
            },
            keyframeAnimation: {
              duration: 8000,
              loop: true,
              keyframes: [
                {
                  percent: 0,
                  style: {
                    scaleX: 1,
                    scaleY: 1,
                    opacity: 0.8,
                    stroke: "rgba(255, 255, 255, 0.25)",
                  },
                },
                {
                  percent: 0.5,
                  style: {
                    scaleX: 1.2,
                    scaleY: 1.2,
                    opacity: 0.6,
                    stroke: "rgba(255, 221, 87, 0.4)",
                    shadowColor: "rgba(255, 221, 87, 0.5)",
                    shadowBlur: 25,
                  },
                },
                {
                  percent: 1,
                  style: {
                    scaleX: 1,
                    scaleY: 1,
                    opacity: 0.8,
                    stroke: "rgba(255, 255, 255, 0.25)",
                  },
                },
              ],
            },
          },
          // 左侧小装饰圆
          {
            type: "circle",
            left: "8%",
            top: "45%",
            shape: { r: 8 },
            style: {
              fill: "rgba(255, 221, 87, 0.8)",
              opacity: 0,
              shadowColor: "rgba(255, 221, 87, 0.6)",
              shadowBlur: 20,
            },
            keyframeAnimation: {
              duration: 4000,
              loop: true,
              delay: 1000,
              keyframes: [
                {
                  percent: 0,
                  style: {
                    opacity: 0,
                    scaleX: 0.3,
                    scaleY: 0.3,
                    shadowBlur: 5,
                  },
                },
                {
                  percent: 0.4,
                  style: {
                    opacity: 1,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    shadowBlur: 30,
                    shadowColor: "rgba(255, 221, 87, 0.8)",
                  },
                },
                {
                  percent: 0.7,
                  style: {
                    opacity: 0.9,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    shadowBlur: 35,
                  },
                },
                {
                  percent: 1,
                  style: {
                    opacity: 0,
                    scaleX: 0.3,
                    scaleY: 0.3,
                    shadowBlur: 5,
                  },
                },
              ],
            },
          },
          // 左下角装饰线条
          {
            type: "polyline",
            left: "5%",
            top: "70%",
            shape: {
              points: [
                [0, 0],
                [80, -30],
                [160, 0],
                [240, -25],
              ],
            },
            style: {
              stroke: "rgba(255, 255, 255, 0.4)",
              lineWidth: 4,
              fill: "transparent",
              opacity: 0,
              shadowColor: "rgba(255, 255, 255, 0.3)",
              shadowBlur: 10,
            },
            keyframeAnimation: {
              duration: 6000,
              loop: true,
              delay: 2000,
              keyframes: [
                {
                  percent: 0,
                  style: {
                    opacity: 0,
                    stroke: "rgba(255, 255, 255, 0.4)",
                    shadowBlur: 5,
                  },
                },
                {
                  percent: 0.3,
                  style: {
                    opacity: 0.8,
                    stroke: "rgba(255, 221, 87, 0.6)",
                    shadowColor: "rgba(255, 221, 87, 0.4)",
                    shadowBlur: 20,
                  },
                },
                {
                  percent: 0.7,
                  style: {
                    opacity: 1,
                    stroke: "rgba(255, 221, 87, 0.8)",
                    shadowBlur: 25,
                  },
                },
                {
                  percent: 1,
                  style: {
                    opacity: 0,
                    stroke: "rgba(255, 255, 255, 0.4)",
                    shadowBlur: 5,
                  },
                },
              ],
            },
          },

          // 右侧装饰元素组
          // 右上角装饰星形
          {
            type: "polygon",
            left: "90%",
            top: "25%",
            shape: {
              points: [
                [0, -35],
                [10, -10],
                [35, -10],
                [17, 10],
                [25, 35],
                [0, 21],
                [-25, 35],
                [-17, 10],
                [-35, -10],
                [-10, -10],
              ],
            },
            style: {
              fill: "rgba(255, 221, 87, 0.6)",
              stroke: "rgba(255, 221, 87, 0.8)",
              lineWidth: 2,
              opacity: 0,
              shadowColor: "rgba(255, 221, 87, 0.5)",
              shadowBlur: 20,
            },
            keyframeAnimation: {
              duration: 8000,
              loop: true,
              delay: 1500,
              keyframes: [
                {
                  percent: 0,
                  style: {
                    opacity: 0,
                    rotation: 0,
                    scaleX: 0.5,
                    scaleY: 0.5,
                    shadowBlur: 10,
                  },
                },
                {
                  percent: 0.3,
                  style: {
                    opacity: 0.9,
                    rotation: 90,
                    scaleX: 1,
                    scaleY: 1,
                    shadowBlur: 30,
                    shadowColor: "rgba(255, 221, 87, 0.8)",
                  },
                },
                {
                  percent: 0.7,
                  style: {
                    opacity: 1,
                    rotation: 270,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    shadowBlur: 35,
                  },
                },
                {
                  percent: 1,
                  style: {
                    opacity: 0,
                    rotation: 360,
                    scaleX: 0.5,
                    scaleY: 0.5,
                    shadowBlur: 10,
                  },
                },
              ],
            },
          },
          // 右侧中部装饰圆环组
          {
            type: "circle",
            left: "88%",
            top: "50%",
            shape: { r: 30 },
            style: {
              fill: "transparent",
              stroke: "rgba(255, 255, 255, 0.5)",
              lineWidth: 3,
              opacity: 0,
              shadowColor: "rgba(255, 255, 255, 0.4)",
              shadowBlur: 15,
            },
            keyframeAnimation: {
              duration: 5000,
              loop: true,
              delay: 3000,
              keyframes: [
                {
                  percent: 0,
                  style: {
                    opacity: 0,
                    scaleX: 0.2,
                    scaleY: 0.2,
                    shadowBlur: 5,
                  },
                },
                {
                  percent: 0.4,
                  style: {
                    opacity: 0.9,
                    scaleX: 1,
                    scaleY: 1,
                    shadowBlur: 25,
                    stroke: "rgba(255, 221, 87, 0.7)",
                    shadowColor: "rgba(255, 221, 87, 0.5)",
                  },
                },
                {
                  percent: 0.6,
                  style: {
                    opacity: 1,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    shadowBlur: 30,
                  },
                },
                {
                  percent: 1,
                  style: {
                    opacity: 0,
                    scaleX: 2,
                    scaleY: 2,
                    shadowBlur: 5,
                  },
                },
              ],
            },
          },
          {
            type: "circle",
            left: "88%",
            top: "50%",
            shape: { r: 50 },
            style: {
              fill: "transparent",
              stroke: "rgba(255, 221, 87, 0.4)",
              lineWidth: 2,
              opacity: 0,
              shadowColor: "rgba(255, 221, 87, 0.3)",
              shadowBlur: 20,
            },
            keyframeAnimation: {
              duration: 5000,
              loop: true,
              delay: 3500,
              keyframes: [
                {
                  percent: 0,
                  style: {
                    opacity: 0,
                    scaleX: 0.3,
                    scaleY: 0.3,
                    shadowBlur: 10,
                  },
                },
                {
                  percent: 0.3,
                  style: {
                    opacity: 0.7,
                    scaleX: 1,
                    scaleY: 1,
                    shadowBlur: 30,
                    stroke: "rgba(255, 221, 87, 0.6)",
                  },
                },
                {
                  percent: 0.7,
                  style: {
                    opacity: 0.5,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    shadowBlur: 35,
                  },
                },
                {
                  percent: 1,
                  style: {
                    opacity: 0,
                    scaleX: 2.5,
                    scaleY: 2.5,
                    shadowBlur: 10,
                  },
                },
              ],
            },
          },
          // 右下角装饰菱形
          {
            type: "polygon",
            left: "85%",
            top: "75%",
            shape: {
              points: [
                [0, -20],
                [20, 0],
                [0, 20],
                [-20, 0],
              ],
            },
            style: {
              fill: "rgba(255, 255, 255, 0.4)",
              stroke: "rgba(255, 255, 255, 0.6)",
              lineWidth: 2,
              opacity: 0,
              shadowColor: "rgba(255, 255, 255, 0.3)",
              shadowBlur: 15,
            },
            keyframeAnimation: {
              duration: 6000,
              loop: true,
              delay: 4000,
              keyframes: [
                {
                  percent: 0,
                  style: {
                    opacity: 0,
                    rotation: 0,
                    scaleX: 0.3,
                    scaleY: 0.3,
                    shadowBlur: 8,
                  },
                },
                {
                  percent: 0.4,
                  style: {
                    opacity: 0.8,
                    rotation: 180,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    shadowBlur: 25,
                    fill: "rgba(255, 221, 87, 0.5)",
                    stroke: "rgba(255, 221, 87, 0.7)",
                    shadowColor: "rgba(255, 221, 87, 0.4)",
                  },
                },
                {
                  percent: 0.7,
                  style: {
                    opacity: 1,
                    rotation: 270,
                    scaleX: 1.4,
                    scaleY: 1.4,
                    shadowBlur: 30,
                  },
                },
                {
                  percent: 1,
                  style: {
                    opacity: 0,
                    rotation: 360,
                    scaleX: 0.3,
                    scaleY: 0.3,
                    shadowBlur: 8,
                  },
                },
              ],
            },
          },

          // 浮动粒子效果 - 更多变化
          {
            type: "circle",
            left: "20%",
            top: "30%",
            shape: { r: 5 },
            style: {
              fill: "rgba(255, 255, 255, 0.8)",
              opacity: 0,
              shadowColor: "rgba(255, 255, 255, 0.6)",
              shadowBlur: 15,
            },
            keyframeAnimation: {
              duration: 6000,
              loop: true,
              delay: 2000,
              keyframes: [
                {
                  percent: 0,
                  style: {
                    opacity: 0,
                    y: 0,
                    x: 0,
                    scaleX: 0.5,
                    scaleY: 0.5,
                    shadowBlur: 8,
                  },
                },
                {
                  percent: 0.5,
                  style: {
                    opacity: 1,
                    y: -60,
                    x: 30,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    shadowBlur: 25,
                  },
                },
                {
                  percent: 1,
                  style: {
                    opacity: 0,
                    y: -120,
                    x: 0,
                    scaleX: 0.5,
                    scaleY: 0.5,
                    shadowBlur: 8,
                  },
                },
              ],
            },
          },
          {
            type: "circle",
            left: "75%",
            top: "65%",
            shape: { r: 6 },
            style: {
              fill: "rgba(255, 221, 87, 0.8)",
              opacity: 0,
              shadowColor: "rgba(255, 221, 87, 0.6)",
              shadowBlur: 20,
            },
            keyframeAnimation: {
              duration: 5000,
              loop: true,
              delay: 5000,
              keyframes: [
                {
                  percent: 0,
                  style: {
                    opacity: 0,
                    y: 0,
                    x: 0,
                    scaleX: 0.4,
                    scaleY: 0.4,
                    shadowBlur: 10,
                  },
                },
                {
                  percent: 0.4,
                  style: {
                    opacity: 0.9,
                    y: -45,
                    x: -25,
                    scaleX: 1.3,
                    scaleY: 1.3,
                    shadowBlur: 30,
                  },
                },
                {
                  percent: 1,
                  style: {
                    opacity: 0,
                    y: -90,
                    x: 25,
                    scaleX: 0.4,
                    scaleY: 0.4,
                    shadowBlur: 10,
                  },
                },
              ],
            },
          },
          {
            type: "circle",
            left: "15%",
            top: "80%",
            shape: { r: 4 },
            style: {
              fill: "rgba(255, 255, 255, 0.9)",
              opacity: 0,
              shadowColor: "rgba(255, 255, 255, 0.7)",
              shadowBlur: 18,
            },
            keyframeAnimation: {
              duration: 4000,
              loop: true,
              delay: 6000,
              keyframes: [
                {
                  percent: 0,
                  style: {
                    opacity: 0,
                    y: 0,
                    scaleX: 0.6,
                    scaleY: 0.6,
                    shadowBlur: 5,
                  },
                },
                {
                  percent: 0.6,
                  style: {
                    opacity: 1,
                    y: -40,
                    scaleX: 1.4,
                    scaleY: 1.4,
                    shadowBlur: 25,
                  },
                },
                {
                  percent: 1,
                  style: {
                    opacity: 0,
                    y: -80,
                    scaleX: 0.6,
                    scaleY: 0.6,
                    shadowBlur: 5,
                  },
                },
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

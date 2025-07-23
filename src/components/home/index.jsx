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
      backgroundColor: "#0eb0c9",
      graphic: {
        elements: [
          {
            type: "text",
            left: "center",
            top: "30%",
            style: {
              text: id ? `Hello,${nickname}` : "Hey ! Welcome !",
              fontSize: 100,
              fontWeight: "bold",
              fontFamily: "serif",
              lineDash: [0, 600],
              lineDashOffset: 0,
              fill: "transparent",
              stroke: "#ffdd57", // 深青蓝描边
              lineWidth: 3,
              textAlign: "center",
              textVerticalAlign: "middle",
              shadowColor: "rgba(0,0,0,0.25)", // 内阴影
              shadowBlur: 10,
            },
            keyframeAnimation: {
              duration: 3000,
              loop: true,
              delay: 0,
              keyframes: [
                {
                  percent: 0,
                  style: {
                    lineDash: [0, 600],
                    lineDashOffset: 0,
                    fill: "transparent",
                  },
                },
                {
                  percent: 0.4,
                  style: {
                    lineDash: [600, 0],
                    lineDashOffset: 600,
                  },
                },
                {
                  percent: 0.7,
                  style: {
                    fill: {
                      type: "linear",
                      x: 0,
                      y: 0,
                      x2: 1,
                      y2: 1,
                      colorStops: [
                        { offset: 0, color: "#ffe082" }, // 金色渐变
                        { offset: 1, color: "#ffca28" },
                      ],
                    },
                    shadowColor: "#ffc107",
                    shadowBlur: 25,
                  },
                },
                {
                  percent: 0.85,
                  style: {
                    scaleX: 1.05,
                    scaleY: 1.05,
                  },
                },
                {
                  percent: 1,
                  style: {
                    opacity: 0,
                  },
                },
              ],
            },
          },
          // 副标题：Welcome to
          {
            type: "text",
            left: "center",
            top: "45%",
            style: {
              text: id ? "Nice to see you !" : "Are you ready to join us ?",
              fontSize: 56,
              fill: "#f5f0e1", // 柔和米白
              fontWeight: "lighter",
              fontFamily: "serif",
              textAlign: "center",
              opacity: 0,
            },
            keyframeAnimation: {
              duration: 5000,
              loop: true,
              delay: 500,
              keyframes: [
                { percent: 0, style: { opacity: 0 } },
                { percent: 0.3, style: { opacity: 0.5 } },
                { percent: 0.6, style: { opacity: 1 } },
                { percent: 1, style: { opacity: 0 } },
              ],
            },
          },
        ],
      },
    });

    return () => chart.dispose();
  }, [id, nickname]);

  return <div ref={homeChartRef} style={{ height: "100vh" }} />;
};

export default Home;

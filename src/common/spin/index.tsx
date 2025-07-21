import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import "./index.less";

interface ChartLoadingProps {
  loading?: boolean;
  children?: React.ReactNode;
  tip?: string;
  size?: "small" | "default" | "large";
}

const ChartLoading: React.FC<ChartLoadingProps> = ({
  loading = false,
  children,
  tip = "请稍等片刻...",
  size = "default",
}) => {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const getAnimationConfig = () => {
    switch (size) {
      case "small":
        return {
          barCount: 5,
          barWidth: 10,
          barHeight: 25,
          spacing: 16,
          containerSize: 100,
        };
      case "large":
        return {
          barCount: 7,
          barWidth: 18,
          barHeight: 55,
          spacing: 26,
          containerSize: 200,
        };
      default:
        return {
          barCount: 6,
          barWidth: 14,
          barHeight: 45,
          spacing: 22,
          containerSize: 150,
        };
    }
  };

  const { barCount, barWidth, barHeight, spacing, containerSize } =
    getAnimationConfig();

  const getLoadingOption = () => ({
    graphic: {
      elements: [
        {
          type: "group",
          left: "center",
          top: "center",
          children: new Array(barCount).fill(0).map((_, i) => ({
            type: "rect",
            x: i * spacing - ((barCount - 1) * spacing) / 2,
            y: -10,
            shape: {
              x: 0,
              y: 0,
              width: barWidth,
              height: barHeight,
            },
            style: {
              fill: i % 2 === 0 ? "#0eb0c9" : "#28a745",
              opacity: 0.8,
            },
            keyframeAnimation: {
              duration: 1200,
              delay: i * 100,
              loop: true,
              keyframes: [
                {
                  percent: 0,
                  scaleY: 0.3,
                  y: barHeight / 2,
                  easing: "cubicIn",
                },
                {
                  percent: 0.5,
                  scaleY: 1,
                  y: -barHeight / 2,
                  easing: "elasticOut",
                },
                {
                  percent: 1,
                  scaleY: 0.3,
                  y: barHeight / 2,
                  easing: "cubicIn",
                },
              ],
            },
          })),
        },
      ],
    },
  });

  const initChart = () => {
    if (!indicatorRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.dispose();
      chartInstance.current = null;
    }

    const container = indicatorRef.current;

    // 延迟一帧保证 DOM 尺寸可用
    requestAnimationFrame(() => {
      if (container.clientWidth === 0 || container.clientHeight === 0) return;

      chartInstance.current = echarts.init(container);
      chartInstance.current.setOption(getLoadingOption());
    });
  };

  useEffect(() => {
    if (loading) {
      initChart();
    } else if (chartInstance.current) {
      chartInstance.current.dispose();
      chartInstance.current = null;
    }
  }, [loading, size]);

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="zach-chart-loading-container">
      {loading && (
        <div className="zach-loading-overlay">
          <div
            className="zach-loading-indicator"
            style={{
              width: containerSize,
              height: barHeight * 3,
            }}
          >
            <div ref={indicatorRef} style={{ width: "100%", height: "100%" }} />
            <div className="zach-loading-tip">{tip}</div>
          </div>
        </div>
      )}
      <div className="zach-chart-content">{children}</div>
    </div>
  );
};

export default ChartLoading;

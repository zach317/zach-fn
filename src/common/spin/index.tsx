import React, { useEffect, useRef } from "react";
import { Spin } from "antd";
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

  // 根据size调整动画参数
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

  // ECharts柱状图Loading配置
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

  // 创建自定义ECharts指示器
  const createCustomIndicator = () => {
    if (!indicatorRef.current) return null;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(indicatorRef.current);
    }

    chartInstance.current.setOption(getLoadingOption());

    return (
      <div
        ref={indicatorRef}
        style={{
          width: containerSize,
          height: barHeight * 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    );
  };

  useEffect(() => {
    if (loading) {
      createCustomIndicator();
    }

    return () => {
      if (chartInstance.current && !loading) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [loading, size]);

  // 清理资源
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  // 自定义指示器组件
  const customIndicator = (
    <div
      style={{
        width: containerSize,
        height: barHeight * 3,
        paddingTop: barHeight,
      }}
    >
      <div
        ref={indicatorRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );

  return (
    <Spin
      className="zach-spin-wrap"
      spinning={loading}
      tip={tip}
      indicator={customIndicator}
      size={size}
      delay={500}
    >
      {children}
    </Spin>
  );
};

export default ChartLoading;

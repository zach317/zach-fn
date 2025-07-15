import debounce from "debounce-promise";

type FuncType = (
  value: string
) => Promise<{ success: boolean; message?: string }>;

export const debounceReturn = (func: FuncType, username: string) =>
  debounce(async (_, value: string) => {
    if (!value) return;
    // 不校验当前用户名
    if (value === username) return;
    const res = await func(value);
    if (res.success) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(res.message));
  }, 500);

// 格式化金额
export const formatAmount = (amount) => {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
  }).format(Math.abs(amount));
};

export const hexToRGBA = (hex, alpha) => {
  if (!hex) {
    // 如果 hex 是空的，返回默认颜色或透明
    return `rgba(0, 0, 0, ${alpha})`; // 默认黑色
  }

  // 将十六进制颜色值转换为 RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // 返回 RGBA 格式的字符串
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

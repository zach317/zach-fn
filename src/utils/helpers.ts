import debounce from "debounce-promise";

type FuncType = (value: string) => Promise<{ success: boolean; message?: string }>;

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
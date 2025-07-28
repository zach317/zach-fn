import request from "utils/request";

export function getIncomeAndExpense(params) {
  return request("/analysis/income-and-expense", {
    method: "GET",
    params,
  });
}

export function getCategoryRatio(params) {
  return request("/analysis/category-radio", {
    method: "GET",
    params,
  });
}

export function getCategoryRank(params) {
  return request("/analysis/category-rank", {
    method: "GET",
    params,
  });
}

export function getMonthAmount(params) {
  return request("/analysis/month-amount", {
    method: "GET",
    params,
  });
}

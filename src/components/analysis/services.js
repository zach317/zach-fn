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

export function getCategoryRank(data) {
  return request("/analysis/category-rank", {
    method: "GET",
    data,
  });
}

export function getMonthAmount(data) {
  return request("/analysis/month-amount", {
    method: "GET",
    data,
  });
}

import request from "utils/request";

export function getIncomeAndExpense(data) {
  return request("/analysis/income-and-expense", {
    method: "GET",
    data,
  });
}

export function getCategoryRatio(data) {
  return request("/analysis/category-radio", {
    method: "GET",
    data,
  });
}

export function getCategoryRank(data) {
  return request("/analysis/category-rank", {
    method: "GET",
    data,
  });
}

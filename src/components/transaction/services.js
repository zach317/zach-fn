import request from "utils/request";

export function getAllCatrgories() {
  return request("/category/all-list", {
    method: "GET",
  });
}

export function getTransactionList(params) {
  return request("/transaction/list", {
    method: "GET",
    params,
  });
}

export function getTags() {
  return request("/tag/list", {
    method: "GET",
  });
}

export function addTransaction(data) {
  return request("/transaction/add", {
    method: "POST",
    data,
  });
}

export function updateTransaction(data) {
  return request("/transaction/update", {
    method: "POST",
    data,
  });
}

export function deleteTransaction(data) {
  return request("/transaction/delete", {
    method: "POST",
    data,
  });
}

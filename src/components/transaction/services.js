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

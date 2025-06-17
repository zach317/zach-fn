import request from "utils/request";

// 新增分类
export function addCategory(data) {
  return request("/category/add", {
    method: "POST",
    data,
  });
}

//  获取分类列表
export function getCatrgories(params) {
  return request("/category/list", {
    method: "GET",
    params,
  });
}

// 更新分类
export function updateCategory(data) {
  return request("/category/update", {
    method: "POST",
    data,
  });
}

// 删除分类
export function deleteCategory(data) {
  return request("/category/delete", {
    method: "POST",
    data,
  });
}

// 拖拽排序
export function reorderCategory(data) {
  return request("/category/reorder", {
    method: "POST",
    data,
  });
}

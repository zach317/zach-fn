import request from "utils/request";

// 新增标签
export function addTag(data) {
  return request("/tag/add", {
    method: "POST",
    data,
  });
}

//  获取标签列表
export function getTags(params) {
  return request("/tag/list", {
    method: "GET",
    params,
  });
}

// 更新分类
export function updateTag(data) {
  console.log("🚀 ~ updateTag ~ data:", data);
  return request("/tag/update", {
    method: "POST",
    data,
  });
}

// 删除标签
export function deleteTag(data) {
  return request("/tag/delete", {
    method: "POST",
    data,
  });
}

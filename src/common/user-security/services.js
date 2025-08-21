import request from "utils/request";

// 验证简单问题
export function verifySimpleQuestion(data) {
  return request("/users/verify-simple-question", {
    method: "POST",
    data,
  });
}

// 获取Q3问题
export function getQ3Question(params) {
  return request("/users/get-user-security-question", {
    method: "GET",
    params,
  });
}

// 验证q3问题
export function verifyQ3Question(data) {
  return request("/users/verify-security-question", {
    method: "POST",
    data,
  });
}

// 验证Q4问题与答案
export function verifyQ4Question(data) {
  return request("/users/verify-custom-question", {
    method: "POST",
    data,
  });
}

export function findUserByUsername(data) {
  return request("/users/find-user", {
    method: "POST",
    data,
  });
}

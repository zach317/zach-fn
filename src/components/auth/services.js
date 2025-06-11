import request from "utils/request";

// 注册
export function userRegister(data) {
  return request("/users/register", {
    method: "POST",
    data,
  });
}
// 校验用户名
export function checkUsername(data) {
  return request("/users/check-username", {
    method: "POST",
    data,
  });
}
// 登陆
export function userLogin(data) {
  return request("/users/login", {
    method: "POST",
    data,
  });
}

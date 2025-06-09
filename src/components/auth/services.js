import request from 'utils/request'

// 注册
export function userRegister(data) {
  return request('/users/register', {
    method: 'POST',
    data,
  })
}

export function checkUsername(data) {
  return request('/users/check-username', {
    method: 'POST',
    data,
  })
}

export function userLogin(data) {
  return request('/users/login', {
    method: 'POST',
    data,
  })
}
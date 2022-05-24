import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(userId) {
  return request({
    url: `/users/${userId}`,
    method: 'get'
  })
}

export function updateUser(userId, userInfo) {
  return request({
    url: `/users/${userId}`,
    method: 'put',
    data: userInfo
  })
}

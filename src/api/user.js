import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function createUser(user) {
  return request({
    url: '/users',
    method: 'post',
    data: user
  })
}

export function listUsers() {
  return request({
    url: '/users',
    method: 'get'
  })
}

export function getUser(userId) {
  return request({
    url: `/users/${userId}`,
    method: 'get'
  })
}

export function updateUser(userId, user) {
  return request({
    url: `/users/${userId}`,
    method: 'put',
    data: user
  })
}

export function deleteUser(userId) {
  return request({
    url: `/users/${userId}`,
    method: 'delete'
  })
}

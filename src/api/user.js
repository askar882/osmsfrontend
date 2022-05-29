import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function logout(userId) {
  let url = '/auth/logout'
  if (typeof userId !== 'undefined') {
    url += `/${userId}`
  }
  return request({
    url,
    method: 'delete'
  })
}

export function createUser(user) {
  return request({
    url: '/users',
    method: 'post',
    data: user
  })
}

export function listUsers({ size = 10, page = 0, sort = 'id,asc' } = {}) {
  return request({
    url: '/users',
    method: 'get',
    params: {
      size,
      page,
      sort
    }
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

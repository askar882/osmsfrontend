import request from '@/utils/request'

export function createDealer(order) {
  return request({
    url: '/orders',
    method: 'post',
    data: order
  })
}

export function listDealers() {
  return request({
    url: '/orders',
    method: 'get'
  })
}

export function getDealer(orderId) {
  return request({
    url: `/orders/${orderId}`,
    method: 'get'
  })
}

export function updateDealer(orderId, order) {
  return request({
    url: `/orders/${orderId}`,
    method: 'put',
    data: order
  })
}

export function deleteDealer(orderId) {
  return request({
    url: `/orders/${orderId}`,
    method: 'delete'
  })
}

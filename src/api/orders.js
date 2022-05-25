import request from '@/utils/request'

export function createOrder(order) {
  return request({
    url: '/orders',
    method: 'post',
    data: order
  })
}

export function listOrders() {
  return request({
    url: '/orders',
    method: 'get'
  })
}

export function getOrder(orderId) {
  return request({
    url: `/orders/${orderId}`,
    method: 'get'
  })
}

export function updateOrder(orderId, order) {
  return request({
    url: `/orders/${orderId}`,
    method: 'put',
    data: order
  })
}

export function deleteOrder(orderId) {
  return request({
    url: `/orders/${orderId}`,
    method: 'delete'
  })
}

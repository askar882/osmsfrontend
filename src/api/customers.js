import request from '@/utils/request'

export function createDealer(customer) {
  return request({
    url: '/customers',
    method: 'post',
    data: customer
  })
}

export function listDealers() {
  return request({
    url: '/customers',
    method: 'get'
  })
}

export function getDealer(customerId) {
  return request({
    url: `/customers/${customerId}`,
    method: 'get'
  })
}

export function updateDealer(customerId, customer) {
  return request({
    url: `/customers/${customerId}`,
    method: 'put',
    data: customer
  })
}

export function deleteDealer(customerId) {
  return request({
    url: `/customers/${customerId}`,
    method: 'delete'
  })
}

import request from '@/utils/request'

export function createDealer(product) {
  return request({
    url: '/products',
    method: 'post',
    data: product
  })
}

export function listDealers() {
  return request({
    url: '/products',
    method: 'get'
  })
}

export function getDealer(productId) {
  return request({
    url: `/products/${productId}`,
    method: 'get'
  })
}

export function updateDealer(productId, product) {
  return request({
    url: `/products/${productId}`,
    method: 'put',
    data: product
  })
}

export function deleteDealer(productId) {
  return request({
    url: `/products/${productId}`,
    method: 'delete'
  })
}

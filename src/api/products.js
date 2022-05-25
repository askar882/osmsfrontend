import request from '@/utils/request'

export function createProduct(product) {
  return request({
    url: '/products',
    method: 'post',
    data: product
  })
}

export function listProducts() {
  return request({
    url: '/products',
    method: 'get'
  })
}

export function getProduct(productId) {
  return request({
    url: `/products/${productId}`,
    method: 'get'
  })
}

export function updateProduct(productId, product) {
  return request({
    url: `/products/${productId}`,
    method: 'put',
    data: product
  })
}

export function deleteProduct(productId) {
  return request({
    url: `/products/${productId}`,
    method: 'delete'
  })
}

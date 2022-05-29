import request from '@/utils/request'

export function createProduct(product) {
  return request({
    url: '/products',
    method: 'post',
    data: product
  })
}

export function listProducts({ size = 10, page = 0, sort = 'id,asc' } = {}) {
  let params = {}
  if (size > 0) {
    params = { size, page, sort }
  }
  return request({
    url: '/products',
    method: 'get',
    params
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

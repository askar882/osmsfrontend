import request from '@/utils/request'

export function createCustomer(customer) {
  return request({
    url: '/customers',
    method: 'post',
    data: customer
  })
}

export function listCustomers({ size = 10, page = 0, sort = 'id,asc' }) {
  return request({
    url: '/customers',
    method: 'get',
    params: {
      size,
      page,
      sort
    }
  })
}

export function getCustomer(customerId) {
  return request({
    url: `/customers/${customerId}`,
    method: 'get'
  })
}

export function updateCustomer(customerId, customer) {
  return request({
    url: `/customers/${customerId}`,
    method: 'put',
    data: customer
  })
}

export function deleteCustomer(customerId) {
  return request({
    url: `/customers/${customerId}`,
    method: 'delete'
  })
}

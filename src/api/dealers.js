import request from '@/utils/request'

export function createDealer(dealer) {
  return request({
    url: '/dealers',
    method: 'post',
    data: dealer
  })
}

export function listDealers({ size = 10, page = 0, sort = 'id,asc' } = {}) {
  let params = {}
  if (size > 0) {
    params = { size, page, sort }
  }
  return request({
    url: '/dealers',
    method: 'get',
    params
  })
}

export function getDealer(dealerId) {
  return request({
    url: `/dealers/${dealerId}`,
    method: 'get'
  })
}

export function updateDealer(dealerId, dealer) {
  return request({
    url: `/dealers/${dealerId}`,
    method: 'put',
    data: dealer
  })
}

export function deleteDealer(dealerId) {
  return request({
    url: `/dealers/${dealerId}`,
    method: 'delete'
  })
}

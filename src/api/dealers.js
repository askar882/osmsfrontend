import request from '@/utils/request'

export function createDealer(dealer) {
  return request({
    url: '/dealers',
    method: 'post',
    data: dealer
  })
}

export function listDealers() {
  return request({
    url: '/dealers',
    method: 'get'
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

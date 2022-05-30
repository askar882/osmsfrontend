import request from '@/utils/request'

export default function statisticsData({ name, top }) {
  const params = { name }
  if (top) {
    params.top = top
  }
  return request({
    url: '/statistics',
    method: 'get',
    params
  })
}

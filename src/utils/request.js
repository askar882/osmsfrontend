import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // URL = baseURL + requestURL
  timeout: 5000 // 请求超时
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 设置Authorization消息头
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // 处理请求错误
    console.debug(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const { data } = response

    // 处理错误信息
    if (data.error) {
      Message({
        message: data.error.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(data.error.msg || 'Error'))
    } else {
      return data
    }
  },
  error => {
    console.debug('error:', error)
    const { data, status } = error.response
    let { message } = error
    if (data.error) {
      message = data.error.message
    }
    Message({
      message,
      type: 'error',
      duration: 5 * 1000
    })

    // 接收到401状态码说明身份验证失败，当前请求不是登录请求时跳转到登录页
    if (status === 401 && !/auth\/login$/.test(error.request.responseURL)) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录。', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    }
    return Promise.reject(error)
  }
)

export default service

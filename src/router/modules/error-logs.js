import Layout from '@/layout'
import settings from '@/settings'
import { isString, isArray } from '@/utils/validate'

let errorLogsRouter = {}

const { errorLog } = settings
const env = process.env.NODE_ENV
if ((isString(errorLog) && env === errorLog) ||
  (isArray(errorLog) && errorLog.includes(env))) {
  errorLogsRouter = {
    path: '/error-log',
    component: Layout,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: {
          title: '错误日志',
          icon: 'bug',
          roles: ['ADMIN']
        }
      }
    ]
  }
}

export default errorLogsRouter

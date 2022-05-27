import Layout from '@/layout'

let dataGenerator = {
  path: '/data-generator',
  component: Layout,
  meta: {
    roles: ['ADMIN']
  },
  children: [
    {
      path: '',
      component: () => import('@/views/fake'),
      name: 'DataGenerator',
      meta: {
        title: '数据生成器',
        icon: 'table'
      }
    }
  ]
}

if (process.env.NODE_ENV !== 'development') {
  dataGenerator = {}
}

export default dataGenerator

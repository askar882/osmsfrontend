import Layout from '@/layout'

export default {
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

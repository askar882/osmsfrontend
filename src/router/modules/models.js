import Layout from '@/layout'

const dealersRouter = {
  path: '/dealers',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/dealers/index'),
      name: 'Dealers',
      meta: {
        title: '经销商管理',
        icon: 'dealer'
      }
    }
  ]
}

const productsRouter = {
  path: '/products',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/products/index'),
      name: 'Products',
      meta: {
        title: '商品管理',
        icon: 'product'
      }
    }
  ]
}

const customersRouter = {
  path: '/customers',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/customers/index'),
      name: 'Customers',
      meta: {
        title: '客户管理',
        icon: 'customer'
      }
    }
  ]
}

const ordersRouter = {
  path: '/orders',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/orders/index'),
      name: 'Orders',
      meta: {
        title: '订单管理',
        icon: 'order'
      }
    }
  ]
}

export default [
  dealersRouter,
  productsRouter,
  customersRouter,
  ordersRouter
]

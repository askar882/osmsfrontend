<template>
  <div class="container">
    <el-row :gutter="20" type="flex" justify="end" align="middle">
      <el-col :span="8">
        <el-radio-group v-model="generationType">
          <el-radio label="dealer">经销商</el-radio>
          <el-radio label="customer">客户</el-radio>
          <el-radio label="product">产品</el-radio>
          <el-radio label="order">订单</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="4">
        <el-button
          type="primary"
          :loading="loading"
          @click="generate"
        >生成10条记录</el-button>
      </el-col>
    </el-row>
    <div class="container">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="经销商" name="dealer">
          <dealers-table :dealers="dealers" :loading="loading" />
        </el-tab-pane>
        <el-tab-pane label="客户" name="customer">
          <customers-table :customers="customers" :loading="loading" />
        </el-tab-pane>
        <el-tab-pane label="产品" name="product">
          <products-table :products="products" :loading="loading" />
        </el-tab-pane>
        <el-tab-pane label="订单" name="order">
          <orders-table :orders="orders" :loading="loading" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import DealersTable from './components/DealersTable'
import CustomersTable from './components/CustomersTable'
import ProductsTable from './components/ProductsTable'
import OrdersTable from './components/OrdersTable'
import { createDealer } from '@/api/dealers'
import { createCustomer } from '@/api/customers'
// import { createProduct } from '@/api/products'
// import { createOrder } from '@/api/orders'
const enFaker = require('@faker-js/faker/locale/en')
const zhFaker = require('@faker-js/faker/locale/zh_CN')

export default {
  components: {
    DealersTable,
    CustomersTable,
    ProductsTable,
    OrdersTable
  },
  data() {
    return {
      generationType: 'dealer',
      activeTab: 'dealer',
      loading: false,
      dealers: [],
      customers: [],
      products: [],
      orders: []
    }
  },
  methods: {
    async generate() {
      console.debug('generate:', this.generationType)
      this.loading = true
      switch (this.generationType) {
        case 'dealer':
          await this.generateDealer()
          break
        case 'customer':
          await this.generateCustomer()
          break
        case 'product':
          await this.generateProduct()
          break
        case 'order':
          await this.generateOrder()
          break
      }
      this.loading = false
    },
    fakeName: () => zhFaker.fake('{{name.lastName}}{{name.firstName}}'),
    fakeEmail: () => enFaker.internet.email(),
    fakeNumber: () => zhFaker.phone.phoneNumber(),
    randomInt: (min, max) => enFaker.datatype.number({ min, max }),
    randomFloat: (min, max) => enFaker.datatype.number({ precision: 0.01, min, max }),
    fakeAddress() {
      return zhFaker
        .fake(
          `{{address.state}}{{address.city}}{{address.streetName}}${this.randomInt(
            1,
            300
          )}号`
        )
        .replace(/\s/g, '')
    },
    async generateDealer() {
      window.fakers = { enFaker, zhFaker }
      let successCount = 0
      for (let i = 0; i < 10; i++) {
        const dealer = {
          name: zhFaker.company.companyName(),
          contact: {
            name: this.fakeName(),
            phone: this.fakeNumber(),
            email: this.fakeEmail()
          },
          phone: this.fakeNumber(),
          address: this.fakeAddress()
        }
        try {
          this.dealers.push((await createDealer(dealer)).data.dealer)
          successCount++
        } catch (e) {
          console.debug(e)
        }
      }
      if (successCount > 0) {
        this.$message({
          message: `成功生成${successCount}条数据`,
          type: 'success',
          duration: 3000
        })
      } else {
        this.$message({
          message: '生成数据失败',
          type: 'error'
        })
      }
    },
    async generateCustomer() {
      let successCount = 0
      for (let i = 0; i < 10; i++) {
        const customer = {
          name: this.fakeName(),
          gender: enFaker.datatype.boolean() ? 'MALE' : 'FEMALE',
          phone: this.fakeNumber(),
          birthDate: enFaker.date.past(30),
          email: this.fakeEmail(),
          addresses: []
        }
        new Array(this.randomInt(1, 5)).fill(0).forEach(() => customer.addresses.push(this.fakeAddress()))
        try {
          this.customers.push((await createCustomer(customer)).data.customer)
          successCount++
        } catch (e) {
          console.debug(e)
        }
      }
      if (successCount > 0) {
        this.$message({
          message: `成功生成${successCount}条数据`,
          type: 'success',
          duration: 3000
        })
      } else {
        this.$message({
          message: '生成数据失败',
          type: 'error'
        })
      }
    },
    async generateProduct() {
      // let successCount = 0
      for (let i = 0; i < 10; i++) {
        const product = {
          name: enFaker.commerce.productName(),
          code: enFaker.datatype.uuid().replace(/-/g, ''),
          description: enFaker.commerce.productDescription(),
          price: this.randomFloat(1, 200),
          dealer: {
            id: 0
          }
        }
        console.log(product)
        // try {
        //   this.products.push((await createProduct(product)).data.product)
        //   successCount++
        // } catch (e) {
        //   console.debug(e)
        // }
      }
      // if (successCount > 0) {
      //   this.$message({
      //     message: `成功生成${successCount}条数据`,
      //     type: 'success',
      //     duration: 3000
      //   })
      // } else {
      //   this.$message({
      //     message: '生成数据失败',
      //     type: 'error'
      //   })
      // }
    },
    async generateOrder() {
      // let successCount = 0
      for (let i = 0; i < 10; i++) {
        const order = {
          customer: {
            id: null
          },
          shippingCost: enFaker.datatype.boolean ? 0 : this.randomFloat(0, 50),
          address: this.fakeAddress(),
          orderItems: [
            {
              product: {
                id: null
              },
              count: this.randomInt(1, 20)
            }
          ]
        }
        console.log(order)
        // try {
        //   this.orders.push((await createOrder(order)).data.order)
        //   successCount++
        // } catch (e) {
        //   console.debug(e)
        // }
      }
      // if (successCount > 0) {
      //   this.$message({
      //     message: `成功生成${successCount}条数据`,
      //     type: 'success',
      //     duration: 3000
      //   })
      // } else {
      //   this.$message({
      //     message: '生成数据失败',
      //     type: 'error'
      //   })
      // }
    }
  }
}
</script>

<style scoped>
.container {
  margin: 20px;
}
</style>
>

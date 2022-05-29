<template>
  <div class="container">
    <el-row :gutter="20" type="flex" justify="end" align="middle">
      <el-col :span="8">
        <el-select
          v-if="activeTab === 'order'"
          v-model="selectedCustomers"
          value-key="id"
          :popper-append-to-body="false"
          placeholder="留空随机选择客户"
          class="selector"
          multiple
          filterable
          clearable
        >
          <el-option
            v-for="customer in customers"
            :key="customer.id"
            :value="customer"
            :label="customer.name"
          />
        </el-select>
      </el-col>

      <el-col :span="8">
        <el-select
          v-if="activeTab === 'product'"
          v-model="selectedDealers"
          value-key="id"
          :popper-append-to-body="false"
          placeholder="留空随机选择经销商"
          class="selector"
          multiple
          filterable
          clearable
        >
          <el-option
            v-for="dealer in dealers"
            :key="dealer.id"
            :value="dealer"
            :label="dealer.name"
          />
        </el-select>

        <el-select
          v-else-if="activeTab === 'order'"
          v-model="selectedProducts"
          value-key="id"
          :popper-append-to-body="false"
          placeholder="留空随机选择产品"
          class="selector"
          multiple
          filterable
          clearable
        >
          <el-option
            v-for="product in products"
            :key="product.id"
            :value="product"
            :label="product.name + '(' + product.price + '元)'"
          />
        </el-select>
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
          <dealers-table :dealers="generatedDealers" :loading="loading" />
        </el-tab-pane>
        <el-tab-pane label="客户" name="customer">
          <customers-table :customers="generatedCustomers" :loading="loading" />
        </el-tab-pane>
        <el-tab-pane label="产品" name="product">
          <products-table :products="generatedProducts" :loading="loading" />
        </el-tab-pane>
        <el-tab-pane label="订单" name="order">
          <orders-table :orders="generatedOrders" :loading="loading" />
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
import { listDealers, createDealer } from '@/api/dealers'
import { listCustomers, createCustomer } from '@/api/customers'
import { listProducts, createProduct } from '@/api/products'
import { createOrder } from '@/api/orders'
const enFaker = require('@faker-js/faker/locale/en')
const zhFaker = require('@faker-js/faker/locale/zh_CN')

export default {
  name: 'DataGenerator',
  components: {
    DealersTable,
    CustomersTable,
    ProductsTable,
    OrdersTable
  },
  data() {
    return {
      activeTab: 'dealer',
      loading: false,
      dealers: [],
      customers: [],
      products: [],
      generatedDealers: [],
      generatedCustomers: [],
      generatedProducts: [],
      generatedOrders: [],
      selectedDealers: [],
      selectedProducts: [],
      selectedCustomers: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.loading = true
      try {
        this.dealers = (await listDealers({ size: 0 })).data.dealers
        this.customers = (await listCustomers({ size: 0 })).data.customers
        this.products = (await listProducts({ size: 0 })).data.products
      } catch (e) {
        console.debug(e)
      }
      this.loading = false
    },
    async generate() {
      console.debug('generate:', this.activeTab)
      this.loading = true
      switch (this.activeTab) {
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
    randomFloat: (min, max) =>
      enFaker.datatype.number({ precision: 0.01, min, max }),
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
    randomFutureDay(refDate, minDay = 0, maxDay = 5) {
      const date = refDate || new Date()
      let future = date.getTime()
      const dayMilliseconds = 24 * 3600 * 1000
      future += this.randomInt(minDay * dayMilliseconds, maxDay * dayMilliseconds)
      return new Date(future)
    },
    async generateDealer() {
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
          const { dealer: created } = (await createDealer(dealer)).data
          this.generatedDealers.push(created)
          this.dealers.push(created)
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
        new Array(this.randomInt(1, 5))
          .fill(0)
          .forEach(() => customer.addresses.push(this.fakeAddress()))
        try {
          const { customer: created } = (await createCustomer(customer)).data
          this.generatedCustomers.push(created)
          this.customers.push(created)
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
      let successCount = 0
      const dealers =
        this.selectedDealers.length > 0 ? this.selectedDealers : this.dealers
      if (dealers.length <= 0) {
        this.$message({
          message: '生成失败，无可用经销商',
          type: 'error',
          duration: 3000
        })
        return
      }
      for (let i = 0; i < 10; i++) {
        const product = {
          name: enFaker.commerce.productName(),
          code: enFaker.datatype.uuid().replace(/-/g, ''),
          description: enFaker.commerce.productDescription(),
          price: this.randomFloat(1, 200),
          dealer: {}
        }
        product.dealer.id = dealers[this.randomInt(0, dealers.length - 1)].id
        try {
          const { product: created } = (await createProduct(product)).data
          this.generatedProducts.push(created)
          this.products.push(created)
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
    async generateOrder() {
      let successCount = 0
      const customers =
        this.selectedCustomers.length > 0
          ? this.selectedCustomers
          : this.customers
      const products =
        this.selectedProducts.length > 0 ? this.selectedProducts : this.products
      if (customers.length <= 0) {
        this.$message({
          message: '生成失败，无可用客户',
          type: 'error',
          duration: 3000
        })
        return
      }
      if (products.length <= 0) {
        this.$message({
          message: '生成失败，无可用产品',
          type: 'error',
          duration: 3000
        })
        return
      }
      for (let i = 0; i < 10; i++) {
        const order = {
          customer: {},
          shippingCost: enFaker.datatype.boolean() ? 0 : this.randomFloat(0, 50),
          address: '',
          orderItems: []
        }
        const randomCustomer =
          customers[this.randomInt(0, customers.length - 1)]
        order.customer.id = randomCustomer.id
        order.address =
          randomCustomer.addresses[
            this.randomInt(0, randomCustomer.addresses.length - 1)
          ]
        // 可过滤的产品列表，防止复用products导致只能生成一组数据
        const filterableProducts = [...products]
        new Array(this.randomInt(1, Math.min(10, filterableProducts.length)))
          .fill(0)
          .forEach(() => {
            const randomIndex = this.randomInt(0, filterableProducts.length - 1)
            order.orderItems.push({
              product: {
                id: filterableProducts[randomIndex].id
              },
              count: this.randomInt(1, 20)
            })
            // 删除已选择的产品
            filterableProducts.splice(randomIndex, 1)
          })
        // 随机设置下单时间、发货时间和签收时间
        // 0代表不设置，1代表设置下单时间，2代表设置发货时间，3代表设置签收时间
        // 后两个时间分别依赖前面的时间
        const generationType = this.randomInt(0, 3)
        if (generationType > 0) {
          const orderTime = enFaker.date.past(1)
          order.orderTime = orderTime
          if (generationType > 1) {
            const shipmentTime = this.randomFutureDay(orderTime, 0, 1)
            order.shipmentTime = shipmentTime
            if (generationType > 2) {
              order.deliveryTime = this.randomFutureDay(shipmentTime, 1)
            }
          }
        }
        try {
          this.generatedOrders.push((await createOrder(order)).data.order)
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
    }
  }
}
</script>

<style scoped>
.container {
  margin: 20px;
}

.selector {
  width: 100%;
}
</style>
>

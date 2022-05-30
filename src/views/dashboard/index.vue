<template>
  <div class="dashboard-editor-container">
    <panel-group
      :data-count="dataCount"
      @selectionChanged="handlePanelSelected"
    />

    <!-- 月销售额 -->
    <sales-chart />

    <el-row :gutter="32">
      <!-- 经销商市场占比饼图 -->
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <dealers-chart />
        </div>
      </el-col>

      <!-- 订单状态分布饼图 -->
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
    </el-row>

    <el-row>
      <!-- 热销商品排行柱状图 -->
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <!-- 最新订单 -->
    <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      <latest-orders
        :type.sync="selectedPanel"
        :data="latestData"
        :loading.sync="loading"
      />
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LatestOrders from './components/LatestOrders'
import DealersChart from './components/DealersChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import { isGuided, guide } from '@/utils/guide'
import { listDealers } from '@/api/dealers'
import { listCustomers } from '@/api/customers'
import { listProducts } from '@/api/products'
import { listOrders } from '@/api/orders'
import { listUsers } from '@/api/user'

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    LatestOrders,
    DealersChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      dataCount: {},
      loadingService: this.$loading(),
      loading: true,
      selectedPanel: 'customers',
      latestData: {}
    }
  },
  watch: {
    loading(val) {
      if (val) {
        this.loadingService = this.$loading()
      } else {
        this.loadingService.close()
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    if (!isGuided()) {
      guide()
    }
  },
  methods: {
    handlePanelSelected(type) {
      this.selectedPanel = type
    },
    async getData() {
      this.loading = true
      const dealersData = (await listDealers({ sort: '' })).data
      const customersData = (await listCustomers()).data
      const productsData = (await listProducts()).data
      const ordersData = (await listOrders()).data
      const usersData = (await listUsers()).data
      this.dataCount = {
        dealer: dealersData.total,
        customer: customersData.total,
        product: productsData.total,
        order: ordersData.total,
        user: usersData.total
      }
      this.latestData = {
        dealers: dealersData.dealers,
        customers: customersData.customers,
        products: productsData.products,
        orders: ordersData.orders
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

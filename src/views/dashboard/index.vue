<template>
  <div class="dashboard-editor-container">
    <panel-group :data-count="dataCount" @selectionChanged="handlePanelSelected" />

    <!-- 最新变化 -->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <latest-table :type.sync="selectedPanel" :data="latestData" />
    </el-row>

    <el-row :gutter="32">
      <!-- 经销商市场占比饼图 -->
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <dealers-chart />
        </div>
      </el-col>

      <!-- 订单状态分布饼图 -->
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>

      <!-- 热销商品排行柱状图 -->
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LatestTable from './components/LatestTable'
import DealersChart from './components/DealersChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import { isGuided, guide } from '@/utils/guide'
import { listDealers } from '@/api/dealers'
import { listCustomers } from '@/api/customers'
import { listProducts } from '@/api/products'
import { listOrders } from '@/api/orders'

const lineChartData = {
  customer: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  dealer: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  product: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  order: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LatestTable,
    DealersChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      lineChartData: lineChartData.customer,
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
      const dealersData = (await listDealers()).data
      const customersData = (await listCustomers()).data
      const productsData = (await listProducts()).data
      const ordersData = (await listOrders()).data
      this.dataCount = {
        dealer: dealersData.total,
        customer: customersData.total,
        product: productsData.total,
        order: ordersData.total
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

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

</style>

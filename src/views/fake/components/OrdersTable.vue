<template>
  <div>
    <el-table v-loading="loading" :data="pagedData" max-height="500px" border>
      <el-table-column prop="customer.id" label="ID" width="60" />
      <el-table-column prop="customer.name" label="客户" width="100" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="totalCost" label="总价" width="100" :formatter="priceFormatter" />
      <el-table-column prop="shippingCost" label="运费" width="80" :formatter="priceFormatter" />
      <el-table-column label="订单状态" width="450">
        <template slot-scope="{ row }">
          <el-steps
            :space="150"
            :active="
              row.deliveryTime !== null ? 3 : row.shipmentTime !== null ? 2 : 1
            "
            finish-status="success"
          >
            <el-step>
              <el-tooltip
                slot="title"
                placement="top"
                :content="parseTime(row.orderTime)"
              >
                <div>已下单</div>
              </el-tooltip>
            </el-step>
            <el-step>
              <el-tooltip
                slot="title"
                placement="top"
                :content="parseTime(row.shipmentTime)"
                :disabled="row.shipmentTime === null"
              >
                <div>正在运输</div>
              </el-tooltip>
            </el-step>
            <el-step>
              <el-tooltip
                slot="title"
                placement="top"
                :content="parseTime(row.deliveryTime)"
                :disabled="row.deliveryTime === null"
              >
                <div>已签收</div>
              </el-tooltip>
            </el-step>
          </el-steps>
        </template>
      </el-table-column>
      <el-table-column label="订单列表">
        <template slot-scope="{ row }">
          <el-popover placement="left" trigger="click">
            <el-table :data="row.orderItems" border max-height="300">
              <el-table-column label="产品" prop="product.name" />
              <el-table-column label="单价" prop="price" :formatter="priceFormatter" />
              <el-table-column label="数量" prop="count" />
            </el-table>
            <el-button slot="reference">点击查看</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      layout="total, sizes, prev, pager, next, jumper"
      :pager-count="13"
      :page-sizes="[5, 10, 20, 50]"
      :page-size.sync="pageSize"
      :current-page.sync="currentPage"
      :total="orders.length"
    />
  </div>
</template>

<script>
import { parseTime, priceFormatter } from '@/utils'

export default {
  props: {
    orders: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      pageSize: 10,
      currentPage: 1
    }
  },
  computed: {
    pagedData() {
      const start = this.pageSize * (this.currentPage - 1)
      return this.orders.slice(start, start + this.pageSize)
    }
  },
  methods: {
    parseTime: parseTime,
    priceFormatter: priceFormatter
  }
}
</script>

<style scoped>
.pagination {
  margin: 20px;
}
</style>

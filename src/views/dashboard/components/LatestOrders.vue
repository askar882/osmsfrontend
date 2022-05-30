<template>
  <div>
    <div class="title">最新10个订单</div>
    <el-table v-loading="loading" :data="orders">
      <el-table-column prop="customer.id" label="ID" width="60" />
      <el-table-column prop="customer.name" label="客户" width="100" />
      <el-table-column prop="address" label="地址" />
      <el-table-column
        prop="totalCost"
        label="总价"
        width="100"
        :formatter="priceFormatter"
      />
      <el-table-column
        prop="shippingCost"
        label="运费"
        width="80"
        :formatter="priceFormatter"
      />
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
            <el-table :data="row.orderItems" max-height="300">
              <el-table-column label="商品" prop="product.name" />
              <el-table-column
                label="单价"
                prop="price"
                :formatter="priceFormatter"
              />
              <el-table-column label="数量" prop="count" />
            </el-table>
            <el-button slot="reference">点击查看</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
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
  methods: {
    parseTime,
    priceFormatter
  }
}
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 22px;
  color: #3f51b5;
  margin-bottom: 20px;
}
</style>

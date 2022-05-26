<template>
  <div class="container">
    <div class="controls-container">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addOrder"
      >添加</el-button>
    </div>
    <el-table :data="tableData" :loading="tableLoading" :height="500" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="customer.name" label="下单客户" width="100" />
      <el-table-column prop="address" label="地址" width="300" />
      <el-table-column prop="totalCost" label="总价" width="60" />
      <el-table-column prop="shippingCost" label="运费" width="60" />
      <el-table-column label="订单状态" width="300">
        <template slot-scope="{ row }">
          <el-steps
            :space="100"
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
          <el-tree
            v-if="row.orderItemsTree"
            :data="row.orderItemsTree"
            :props="{ children: 'children', label: 'label' }"
          />
          <p v-else>{{ row.orderItems[0].product.name }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit(row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <orders-dialog
      :visible.sync="dialogVisible"
      :data="dialogData"
      :action="dialogAction"
      @success="onSubmitSuccess"
    />
  </div>
</template>

<script>
import OrdersDialog from './components/OrdersDialog'
import { listOrders, deleteOrder } from '@/api/orders'
import { parseTime } from '@/utils'

export default {
  name: 'Orders',
  components: { OrdersDialog },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      dialogData: {},
      dialogAction: 'create',
      tableLoading: false
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.tableLoading = true
      try {
        const { orders } = (await listOrders()).data
        console.debug('orders:', orders)
        orders.forEach((order) => {
          if (order.orderItems.length > 1) {
            const root = {
              label: order.orderItems[0].product.name,
              children: []
            }
            order.orderItems
              .slice(1)
              .forEach((orderItem) =>
                root.children.push({ label: orderItem.product.name })
              )
            order.orderItemsTree = [root]
          }
        })
        this.tableData = orders
      } catch (e) {
        console.debug('Failed to list orders:', e)
        this.$message({
          message: '获取客户列表失败',
          type: 'error'
        })
      }
      this.tableLoading = false
    },
    handleEdit(order) {
      this.dialogData = order
      this.dialogAction = 'edit'
      this.dialogVisible = true
    },
    async handleDelete(order) {
      try {
        await this.$confirm(`是否确认删除客户'${order.name}'？`, '提示', {
          confirmButtonClass: 'el-button--danger',
          type: 'warning'
        })
      } catch {
        return false
      }
      this.tableLoading = true
      try {
        await deleteOrder(order.id)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getData()
      } catch (e) {
        console.debug(`Failed to delete order '${order.name}'. Error:`, e)
        this.$message({
          message: '删除失败',
          type: 'error'
        })
      }
      this.tableLoading = false
    },
    addOrder() {
      this.dialogData = {}
      this.dialogAction = 'create'
      this.dialogVisible = true
    },
    onSubmitSuccess(data) {
      console.debug('Submit succeeded:', data)
      this.getData()
    },
    parseTime: parseTime
  }
}
</script>

<style scoped>
.container {
  margin: 20px;
}

.controls-container {
  margin-bottom: 10px;
  padding: 0 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

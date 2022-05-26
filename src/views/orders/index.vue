<template>
  <div class="container">
    <div class="controls-container">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addOrder"
      >添加</el-button>
    </div>
    <el-table
      :data="tableData"
      :loading="tableLoading"
      :height="500"
      border
    >
      <el-table-column prop="id" label="ID" :width="60" />
      <el-table-column prop="customer.name" label="下单客户" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="totalCost" label="订单总价" />
      <el-table-column prop="shippingCost" label="运费" />
      <el-table-column label="下单时间">
        <template slot-scope="{ row }">
          {{ row.orderTime | parseDate }}
        </template>
      </el-table-column>
      <el-table-column label="订单列表">
        <template slot-scope="{ row }">
          <el-tree v-if="row.orderItemsTree" :data="row.orderItemsTree" :props="{ children: 'children', label: 'label' }" />
          <p v-else>{{ row.orderItems[0].product.name }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
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
  filters: {
    parseDate: time => parseTime(time, '{y}年{m}月{d}日')
  },
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
        orders.forEach(order => {
          if (order.orderItems.length > 1) {
            const root = {
              label: order.orderItems[0].product.name,
              children: []
            }
            order.orderItems.slice(1).forEach(orderItem => root.children.push({ label: orderItem.product.name }))
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
    }
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

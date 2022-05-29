<template>
  <div class="container">
    <div class="controls-container">
      <el-button
        type="primary"
        icon="el-icon-refresh"
        :disabled="tableLoading"
        @click="refresh"
      >刷新</el-button>
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="tableLoading"
        @click="addOrder"
      >添加</el-button>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      max-height="500"
      border
      @sort-change="handleSortChange"
    >
      <el-table-column prop="id" label="ID" width="60" sortable="custom" />
      <el-table-column
        prop="customer.name"
        label="客户"
        width="100"
        sortable="custom"
      />
      <el-table-column
        prop="address"
        label="地址"
        width="300"
        sortable="custom"
      />
      <el-table-column
        prop="totalCost"
        label="总价"
        width="80"
        sortable="custom"
        :formatter="priceFormatter"
      />
      <el-table-column
        prop="shippingCost"
        label="运费"
        width="80"
        sortable="custom"
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
      <el-table-column label="订单列表" width="150">
        <template slot-scope="{ row }">
          <el-popover placement="left" trigger="click">
            <el-table :data="row.orderItems" border max-height="300">
              <el-table-column label="产品" prop="product.name" />
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

    <el-pagination
      class="pagination"
      layout="total, sizes, prev, pager, next, jumper"
      :pager-count="13"
      :page-sizes="[5, 10, 20, 50]"
      :page-size.sync="pageSize"
      :current-page.sync="currentPage"
      :total="totalData"
      @size-change="getData"
      @current-change="getData"
    />

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
import { parseTime, priceFormatter } from '@/utils'

export default {
  name: 'Orders',
  components: { OrdersDialog },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      dialogData: {},
      dialogAction: 'create',
      tableLoading: false,
      totalData: 0,
      pageSize: 10,
      currentPage: 0,
      tableSort: 'id,asc'
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.tableLoading = true
      try {
        const { orders, total } = (
          await listOrders({
            size: this.pageSize,
            page: this.currentPage - 1,
            sort: this.tableSort
          })
        ).data
        console.debug('orders:', orders)
        this.tableData = orders
        this.totalData = total
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
        await this.$confirm(
          `是否确认删除客户'${order.customer.name}'的ID为'${order.id}的订单？`,
          '警告',
          {
            confirmButtonClass: 'el-button--danger',
            type: 'warning'
          }
        )
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
    parseTime: parseTime,
    async refresh() {
      await this.getData()
      this.$message({
        message: '刷新成功',
        type: 'success'
      })
    },
    priceFormatter: priceFormatter,
    handleSortChange({ prop, order }) {
      let sort = 'id,asc'
      if (order) {
        sort = `${prop},${order === 'ascending' ? 'asc' : 'desc'}`
      }
      if (sort !== this.tableSort) {
        this.tableSort = sort
        this.getData()
      }
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

.pagination {
  margin: 20px;
}
</style>

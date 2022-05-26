<template>
  <div class="container">
    <div class="controls-container">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addCustomer"
      >添加</el-button>
    </div>
    <el-table
      :data="tableData"
      :loading="tableLoading"
      :height="500"
      border
    >
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="gender" label="性别" width="60">
        <template slot-scope="{ row }">
          <el-tag type="primary">{{
            row.gender === 'MALE' ? '男' : '女'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="150" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column prop="birthDate" label="生日" width="150">
        <template slot-scope="{ row }">
          {{ row.birthDate | parseDate }}
        </template>
      </el-table-column>

      <el-table-column label="地址" width="300">
        <template slot-scope="{ row }">
          <el-popover v-if="row.addresses.length > 1">
            <el-table :data="row.addresses" :show-header="false" max-height="300" border>
              <el-table-column width="300">
                <template slot-scope="slot">
                  <div>{{ slot.row }}</div>
                </template>
              </el-table-column>
            </el-table>
            <el-button slot="reference">点击显示地址列表</el-button>
          </el-popover>
          <p v-else>{{ row.addresses[0] }}</p>
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

    <customers-dialog
      :visible.sync="dialogVisible"
      :data="dialogData"
      :action="dialogAction"
      @success="onSubmitSuccess"
    />
  </div>
</template>

<script>
import CustomersDialog from './components/CustomersDialog'
import { listCustomers, deleteCustomer } from '@/api/customers'
import { parseTime } from '@/utils'

export default {
  name: 'Customers',
  components: { CustomersDialog },
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
        const { customers } = (await listCustomers()).data
        console.debug('customers:', customers)
        this.tableData = customers
      } catch (e) {
        console.debug('Failed to list customers:', e)
        this.$message({
          message: '获取客户列表失败',
          type: 'error'
        })
      }
      this.tableLoading = false
    },
    handleEdit(customer) {
      this.dialogData = customer
      this.dialogAction = 'edit'
      this.dialogVisible = true
    },
    async handleDelete(customer) {
      try {
        await this.$confirm(`是否确认删除客户'${customer.name}'？将删除该客户关联的所有订单！`, '警告', {
          confirmButtonClass: 'el-button--danger',
          type: 'warning'
        })
      } catch {
        return false
      }
      this.tableLoading = true
      try {
        await deleteCustomer(customer.id)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getData()
      } catch (e) {
        console.debug(`Failed to delete customer '${customer.name}'. Error:`, e)
        this.$message({
          message: '删除失败',
          type: 'error'
        })
      }
      this.tableLoading = false
    },
    addCustomer() {
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

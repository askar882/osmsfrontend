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
        @click="addDealer"
      >添加</el-button>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      height="500"
      border
      @sort-change="handleSortChange"
    >
      <el-table-column prop="id" label="ID" width="60" sortable="custom" />
      <el-table-column prop="name" label="名称" width="200" sortable="custom" />
      <el-table-column prop="contact" label="联系人" width="200">
        <template slot-scope="{ row }">
          <el-popover trigger="hover" placement="top">
            <p>姓名：{{ row.contact.name }}</p>
            <p>电话：{{ row.contact.phone }}</p>
            <div slot="reference">
              <el-tag>{{ row.contact.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="联系电话"
        width="200"
        sortable="custom"
      />
      <el-table-column prop="address" label="地址" width="400" sortable="custom" />
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

    <dealers-dialog
      :visible.sync="dialogVisible"
      :data="dialogData"
      :action="dialogAction"
      @success="onSubmitSuccess"
    />
  </div>
</template>

<script>
import DealersDialog from './components/DealersDialog'
import { listDealers, deleteDealer } from '@/api/dealers'

export default {
  name: 'Dealers',
  components: { DealersDialog },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      dialogData: {},
      dialogAction: 'create',
      tableLoading: false,
      totalData: 0,
      pageSize: 10,
      currentPage: 1,
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
        const { dealers, total } = (
          await listDealers({
            size: this.pageSize,
            page: this.currentPage - 1,
            sort: this.tableSort
          })
        ).data
        console.debug('dealers:', dealers)
        this.tableData = dealers
        this.totalData = total
      } catch (e) {
        console.debug('Failed to list dealers:', e)
        this.$message({
          message: '获取经销商列表失败',
          type: 'error'
        })
      }
      this.tableLoading = false
    },
    handleEdit(dealer) {
      this.dialogData = dealer
      this.dialogAction = 'edit'
      this.dialogVisible = true
    },
    async handleDelete(dealer) {
      try {
        await this.$confirm(
          `是否确认删除经销商'${dealer.name}'？将删除该经销商关联的所有商品！`,
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
        await deleteDealer(dealer.id)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getData()
      } catch (e) {
        console.debug(`Failed to delete dealer '${dealer.name}'. Error:`, e)
        this.$message({
          message: '删除失败',
          type: 'error'
        })
      }
      this.tableLoading = false
    },
    addDealer() {
      this.dialogData = {}
      this.dialogAction = 'create'
      this.dialogVisible = true
    },
    onSubmitSuccess(data) {
      console.debug('Submit succeeded:', data)
      this.getData()
    },
    async refresh() {
      await this.getData()
      this.$message({
        message: '刷新成功',
        type: 'success'
      })
    },
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

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
        @click="addUser"
      >添加</el-button>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      max-height="500"
      border
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" width="200" />
      <el-table-column label="角色" width="100">
        <template slot-scope="{ row }">
          <el-tag
            v-if="row.roles.includes('ADMIN')"
            type="success"
          >管理员</el-tag>
          <el-tag v-else type="info">用户</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="{ row }">
          <el-tag v-if="row.enabled" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="在线" width="80">
        <template slot-scope="{ row }">
          <el-tag v-if="row.online" type="success">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="creationTime"
        label="创建时间"
        width="200"
        :formatter="timeFormatter"
      />
      <el-table-column
        prop="modificationTime"
        label="修改时间"
        width="200"
        :formatter="timeFormatter"
      />
      <el-table-column label="操作" width="300" fixed="right">
        <template slot-scope="{ row, $index }">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            :disabled="row.id === $store.getters.id"
            @click="handleEdit(row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-remove"
            :disabled="row.id === $store.getters.id || !row.online"
            @click="handleLogout(row, $index)"
          >下线</el-button><el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            :disabled="row.id === $store.getters.id"
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

    <users-dialog
      :visible.sync="dialogVisible"
      :data="dialogData"
      :action="dialogAction"
      @success="onSubmitSuccess"
    />
  </div>
</template>

<script>
import UsersDialog from './components/UsersDialog'
import { listUsers, deleteUser, logout } from '@/api/user'
import { parseTime } from '@/utils'

export default {
  name: 'Users',
  components: { UsersDialog },
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
        const { users, total, online } = (
          await listUsers({
            size: this.pageSize,
            page: this.currentPage - 1,
            sort: this.tableSort
          })
        ).data
        users.forEach((user) => (user.online = online.includes(user.id)))
        console.debug('users:', users)
        this.tableData = users
        this.totalData = total
      } catch (e) {
        console.debug('Failed to list users:', e)
        this.$message({
          message: '获取用户列表失败',
          type: 'error'
        })
      }
      this.tableLoading = false
    },
    handleEdit(user) {
      this.dialogData = user
      this.dialogAction = 'edit'
      this.dialogVisible = true
    },
    async handleDelete(user) {
      try {
        await this.$confirm(
          `是否确认删除用户'${user.username}'？将删除该用户关联的所有商品！`,
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
        await deleteUser(user.id)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getData()
      } catch (e) {
        console.debug(`Failed to delete user '${user.username}'. Error:`, e)
        this.$message({
          message: '删除失败',
          type: 'error'
        })
      }
      this.tableLoading = false
    },
    async handleLogout(user, index) {
      console.debug(arguments)
      try {
        await this.$confirm(`是否确认将用户${user.username}踢下线？`, '警告', {
          type: 'warning'
        })
      } catch {
        return
      }
      try {
        await logout(user.id)
        this.$message({
          message: '下线成功',
          type: 'success'
        })
        this.tableData[index].online = false
      } catch (e) {
        console.debug(`Failed to kick user '${user.username}'. Error:`, e)
        this.$message({
          message: '下线失败',
          type: 'error'
        })
      }
    },
    addUser() {
      this.dialogData = {}
      this.dialogAction = 'create'
      this.dialogVisible = true
    },
    onSubmitSuccess(data) {
      console.debug('Submit succeeded:', data)
      this.getData()
    },
    timeFormatter: (row, col, val) => parseTime(val),
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

<template>
  <div class="container">
    <div class="controls-container">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addUser"
      >添加</el-button>
    </div>
    <el-table :data="tableData" :loading="tableLoading" :height="500" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" width="200" />
      <el-table-column label="角色" width="200">
        <template slot-scope="{ row }">
          <el-tag v-if="row.roles.includes('ADMIN')" type="success">管理员</el-tag>
          <el-tag v-else>用户</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creationTime" label="创建时间" width="300" :formatter="timeFormatter" />
      <el-table-column prop="modificationTime" label="修改时间" width="300" :formatter="timeFormatter" />
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
import { listUsers, deleteUser } from '@/api/user'
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
        const { users } = (await listUsers()).data
        console.debug('users:', users)
        this.tableData = users
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
        await this.$confirm(`是否确认删除用户'${user.username}'？将删除该用户关联的所有商品！`, '警告', {
          confirmButtonClass: 'el-button--danger',
          type: 'warning'
        })
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
        console.debug(`Failed to delete user '${user.name}'. Error:`, e)
        this.$message({
          message: '删除失败',
          type: 'error'
        })
      }
      this.tableLoading = false
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
    timeFormatter: (row, col, val) => parseTime(val)
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

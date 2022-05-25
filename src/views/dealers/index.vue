<template>
  <div class="container">
    <div class="controls-container">
      <el-button type="primary" icon="el-icon-plus" @click="addDealer">添加</el-button>
    </div>
    <el-table :data="tableData" :height="500" border>
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="contact" label="联系人">
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
      <el-table-column prop="phone" label="联系电话" />
      <el-table-column prop="address" label="地址" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { listDealers, deleteDealer } from '@/api/dealers'

export default {
  name: 'Dealers',
  data() {
    return {
      tableData: [
        {
          id: 0,
          name: 'test',
          contact: {
            name: 'contact',
            phone: '12345678'
          },
          phone: '12345',
          address: 'address'
        }
      ]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData(index, row) {
      const { dealers } = (await listDealers()).data
      console.debug('dealers:', dealers)
      if (dealers && dealers.length > 0) {
        this.tableData = dealers
      }
    },
    handleEdit(index, dealer) {
      console.debug('edit:', arguments)
    },
    handleDelete(index, dealer) {
      console.debug('delete:', arguments)
      this.$confirm(`是否确认删除经销商'${dealer.name}'？`, '提示', {
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      })
        .then(() => {
          deleteDealer(dealer.id)
            .then(() => {
              this.$message('删除成功')
              this.getData()
            })
            .catch((error) => {
              console.debug(
                `Failed to delete dealer '${dealer.name}'. Error:`,
                error
              )
              this.$message({
                message: '删除失败',
                type: 'error'
              })
            })
        })
        .catch(() => {})
    },
    addDealer() {
      console.debug('addDealer')
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

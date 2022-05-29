<template>
  <div>
    <el-table v-loading="loading" :data="pagedData" height="500" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="gender" label="性别" width="60">
        <template slot-scope="{ row }">
          <el-tag type="primary">{{
            row.gender === 'MALE' ? '男' : '女'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="birthDate" label="生日" :formatter="dateFormatter" width="150" />
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
    </el-table>

    <el-pagination
      class="pagination"
      layout="total, sizes, prev, pager, next, jumper"
      :pager-count="13"
      :page-sizes="[5, 10, 20, 50]"
      :page-size.sync="pageSize"
      :current-page.sync="currentPage"
      :total="customers.length"
    />
  </div>
</template>

<script>
import { parseTime } from '@/utils'

export default {
  props: {
    customers: {
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
      return this.customers.slice(start, start + this.pageSize)
    }
  },
  methods: {
    dateFormatter: (row, col, val) => parseTime(val, '{y}年{m}月{d}日')
  }
}
</script>

<style scoped>
.pagination {
  margin: 20px;
}
</style>

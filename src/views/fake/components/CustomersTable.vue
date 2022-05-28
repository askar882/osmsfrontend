<template>
  <div>
    <el-table v-loading="loading" :data="customers" height="500px">
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
      <el-table-column prop="birthData" label="生日" :formatter="dateFormatter" width="150" />
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
  methods: {
    dateFormatter: (row, col, val) => parseTime(val, '{y}年{m}月{d}日')
  }
}
</script>

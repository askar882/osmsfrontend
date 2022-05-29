<template>
  <div>
    <el-table v-loading="loading" :data="pagedData" max-height="500px" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="名称" width="200" />
      <el-table-column prop="code" label="代码" width="300" />
      <el-table-column prop="description" label="详情" />
      <el-table-column prop="price" label="单价" width="80" :formatter="priceFormatter" />
      <el-table-column prop="dealer.name" label="经销商" width="150" />
    </el-table>

    <el-pagination
      class="pagination"
      layout="total, sizes, prev, pager, next, jumper"
      :pager-count="13"
      :page-sizes="[5, 10, 20, 50]"
      :page-size.sync="pageSize"
      :current-page.sync="currentPage"
      :total="products.length"
    />
  </div>
</template>

<script>
import { priceFormatter } from '@/utils'

export default {
  props: {
    products: {
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
      return this.products.slice(start, start + this.pageSize)
    }
  },
  methods: {
    priceFormatter: priceFormatter
  }
}
</script>

<style scoped>
.pagination {
  margin: 20px;
}
</style>

<template>
  <div>
    <el-table v-loading="loading" :data="products" height="500px">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="code" label="代码" />
      <el-table-column prop="description" label="详情" />
      <el-table-column prop="price" label="单价" width="80" :formatter="priceFormatter" />
      <el-table-column prop="dealer.name" label="经销商" />
    </el-table>
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
  methods: {
    priceFormatter: priceFormatter
  }
}
</script>

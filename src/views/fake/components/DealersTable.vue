<template>
  <div>
    <el-table v-loading="loading" :data="pagedData" height="500" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="contact.name" label="联系人姓名" />
      <el-table-column prop="contact.phone" label="联系人电话" />
      <el-table-column prop="contact.email" label="联系人邮箱" />
      <el-table-column prop="phone" label="联系电话" />
      <el-table-column prop="address" label="地址" />
    </el-table>

    <el-pagination
      class="pagination"
      layout="total, sizes, prev, pager, next, jumper"
      :pager-count="13"
      :page-sizes="[5, 10, 20, 50]"
      :page-size.sync="pageSize"
      :current-page.sync="currentPage"
      :total="dealers.length"
    />
  </div>
</template>

<script>
export default {
  props: {
    dealers: {
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
      return this.dealers.slice(start, start + this.pageSize)
    }
  }
}
</script>

<style scoped>
.pagination {
  margin: 20px;
}
</style>

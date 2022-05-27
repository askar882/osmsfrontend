<template>
  <div>
    <el-table :data="dealers" height="500px">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="contact.name" label="联系人姓名" />
      <el-table-column prop="contact.phone" label="联系人电话" />
      <el-table-column prop="contact.email" label="联系人邮箱" />
      <el-table-column prop="phone" label="联系电话" />
      <el-table-column prop="address" label="地址" />
    </el-table>
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
  }
}
</script>

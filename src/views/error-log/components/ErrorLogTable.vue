<template>
  <el-table :data="errorLogs" border>
    <el-table-column label="错误">
      <template slot-scope="{ row }">
        <div>
          <span class="message-title">消息:</span>
          <el-tag type="danger">
            {{ row.err.message }}
          </el-tag>
        </div>

        <div>
          <span class="message-title" style="padding-right: 10px">信息: </span>
          <el-tag type="warning">
            {{ row.vm.$vnode.tag }} error in {{ row.info }}
          </el-tag>
        </div>

        <div>
          <span class="message-title" style="padding-right: 16px">URL: </span>
          <el-tag type="success">
            {{ row.url }}
          </el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="异常栈">
      <template slot-scope="scope">
        {{ scope.row.err.stack }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'ErrorLogTable',
  props: {
    errorLogs: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

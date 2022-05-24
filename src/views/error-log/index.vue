<template>
  <div class="errPage-container">
    <el-button
      type="danger"
      icon="el-icon-delete"
      style="margin-bottom: 10px; float: right;"
      :disabled="errorLogs.length <= 0"
      @click="clearAll"
    >
      清除日志
    </el-button>
    <error-log-table :error-logs="errorLogs" />
  </div>
</template>

<script>
import ErrorLogTable from './components/ErrorLogTable'

export default {
  name: 'ErrorLog',
  components: { ErrorLogTable },
  computed: {
    errorLogs() {
      return this.$store.getters.errorLogs
    }
  },
  methods: {
    clearAll() {
      this.$store.dispatch('errorLog/clearErrorLog')
    }
  }
}
</script>

<style scoped>
  .errPage-container {
    padding: 30px;
  }
</style>

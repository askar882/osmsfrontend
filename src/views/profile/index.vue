<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="用户信息" name="info">
          <el-table :show-header="false" :data="tableData" border>
            <el-table-column :width="180" prop="label" />
            <el-table-column prop="value" />
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="信息编辑" name="edit">
          <el-form ref="form" :model="formData" :rules="formRules">
            <el-form-item label="用户名" prop="username">
              <el-input v-model.trim="formData.username" maxlength="20" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model.trim="formData.password" type="password" placeholder="留空代表不修改密码" maxlength="20" />
            </el-form-item>
            <el-form-item label="确认密码" prop="password2">
              <el-input v-model.trim="formData.password2" type="password" placeholder="留空代表不修改密码" maxlength="20" />
            </el-form-item>
            <el-form-item>
              <el-button :loading="loading" type="primary" @click="submit">保存</el-button>
              <el-button type="warning" @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { parseTime } from '@/utils'
import { updateUser } from '@/api/user'

export default {
  name: 'Profile',
  data() {
    const validPattern = '[a-zA-Z0-9_\-]+'
    const passwordValidator = (rule, value, callback) => {
      if (value) {
        if (value.length < 5 || value.length > 20) {
          return callback(new Error('密码长度应大于5小于20'))
        }
        if (!(new RegExp(validPattern)).test(value)) {
          return callback(new Error('密码只能包含英文大小写字母、数字、横杠(-)和下划线(_)'))
        }
      }
      callback()
    }
    const password2Validator = (rule, value, callback) => {
      if (this.formData.password !== value) {
        callback(new Error('两次输入的密码不一样'))
      }
      callback()
    }
    return {
      activeTab: 'info',
      formData: {
        username: this.$store.getters.name,
        password: '',
        password2: ''
      },
      formRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 5, max: 20, message: '用户名长度应大于5小于20', trigger: 'blur' },
          { pattern: validPattern, message: '用户名只能包含英文大小写字母、数字、横杠(-)和下划线(_)', trigger: ['change', 'blur'] }
        ],
        password: [
          { validator: passwordValidator, trigger: 'blur' }
        ],
        password2: [
          { validator: password2Validator, trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  computed: {
    ...mapState(['user']),
    tableData() {
      return [
        { label: '用户名', value: this.user.name },
        { label: '用户ID', value: this.user.id },
        { label: '角色', value: this.$store.getters.admin ? '管理员' : '用户' },
        { label: '创建时间', value: parseTime(this.user.creation) },
        { label: '修改时间', value: parseTime(this.user.modification) },
        { label: 'Token过期时间', value: parseTime(this.user.expiration) }
      ]
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.$message({
            message: '表单验证失败',
            type: 'error',
            duration: 2 * 1000
          })
          return false
        }
        this.loading = true
        updateUser(this.user.id, this.formData).then(() => {
          this.$message({
            message: '用户信息更新成功，请重新登录',
            type: 'success',
            duration: 3 * 1000
          })
          this.$store.dispatch('user/logout').then(() => this.$router.push(`/login?redirect=${this.$route.fullPath}`))
          this.loading = false
        }).catch(() => {
          this.$message({
            message: '用户信息更新失败',
            type: 'error',
            duration: 3 * 1000
          })
          this.loading = false
        })
      })
    },
    // FIXME: 重置后浏览器提示保存/更新密码
    resetForm() {
      this.formData = {
        username: this.user.name,
        password: '',
        password2: ''
      }
    }
  }
}
</script>

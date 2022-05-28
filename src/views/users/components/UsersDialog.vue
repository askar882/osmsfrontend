<template>
  <el-dialog
    :title="(action === 'create' ? '添加' : '修改') + '用户'"
    :visible.sync="innerVisible"
    :close-on-click-modal="false"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      label-position="right"
      label-width="100px"
      :rules="formRules"
      :model="formData"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="password2">
        <el-input v-model="formData.password2" type="password" />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="角色" prop="role">
            <el-select v-model="formData.role">
              <el-option label="用户" value="USER" />
              <el-option label="管理员" value="ADMIN" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="enabled">
            <el-switch
              v-model="formData.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="禁用"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="innerVisible = false">取消</el-button>
      <el-button
        type="primary"
        :loading="submitting"
        @click="submit"
      >提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { alphanumericRegex } from '@/utils/regex'
import { createUser, updateUser } from '@/api/user'
import { deepClone } from '@/utils'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: 'create',
      validator: (value) => ['create', 'edit'].includes(value)
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const password2Validator = (rule, value, callback) => {
      if (this.formData.password !== value) {
        callback(new Error('两次输入的密码不一样'))
      }
      callback()
    }
    const alphanumericRule = {
      pattern: alphanumericRegex.source,
      message: '格式错误，仅支持大小写字母和数字',
      trigger: 'change'
    }
    return {
      dummyData: {
        username: '',
        password: '',
        password2: '',
        role: 'USER',
        enabled: true
      },
      formData: {},
      formRules: {},
      editRules: {
        username: [
          alphanumericRule,
          { min: 5, max: 20, message: '长度应大于5小于20', trigger: 'blur' }
        ],
        password: [
          alphanumericRule,
          { min: 2, max: 30, message: '长度应大于5小于30', trigger: 'blur' }
        ],
        password2: [{ validator: password2Validator, trigger: 'blur' }]
      },
      submitting: false
    }
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    createRules() {
      const rules = deepClone(this.editRules)
      const required = { required: true, message: '此项必填', trigger: 'blur' }
      rules.username.push(required)
      rules.password.push(required)
      rules.password2.push(required)
      return rules
    }
  },
  created() {
    // 为了复用dummyData
    this.formData = deepClone(this.dummyData)
  },
  methods: {
    dialogOpen() {
      this.submitting = false
      this.formData = deepClone(this.dummyData)
      if (this.action === 'create') {
        this.formRules = this.createRules
      } else {
        this.formRules = this.editRules
        const { roles, ...user } = deepClone(this.data)
        user.role = roles.includes('ADMIN') ? 'ADMIN' : 'USER'
        this.formData = user
      }
      this.$nextTick(() => this.$refs?.form?.clearValidate())
    },
    async submit() {
      try {
        await this.$refs.form.validate()
      } catch (e) {
        console.debug('Form validation failed: ', e)
        this.$message({
          message: '表单验证失败',
          type: 'error'
        })
        return false
      }
      this.formData.roles =
        this.formData.role === 'ADMIN' ? ['ADMIN'] : ['USER']
      this.submitting = true
      let action = this.createData
      if (this.action === 'edit') {
        action = this.updateData
      }
      try {
        const data = await action()
        this.$message({
          message: '提交成功',
          type: 'success'
        })
        this.innerVisible = false
        this.$emit('success', data)
      } catch (e) {
        console.debug('Submit failed:', e)
        this.$message({
          message: '提交失败',
          type: 'error'
        })
      }
      this.submitting = false
    },
    async createData() {
      return (await createUser(this.formData)).data.user
    },
    async updateData() {
      return (await updateUser(this.data.id, this.formData)).data.user
    }
  }
}
</script>

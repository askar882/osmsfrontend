<template>
  <el-dialog
    :title="(action === 'create' ? '添加' : '修改') + '客户'"
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
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="formData.gender">
          <el-option label="男" value="MALE" />
          <el-option label="女" value="FEMALE" />
        </el-select>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="formData.phone" />
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker v-model="formData.birthDate" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" />
      </el-form-item>
      <el-form-item
        v-for="(address, index) in formData.addresses"
        :key="index"
        label="地址"
        :prop="`addresses.${index}`"
        :rules="formRules.address"
      >
        <el-row :gutter="20" type="flex" justify="space-between">
          <el-col :span="20">
            <el-input v-model="formData.addresses[index]" />
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click="addAddress(index)"
            />
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-delete"
              :disabled="formData.addresses.length < 2"
              @click="deleteAddress(index)"
            />
          </el-col>
        </el-row>
      </el-form-item>
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
import { nameRegex } from '@/utils/regex'
import { createCustomer, updateCustomer } from '@/api/customers'
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
    return {
      dummyData: {
        name: '',
        gender: 'MALE',
        phone: '',
        email: '',
        addresses: ['']
      },
      formData: {},
      formRules: {},
      editRules: {
        name: [
          {
            pattern: nameRegex.source,
            message: '姓名格式错误',
            trigger: 'change'
          },
          { min: 2, max: 20, message: '长度应大于2小于20', trigger: 'blur' }
        ],
        gender: [],
        email: [{ type: 'email', message: '邮箱格式错误', trigger: 'change' }],
        phone: [
          { pattern: '^[0-9\-]*$', message: '电话格式错误', trigger: 'change' },
          { min: 7, max: 20, message: '长度应大于7小于20', trigger: 'blur' }
        ],
        address: [{ min: 5, message: '长度应大于5', trigger: 'blur' }]
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
      rules.name.push(required)
      rules.gender.push(required)
      rules.phone.push(required)
      rules.address.push(required)
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
        const { id, orders, addressesTree, ...customer } = deepClone(this.data)
        this.formData = customer
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
      return (await createCustomer(this.formData)).data.customer
    },
    async updateData() {
      return (await updateCustomer(this.data.id, this.formData)).data.customer
    },
    addAddress(index) {
      this.formData.addresses.splice(index + 1, 0, '')
    },
    deleteAddress(index) {
      this.formData.addresses.splice(index, 1)
    }
  }
}
</script>

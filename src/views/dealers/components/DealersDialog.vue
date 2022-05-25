<template>
  <el-dialog
    :title="(action === 'create' ? '添加' : '修改') + '经销商'"
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
      <el-form-item label="经销商名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="联系人姓名" prop="contact.name">
        <el-input v-model="formData.contact.name" />
      </el-form-item>
      <el-form-item label="联系人电话" prop="contact.phone">
        <el-input v-model="formData.contact.phone" />
      </el-form-item>
      <el-form-item label="联系人邮箱" prop="contact.email">
        <el-input v-model="formData.contact.email" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="formData.phone" />
      </el-form-item>
      <el-form-item label="经销商地址" prop="address">
        <el-input v-model="formData.address" />
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
import { chineseEnglishRegex, nameRegex } from '@/utils/regex'
import { createDealer, updateDealer } from '@/api/dealers'
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
    const phoneRules = [
      { pattern: '^[0-9\-]*$', message: '电话格式错误', trigger: 'change' },
      { min: 7, max: 20, message: '长度应大于7小于20', trigger: 'blur' }
    ]
    return {
      dummyData: {
        name: '',
        contact: {
          name: '',
          phone: '',
          email: ''
        },
        phone: ''
      },
      formData: {},
      formRules: {},
      editRules: {
        name: [
          {
            pattern: chineseEnglishRegex.source,
            message: '格式错误',
            trigger: 'change'
          },
          { min: 2, max: 50, message: '长度应大于2小于50', trigger: 'blur' }
        ],
        contact: {
          name: [
            {
              pattern: nameRegex.source,
              message: '姓名格式错误',
              trigger: 'change'
            },
            { min: 2, max: 20, message: '长度应大于2小于20', trigger: 'blur' }
          ],
          phone: phoneRules,
          email: [{ type: 'email', message: '邮箱格式错误', trigger: 'change' }]
        },
        phone: phoneRules,
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
      rules.contact.name.push(required)
      rules.contact.phone.push(required)
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
        const { id, products, ...dealer } = deepClone(this.data)
        this.formData = dealer
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
      return (await createDealer(this.formData)).data.dealer
    },
    async updateData() {
      return (await updateDealer(this.data.id, this.formData)).data.dealer
    }
  }
}
</script>

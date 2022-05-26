<template>
  <el-dialog
    :title="(action === 'create' ? '添加' : '修改') + '商品'"
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
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="代码" prop="code">
        <el-input v-model="formData.code" />
      </el-form-item>
      <el-form-item label="详情" prop="description">
        <el-input v-model="formData.description" />
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-input v-model="formData.price" type="number" :min="0" />
      </el-form-item>
      <el-form-item label="经销商" prop="dealer.id">
        <el-select
          v-model="formData.dealer.id"
          :disabled="action === 'edit'"
          filterable
        >
          <el-option
            v-for="(dealer, index) in dealers"
            :key="index"
            :value="dealer.id"
            :label="dealer.name"
          />
        </el-select>
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
import { alphanumericRegex } from '@/utils/regex'
import { createProduct, updateProduct } from '@/api/products'
import { listDealers } from '@/api/dealers'
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
        code: '',
        description: '',
        price: 0,
        dealer: {
          id: null
        }
      },
      formData: {},
      formRules: {},
      editRules: {
        name: [
          {
            pattern: '^\\w*$',
            message: '格式错误',
            trigger: 'change'
          },
          { min: 2, max: 50, message: '长度应大于2小于50', trigger: 'blur' }
        ],
        code: [{ pattern: alphanumericRegex.source, message: '格式错误', trigger: 'change' }],
        description: [{ min: 10, message: '长度应大于10', trigger: 'blur' }],
        price: []
      },
      submitting: false,
      dealers: []
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
      rules.code.push(required)
      rules.description.push(required)
      rules.price.push(required)
      rules.dealer = {
        id: [required]
      }
      return rules
    }
  },
  created() {
    // 为了复用dummyData
    this.formData = deepClone(this.dummyData)
    listDealers()
      .then(({ data }) => (this.dealers = data.dealers))
      .catch((e) => {
        console.debug(e)
        this.$message({
          message: '获取经销商列表失败',
          type: 'error'
        })
      })
  },
  methods: {
    dialogOpen() {
      this.submitting = false
      this.formData = deepClone(this.dummyData)
      if (this.action === 'create') {
        this.formRules = this.createRules
      } else {
        this.formRules = this.editRules
        const { id, dealer, ...product } = this.data
        product.dealer = { id: dealer.id }
        this.formData = product
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
      return (await createProduct(this.formData)).data.product
    },
    async updateData() {
      return (await updateProduct(this.data.id, this.formData)).data.product
    }
  }
}
</script>

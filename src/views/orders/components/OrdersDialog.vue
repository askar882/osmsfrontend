<template>
  <el-dialog
    :title="(action === 'create' ? '添加' : '修改') + '订单'"
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
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="客户" prop="customer.id" :rules="formRules.customerId">
            <el-select
              v-model="formData.customer.id"
              :disabled="action === 'edit'"
              filterable
            >
              <el-option
                v-for="(customer, index) in customers"
                :key="index"
                :value="customer.id"
                :label="customer.name"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="运费" prop="shippingCost">
            <el-input v-model="formData.shippingCost" type="number" :min="0" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="地址" prop="address">
        <el-select
          v-model="formData.address"
          :disabled="action === 'edit' || customerAddresses.length < 1"
          filterable
        >
          <el-option
            v-for="(address, index) in customerAddresses"
            :key="index"
            :value="address"
            :label="address"
          />
        </el-select>
      </el-form-item>

      <el-row
        v-for="(orderItem, index) in formData.orderItems"
        :key="index"
        :gutter="20"
        type="flex"
        justify="space-between"
      >
        <el-col :span="12">
          <el-form-item
            label="产品"
            :prop="`orderItems.${index}.product.id`"
            :rules="formRules.productId"
          >
            <el-select
              v-model="formData.orderItems[index].product.id"
              :disabled="action === 'edit'"
              filterable
            >
              <el-option
                v-for="(product, productIndex) in products"
                :key="productIndex"
                :value="product.id"
                :label="product.name + '(' + product.code + ')'"
                :disabled="productSelected(product.id)"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item
            label="数量"
            :prop="`orderItems.${index}.count`"
            :rules="formRules.orderCount"
          >
            <el-input
              v-model="formData.orderItems[index].count"
              type="number"
              :min="1"
              :disabled="action === 'edit'"
            />
          </el-form-item>
        </el-col>
        <el-col :offset="2" :span="2">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            :disabled="action === 'edit' || filteredProducts.length < 1"
            @click="addOrderItem(index)"
          />
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-delete"
            :disabled="formData.orderItems.length < 2 || action === 'edit'"
            @click="deleteOrderItem(index)"
          />
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
import { createOrder, updateOrder } from '@/api/orders'
import { listCustomers } from '@/api/customers'
import { deepClone } from '@/utils'
import { listProducts } from '@/api/products'

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
    const required = { required: true, message: '此项必填', trigger: 'blur' }
    return {
      dummyData: {
        customer: { id: null },
        shippingCost: 0,
        orderItems: [{ product: { id: null }, count: 1 }]
      },
      formData: {},
      formRules: {},
      editRules: {},
      createRules: {
        customerId: [required],
        shippingCost: [required],
        address: [required],
        orderCount: [required],
        productId: [required]
      },
      submitting: false,
      customers: [],
      products: []
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
    filteredProducts() {
      return this.products.filter(
        (product) =>
          this.formData.orderItems.find(
            (item) => item.product.id === product.id
          ) === undefined
      )
    },
    customerAddresses() {
      const customerId = this.formData.customer.id
      if (![undefined, null, ''].includes(customerId)) {
        return this.customers.find((customer) => customer.id === customerId)
          .addresses
      }
      return []
    }
  },

  created() {
    this.formRules = this.createRules
    // 为了复用dummyData
    this.formData = deepClone(this.dummyData)
    listCustomers()
      .then(({ data }) => (this.customers = data.customers))
      .catch((e) => {
        console.debug(e)
        this.$message({
          message: '获取客户列表失败',
          type: 'error'
        })
      })
    listProducts()
      .then(({ data }) => (this.products = data.products))
      .catch((e) => {
        console.debug(e)
        this.$message({
          message: '获取商品列表失败',
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
        const { id, customer, ...order } = this.data
        order.customer = { id: customer.id }
        this.formData = order
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
      return (await createOrder(this.formData)).data.order
    },
    async updateData() {
      return (await updateOrder(this.data.id, this.formData)).data.order
    },
    addOrderItem(index) {
      this.formData.orderItems.splice(index + 1, 0, {
        product: { id: null },
        count: 1
      })
    },
    deleteOrderItem(index) {
      this.formData.orderItems.splice(index, 1)
    },
    productSelected(productId) {
      return !!this.formData.orderItems.find(item => item.product.id === productId)
    }
  }
}
</script>

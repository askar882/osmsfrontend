<template>
  <div class="container">
    <div class="controls-container">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addProduct"
      >添加</el-button>
    </div>
    <el-table :data="tableData" :loading="tableLoading" :height="500" border>
      <el-table-column prop="id" label="ID" :width="60" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="code" label="代码" />
      <el-table-column prop="description" label="详情" />
      <el-table-column prop="price" label="单价" />
      <el-table-column label="经销商">
        <template slot-scope="{ row }">
          <el-tooltip placement="top">
            <div slot="content">ID: {{ row.dealer.id }}</div>
            <p>{{ row.dealer.name }}</p>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit(row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <products-dialog
      :visible.sync="dialogVisible"
      :data="dialogData"
      :action="dialogAction"
      @success="onSubmitSuccess"
    />
  </div>
</template>

<script>
import ProductsDialog from './components/ProductsDialog'
import { listProducts, deleteProduct } from '@/api/products'

export default {
  name: 'Products',
  components: { ProductsDialog },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      dialogData: {},
      dialogAction: 'create',
      tableLoading: false
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.tableLoading = true
      try {
        const { products } = (await listProducts()).data
        console.debug('products:', products)
        this.tableData = products
      } catch (e) {
        console.debug('Failed to list products:', e)
        this.$message({
          message: '获取商品列表失败',
          type: 'error'
        })
      }
      this.tableLoading = false
    },
    handleEdit(product) {
      this.dialogData = product
      this.dialogAction = 'edit'
      this.dialogVisible = true
    },
    async handleDelete(product) {
      try {
        await this.$confirm(`是否确认删除商品'${product.name}'？`, '提示', {
          confirmButtonClass: 'el-button--danger',
          type: 'warning'
        })
      } catch {
        return false
      }
      this.tableLoading = true
      try {
        await deleteProduct(product.id)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getData()
      } catch (e) {
        console.debug(`Failed to delete product '${product.name}'. Error:`, e)
        this.$message({
          message: '删除失败',
          type: 'error'
        })
      }
      this.tableLoading = false
    },
    addProduct() {
      this.dialogData = {}
      this.dialogAction = 'create'
      this.dialogVisible = true
    },
    onSubmitSuccess(data) {
      console.debug('Submit succeeded:', data)
      this.getData()
    }
  }
}
</script>

<style scoped>
.container {
  margin: 20px;
}

.controls-container {
  margin-bottom: 10px;
  padding: 0 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

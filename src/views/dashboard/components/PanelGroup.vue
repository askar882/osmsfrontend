<template>
  <el-row :gutter="40" type="flex" justify="space-around" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="span" class="card-panel-col">
      <div class="card-panel" @click="selectionChanged('dealer')">
        <div class="card-panel-icon-wrapper icon-dealer">
          <svg-icon icon-class="dealer" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">经销商</div>
          <count-to
            :start-val="0"
            :end-val="dataCount.dealer || 0"
            :duration="3000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="span" class="card-panel-col">
      <div class="card-panel" @click="selectionChanged('customers')">
        <div class="card-panel-icon-wrapper icon-customer">
          <svg-icon icon-class="customer" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">客户</div>
          <count-to
            :start-val="0"
            :end-val="dataCount.customer || 0"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="span" class="card-panel-col">
      <div class="card-panel" @click="selectionChanged('products')">
        <div class="card-panel-icon-wrapper icon-product">
          <svg-icon icon-class="product" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">商品</div>
          <count-to
            :start-val="0"
            :end-val="dataCount.product || 0"
            :duration="3200"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="span" class="card-panel-col">
      <div class="card-panel" @click="selectionChanged('orders')">
        <div class="card-panel-icon-wrapper icon-order">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">订单</div>
          <count-to
            :start-val="0"
            :end-val="dataCount.order || 0"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="span" class="card-panel-col">
      <div class="card-panel" @click="selectionChanged('users')">
        <div class="card-panel-icon-wrapper icon-user">
          <svg-icon icon-class="user" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">用户</div>
          <count-to
            :start-val="0"
            :end-val="dataCount.user || 0"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: { CountTo },
  props: {
    dataCount: {
      type: Object,
      required: true
    }
  },
  computed: {
    span() {
      return this.$store.getters.roles.includes('ADMIN') ? 4 : 6
    }
  },
  methods: {
    selectionChanged(type) {
      this.$emit('selectionChanged', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-customer {
        background: #40c9c6;
      }

      .icon-dealer {
        background: #36a3f7;
      }

      .icon-product {
        background: #f4516c;
      }

      .icon-order {
        background: #34bfa3;
      }

      .icon-user {
        background: #3f51b5;
      }
    }

    .icon-customer {
      color: #40c9c6;
    }

    .icon-dealer {
      color: #36a3f7;
    }

    .icon-product {
      color: #f4516c;
    }

    .icon-order {
      color: #34bfa3;
    }

    .icon-user {
      color: #3f51b5;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>

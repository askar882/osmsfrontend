<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import statistics from '@/api/statistics'
import { priceFormatter } from '@/utils'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    }
  },
  data() {
    return {
      chart: null,
      products: [],
      colorPalette: [
        '#a67c00',
        '#bf9b30',
        '#ffbf00',
        '#ffcf40',
        '#ffdc73',
        '#ff00a9',
        '#ea33ff',
        '#f496ff',
        '#428bca',
        '#5bc0de'
      ]
    }
  },
  computed: {
    legendData() {
      return this.products.map(({ product }) => product.name)
    },
    barData() {
      return this.products.map((product, index) => ({
        name: product.product.name,
        value: priceFormatter(null, null, product.expense),
        itemStyle: {
          color: this.colorPalette[index]
        }
      }))
    },
    lineData() {
      return this.products.map((product) => ({
        name: product.product.name,
        value: product.count
      }))
    }
  },
  async created() {
    try {
      this.products = (
        await statistics({ name: 'products', top: 10 })
      ).data.products
      // 如果已加载，重新加载
      if (this.chart) {
        this.initChart()
      }
    } catch (e) {
      console.debug(e)
      this.$message('获取经销商统计数据失败')
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.chart = echarts.init(this.$el, 'macarons')
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart.setOption({
        title: {
          text: '商品销售额Top 10排行',
          left: 'center',
          textStyle: {
            color: '#3f51b5',
            fontSize: '22'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#283b56'
            }
          }
        },
        legend: {
          left: 'left'
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: this.legendData
          }
        ],
        yAxis: [
          {
            type: 'value',
            scale: true,
            name: '销售额',
            min: 0
          },
          {
            type: 'value',
            scale: true,
            name: '销量',
            min: 0
          }
        ],
        series: [
          {
            name: '商品销售额',
            type: 'bar',
            yAxisIndex: 0,
            barGap: '20%',
            itemStyle: {
              normal: {
                color: '#ffbf00'
              }
            },
            data: this.barData
          },
          {
            name: '商品销售量',
            type: 'line',
            yAxisIndex: 1,
            data: this.lineData
          }
        ]
      })
    }
  }
}
</script>

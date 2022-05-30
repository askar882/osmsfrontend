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
      chartData: []
    }
  },
  computed: {
    legendData() {
      return this.chartData.map(data => data.name)
    }
  },
  async created() {
    try {
      const { dealers } = (await statistics({ name: 'dealers', top: 10 })).data
      this.chartData = dealers.map((dealer) => ({
        name: dealer.dealer.name,
        value: priceFormatter(null, null, dealer.expense)
      }))
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
          text: '经销商Top 10销售额占比',
          left: 'center',
          textStyle: {
            color: '#bf9b30'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          left: 'center',
          bottom: '10',
          data: this.legendData
        },
        series: [
          {
            name: '经销商总销售额占比',
            type: 'pie',
            roseType: 'radius',
            radius: [30, 150],
            center: ['50%', '50%'],
            data: this.chartData,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>

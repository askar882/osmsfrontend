<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import statistics from '@/api/statistics'

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
      chartData: [],
      states: {
        ordered: '已下单',
        shipping: '运输',
        delivered: '已收货'
      },
      colorPalette: ['#ff71ce', '#05ffa1', '#01cdfe']
    }
  },
  computed: {
    legendData() {
      return this.chartData.map((data) => data.name)
    }
  },
  activated() {
    this.getData()
  },
  created() {
    this.getData()
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
          text: '订单状态分布',
          left: 'center'
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
            name: '订单状态分布',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2
            },
            data: this.chartData,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    },
    async getData() {
      try {
        const { states } = (await statistics({ name: 'orderStates', top: 10 }))
          .data
        const data = Object.keys(states).map((state, index) => ({
          name: this.states[state],
          value: states[state],
          itemStyle: {
            color: this.colorPalette[index]
          }
        }))
        // 数据都为零时不加载图表
        if (data.every(state => state.value === 0)) {
          return
        }
        this.chartData = data
        if (this.chart) {
          this.initChart()
        }
      } catch (e) {
        console.debug(e)
        this.$message('获取订单状态统计数据失败')
      }
    }
  }
}
</script>

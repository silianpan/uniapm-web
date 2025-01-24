<template>
  <div ref="dom" class="charts chart-line"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from '@/view/apm/graph/theme.json'
import { on, off, getfilesize } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartLine',
  props: {
    value: Object,
    text: String,
    subtext: String
  },
  data() {
    return {
      dom: null
    }
  },
  methods: {
    resize() {
      this.dom.resize()
    },
    init() {
      this.$nextTick(() => {
        let legendData = this.value.legendData
        let seriesData = this.value.seriesData
        let graphUnits = this.value.graphUnits
        let option = {
          title: {
            text: this.text,
            subtext: this.subtext,
            x: 'center'
          },
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '16%',
            bottom: '36%'
          },
          legend: {
            data: legendData,
            // data: ['Context switches per second', 'Interrupts per second'],
            // orient: 'vertical',
            bottom: 0,
            x: '10%'
          },
          xAxis: {
            type: 'time',
            name: '时刻'
          },
          yAxis: {
            type: 'value',
            name: '值',
            axisTick: {
              inside: true
            },
            scale: true,
            axisLabel: {
              margin: 2,
              formatter: function(value, index) {
                return graphUnits === 'B' ? getfilesize(value) : value
              }
            }
          },
          series: seriesData
        }
        this.dom = echarts.init(this.$refs.dom, 'tdTheme')
        this.dom.setOption(option)
        if (this.autoRefresh === true) {
          this.initTimer()
        }
        on(window, 'resize', this.resize)
      })
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    off(window, 'resize', this.resize)
  },
  watch: {
    value() {
      this.init()
    }
  }
}
</script>

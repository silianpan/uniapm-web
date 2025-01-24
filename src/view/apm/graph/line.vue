<template>
  <div ref="dom" class="charts chart-line"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off, getfilesize } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartLine',
  props: {
    value: Object,
    text: String,
    subtext: String,
    updateSeriesDataAction: Function,
    autoRefresh: Boolean,
    interval: Number
  },
  data() {
    return {
      dom: null,
      timer: null,
      // 默认间隔1分钟
      defaultInterval: 60000
    }
  },
  methods: {
    resize() {
      this.dom.resize()
    },
    updateSeriesData() {
      if (!this._.isNil(this.updateSeriesDataAction) && this._.isFunction(this.updateSeriesDataAction)) {
        this.updateSeriesDataAction((data) => {
          this.dom.setOption({ series: [...data] })
        })
      }
    },
    initTimer() {
      this.clearTimer()
      let interval = (this.interval) > 0 ? this.interval : this.defaultInterval
      this.timer = window.setInterval(() => {
        let params = {}
        this.updateSeriesData(params)
      }, interval)
    },
    clearTimer() {
      if (this.timer) {
        window.clearInterval(this.timer)
      }
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
            bottom: legendData.length >= 6 ? '36%' : legendData.length >= 3 ? '26%' : '22%'
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
    this.clearTimer()
  },
  watch: {
    value() {
      this.init()
    }
  }
}
</script>

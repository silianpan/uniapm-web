<template>
  <div ref="dom" style="height: 300px;" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
export default {

  data() {
    return {
      value: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      },
      text: '告警信息',
      subtext: '告警信息子标题'
    }
  },
  mounted() {
    this.$nextTick(() => {
      let xAxisData = Object.keys(this.value)
      let seriesData = Object.values(this.value)
      let option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        xAxis: {
          type: 'category',
          data: xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: seriesData,
            type: 'bar'
          }
        ]
      }
      let dom = echarts.init(this.$refs.dom)
      dom.setOption(option)
    })
  }
}
</script>

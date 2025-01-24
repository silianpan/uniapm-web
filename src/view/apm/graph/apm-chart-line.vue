<template>
<Card bordered>
  <p slot="title" style="height:30px;width:100%;">
    <Select v-model="params.timeRange" size="small" style="width:100px" @on-change="timeRangeChangeClick" placeholder="默认1小时">
      <Option v-for="item in timeRangeData" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <DatePicker v-model="params.customTimeRange" size="small" style="margin-left:10px" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="自定义" @input="timeRangeChangeClick"  ></DatePicker>
  </p>
  <Spin fix v-if="loading"></Spin>
  <chart-line ref="graph" :autoRefresh="true" :updateSeriesDataAction="updateSeriesData" style="height: 400px;" :value="graph" :text="graph.name" />
</Card>
</template>

<script>
import ChartLine from './line'
import { GraphsService } from '@/api/apm/graph'
import { timeRange } from './timeRange.js'
export default {
  name: 'ApmChartLine',
  components: {
    ChartLine
  },
  props: {
    graph: {
      type: Object,
      default: function() {
        return {}
      }
    },
    timeRangeData: {
      type: Array,
      default: function() {
        return [
          {
            label: '1小时',
            value: '1小时'
          },
          {
            label: '3小时',
            value: '3小时'
          },
          {
            label: '6小时',
            value: '6小时'
          },
          {
            label: '12小时',
            value: '12小时'
          },
          {
            label: '1天',
            value: '1天'
          },
          {
            label: '今天',
            value: '今天'
          },
          {
            label: '昨天',
            value: '昨天'
          },
          {
            label: '最近7天',
            value: '最近7天'
          },
          {
            label: '最近30天',
            value: '最近30天'
          },
          {
            label: '最近1年',
            value: '最近1年'
          }
        ]
      }
    },
    timeRangeMap: {
      type: Object,
      default: function() {
        return timeRange
      }
    }
  },
  data() {
    return {
      loading: false,
      params: {
        timeRange: '1小时',
        customTimeRange: undefined
      }
    }
  },
  methods: {
    updateSeriesData: function(callBack) {
      let p = this.timeRangeMap[this.params.timeRange]
      if (!this._.isNil(this.params.customTimeRange) && this.params.customTimeRange.length === 2) {
        if (this._moment(this.params.customTimeRange[0]).isValid() && this._moment(this.params.customTimeRange[1]).isValid()) {
          let startTime = this._moment(this.params.customTimeRange[0]).format('X')
          let endTime = this._moment(this.params.customTimeRange[1]).format('X')
          p = {
            start_time: startTime,
            end_time: endTime
          }
        }
      }
      if (this._.isNil(this.graph.graphid)) {
        GraphsService.updateGenGraphEchartsByHostIdAndItemId({ itemid: this.graph.itemid, ...p }).then(res => {
          if (res.ok()) {
            callBack(res.data)
          } else {
            callBack([])
          }
          this.loading = false
        })
      } else {
        GraphsService.findGraphEchartsByGraphId({ graphid: this.graph.graphid, ...p }).then(res => {
          if (res.ok()) {
            callBack(res.data)
          } else {
            callBack([])
          }
          this.loading = false
        })
      }
    },
    timeRangeChangeClick: function() {
      this.loading = true
      this.$refs.graph.updateSeriesData()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.timeRangeChangeClick()
    })
  }
}
</script>

<template>
  <div>
    <Spin fix v-if="loading">加载中...</Spin>
    <Row v-if="hostId" :gutter="20" style="margin-top: 10px;">
      <i-col
        v-for="graph in graphs"
        :key="graph.graphid"
        :md="24"
        :lg="8"
        style="margin-bottom: 20px;"
      >
        <ApmChartLine :graph="graph"></ApmChartLine>
      </i-col>
    </Row>
    <div v-else-if="!loading">
      暂无数据
    </div>
  </div>
</template>

<script>
import { GraphsService } from '@/api/apm/graph'
import ApmChartLine from '@/view/apm/graph/apm-chart-line'
export default {
  name: 'home',
  props: {
    hostId: Number
  },
  components: {
    ApmChartLine
  },
  data() {
    return {
      loading: false,
      graphs: []
    }
  },
  mounted() {
    this.fangwen()
  },
  methods: {
    fangwen() {
      this.loading = true
      let params = {
        start_time: this._moment().subtract(1, 'hours').format('X'),
        end_time: this._moment().format('X')
      }
      GraphsService.findGraphEchartsByHostId({ hostid: this.hostId, ...params }).then(res => {
        this.graphs = res.data
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    }
  }
}
</script>

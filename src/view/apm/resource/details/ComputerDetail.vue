<template>
  <div>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :xs="24" :sm="24" :md="24" :lg="24">
        <LegaTable ref="table" :options="options"></LegaTable>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 20px;">
      <i-col :xs="24" :sm="24" :md="24" :lg="24">
        <Spin v-if="_.isNil(graph)" fix><span style="font-size: 20px">请点击名称查看对应图形</span></Spin>
        <ApmChartLine v-else :graph="graph"></ApmChartLine>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { HostsService } from '@/api/apm/host'
import ApmChartLine from '@/view/apm/graph/apm-chart-line'
import { GraphsService } from '@/api/apm/graph'
import { timeRange } from '@/view/apm/graph/timeRange.js'
import './cpuDetail.less'
export default {
  components: {
    ApmChartLine
  },
  props: {
    hostId: Number,
    appName: String
  },
  data () {
    return {
      graph: null,
      options: {
        type: 'tree',
        stripe: true,
        height: 600,
        queryDataAction: this.show,
        actionsHandle: {},
        permissionPerfix: this.$route.name,
        buttons: [],
        columns: [
          {
            key: 'itemid',
            title: 'id'
          },
          {
            key: 'name',
            title: '名称',
            render: (h, params) => {
              let className = 'noHover'
              let icon = ''
              let cursor = ''
              if (params.row.value_type === 0 || params.row.value_type === 3) {
                className = 'hasHover'
                icon = 'ios-podium'
                cursor = 'pointer'
              }
              return h('span',
                {
                  class: className,
                  style: {
                    cursor: cursor
                  },
                  on: {
                    click: () => {
                      if (className === 'hasHover') {
                        this.showGraph(params.row)
                      }
                    }
                  }
                },
                [
                  [
                    h('Icon', {
                      props: {
                        type: icon
                      },
                      style: {
                        marginRight: '8px'
                      }
                    }),
                    h('span', params.row.name)
                  ]
                ]
              )
            }
          },
          {
            key: 'data',
            title: '最新数据',
            render: (h, params) => {
              let str = ''
              let v = params.row.last_value
              let u = params.row.units
              if (this._.isNil(v)) {
                str = '暂无数据'
              } else if (u === '%') {
                str = v.toFixed(2) + u
              } else if (u === 'B') {
                str = (v / 1073741824).toFixed(2) + 'GB'
              } else if (u === 'unixtime') {
                str = this._moment.unix(v).format('YYYY-MM-DD HH:mm:ss')
              } else if (u === 'uptime') {
                let day = parseInt(v / 86400)
                let hour = parseInt((v % 86400) / 3600)
                let minute = parseInt(((v % 86400) % 3600) / 60)
                let second = parseInt(((v % 86400) % 3600) % 60)
                str = day + '天' + ' ' + hour + ':' + minute + ':' + second
              } else {
                str = v + u
              }
              return h('span', str)
            }
          }
        ],
        searchOptions: {
          labelWidth: 60,
          hiddenItems: [
          ],
          showItems: [
          ]
        }
      }
    }
  },
  methods: {
    // 显示所有信息
    show(params, callback) {
      this.graph = null
      let appnames = []
      appnames.push(this.appName)
      let param
      if (this.appName === 'all') {
        param = {
          hostid: this.hostId
        }
      } else {
        param = {
          appnames,
          hostid: this.hostId
        }
      }
      HostsService.findItemsValueByApplicationName(param).then(res => {
        callback(res)
      })
    },
    showGraph(row) {
      let params = {
        name: row.name,
        itemid: row.itemid,
        ...timeRange['1小时']
      }
      GraphsService.genGraphEchartsByHostIdAndItemId(params).then(res => {
        this.graph = { ...row, ...res.data }
      })
    }
  },
  watch: {
    appName() {
      this.$refs.table.reLoad()
    }
  }
}
</script>

<style>

</style>

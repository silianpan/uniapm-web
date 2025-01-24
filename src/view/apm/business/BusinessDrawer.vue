<template>
  <Drawer class="businessDrawerDiv" v-model="businessDrawer" title="业务详情" width="80%" @on-close="close">
    <Layout >
      <Sider hide-trigger :style="{  border: '1px solid #1f4191'}" width="auto">
        <Tree :data="deviceData" @on-select-change="showInfo"></Tree>
      </Sider>
      <Layout :style="{paddingLeft: '10px'}">
        <Content :style="{padding: '10px', minHeight: '280px', border: '1px solid #1f4191'}">
          <Spin v-if="infoFlag">请点击设备来查看</Spin>
          <div v-else>
            <h2>基本信息</h2>
            <Row v-for="(item, index) in baseInfo" :key="index" :gutter="20" style="margin-top: 5px;">
              <i-col v-for="obj in item" :key="obj.id" :xs="24" :sm="24" :md="8" :lg="8">
                <span class="baseInfoLabel">{{obj.label}}:&emsp;</span>
                <span v-if="_.isNil(obj.length)" class="baseInfoValue">{{obj.value}}</span>
                <Tooltip max-width="400" v-else :content="obj.value">
                  <span class="baseInfoValue longValue">{{obj.value.slice(0, 40)}}</span>
                </Tooltip>
              </i-col>
            </Row>
            <h2 v-if="warningFlag">告警信息</h2>
            <LegaTable ref="table" v-if="warningFlag" :options="warningInfo"></LegaTable>
            <h2 v-if="graphFlag">性能信息</h2>
            <Row v-if="graphFlag" :gutter="20" style="margin-top: 10px;">
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
          </div>
        </Content>
      </Layout>
    </Layout>
  </Drawer>
</template>

<script>
import { HostsService } from '@/api/apm/host'
import LegaExpandRow from '@/components/LegaExpandRow'
import { AlarmService } from '@/api/apm/alarm'
import { GraphsService } from '@/api/apm/graph'
import ApmChartLine from '@/view/apm/graph/apm-chart-line'
const AlarmLevelsConfig = {
  '0': {
    id: '0',
    name: '未定义',
    icon: 'iconfont icon-ring',
    iconColor: '#BDBDBD'
  },
  '1': {
    id: '1',
    name: '信息',
    icon: 'iconfont icon-ring',
    iconColor: '#ddcd01'
  },
  '2': {
    id: '2',
    name: '警告',
    icon: 'iconfont icon-ring',
    iconColor: '#fdb933'
  },
  '3': {
    id: '3',
    name: '一般严重',
    icon: 'iconfont icon-ring',
    iconColor: '#f08300'
  },
  '4': {
    id: '4',
    name: '严重',
    icon: 'iconfont icon-ring',
    iconColor: '#e35020'
  },
  '5': {
    id: '5',
    name: '灾难',
    icon: 'iconfont icon-ring',
    iconColor: '#B71C1C'
  }
}
export default {
  components: {
    LegaExpandRow,
    ApmChartLine
  },
  props: {
    businessdrawer: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      infoFlag: true, // 控制所有信息的显示
      baseInfo: [],
      warningFlag: false, // 控制告警信息的显示
      graphFlag: false, // 控制性能页展示
      graphs: [], // 要显示的图形
      tempHostId: null, // 存储当前选中的设备id
      warningInfo: {
        type: 'grid',
        stripe: true,
        actionsHandle: {},
        queryDataAction: this.initWarningInfo,
        permissionPerfix: this.$route.name,
        buttons: [],
        columns: [
          {
            key: 'description',
            title: '告警内容',
            width: 460,
            render: (h, params) => {
              return (
                <div>
                  <span style="margin-right: 5px">
                    <Icon custom='iconfont icon-ring' color={AlarmLevelsConfig[params.row.severity].iconColor}/>
                  </span>
                  <span>{params.row.description}</span>
                </div>
              )
            }
          },
          {
            key: 'params.row.severity',
            title: '告警级别',
            render: (h, params) => {
              let str = AlarmLevelsConfig[params.row.severity].name
              return h('span', {
                style: {
                  'background-color': AlarmLevelsConfig[params.row.severity].iconColor,
                  'padding': '5px'
                }
              }, str)
            }
          },
          {
            key: 'clock',
            title: '产生时间',
            width: 160,
            render: (h, params) => {
              return h(
                'span',
                this._moment
                  .unix(params.row.clock)
                  .format('YYYY-MM-DD HH:mm:ss')
              )
            }
          },
          {
            key: 'lastchange',
            title: '最近采集时间',
            width: 160,
            render: (h, params) => {
              return h(
                'span',
                this._moment
                  .unix(params.row.lastchange)
                  .format('YYYY-MM-DD HH:mm:ss')
              )
            }
          },
          {
            key: 'value',
            title: '是否解决',
            render: (h, params) => {
              let str = params.row.value === 0 ? '已解决' : '未解决'
              return h('span', str)
            }
          },
          {
            key: 'finish',
            title: '操作',
            render: (h, params) => {
              if (params.row.value === 0) {
                return h('span', '-')
              }
              return h('Tooltip', {
                props: {
                  content: '解决',
                  placement: 'top'
                }
              }, [
                h('Button', {
                  props: {
                    type: 'success',
                    shape: 'circle',
                    icon: 'md-checkmark-circle-outline'
                  },
                  on: {
                    click: () => {
                      this.updateWarning(params.row.eventid)
                    }
                  }
                })
              ])
            }
          }
        ],
        searchOptions: {
          hiddenItems: [],
          showItems: []
        }
      }
    }
  },
  methods: {
    close() {
      this.$emit('close-drawer')
      this.infoFlag = true
      this.tempHostId = null
    },
    showInfo(arr, item) {
      this.tempHostId = item.hostid
      this.initBaseInfo()
      if (item.isWarning === true) {
        this.warningFlag = true
        this.$nextTick(() => {
          this.$refs.table.reLoad()
        })
      } else {
        this.warningFlag = false
      }
      if (!this._.isEmpty(item.graphIds)) {
        this.graphFlag = true
        this.initGraph(item)
      } else {
        this.graphFlag = false
      }
      this.infoFlag = false
    },
    initBaseInfo() {
      let param = {
        appnames: ['General'],
        hostid: this.tempHostId
      }
      HostsService.findItemsValueByApplicationName(param).then(res => {
        let baseInfo = []
        let row = []
        let i = 0
        for (let obj of res.data) {
          obj.last_value = obj.units === 'unixtime' ? this._moment.unix(obj.last_value).format('YYYY-MM-DD HH:mm:ss') : obj.last_value
          obj.last_value = obj.units === 'uptime' ? this._moment.duration(obj.last_value, 'seconds').humanize() : obj.last_value
          if (obj.value_type === 1 && obj.last_value && obj.last_value.length > 40) {
            obj.length = obj.last_value.length
          }
          let label = {
            id: obj.itemid,
            label: obj.name,
            value: obj.last_value,
            length: obj.length
          }
          i++
          row.push(label)
          if (i === 3) {
            baseInfo.push(row)
            row = []
            i = 0
          }
        }
        baseInfo.push(row)
        this.baseInfo = baseInfo
      })
    },
    initWarningInfo(params, callback) {
      if (this._.isNil(this.tempHostId)) {
        callback()
        return
      }
      let _p = {
        conditions: [
          {
            field: 'hostid',
            value: this.tempHostId
          }
        ]
      }
      AlarmService.pageAlarm(_p).then(res => {
        callback(res)
      })
    },
    initGraph(item) {
      let params = {
        start_time: this._moment().subtract(1, 'hours').format('X'),
        end_time: this._moment().format('X')
      }
      GraphsService.findGraphEchartsByHostId({ hostid: this.tempHostId, graphids: item.graphIds, ...params }).then(res => {
        this.graphs = res.data
      })
    },
    updateWarning(id) {
      AlarmService.updateAlarmValue(id).then(res => {
        if (res.ok()) {
          this.$refs.table.reLoad()
          this.$Message.success({
            content: '成功修复告警，此告警依旧能在已解决分类中显示',
            duration: 3
          })
        }
      })
    }
  },
  computed: {
    businessDrawer: {
      get() {
        return this.businessdrawer
      },
      set() {}
    },
    deviceData: {
      get() {
        for (let obj of this.detail) {
          obj.title = obj.hostname + '(' + obj.ip + ')'
        }
        return this.detail
      },
      set() {}
    }
  }
}
</script>

<style lang="less">
.businessDrawerDiv {
  .baseInfoLabel {
  font-size: 15px;
  float: left;
  }
  .longValue {
    text-decoration: underline
  }
}
</style>

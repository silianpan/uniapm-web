<template>
  <Card v-if="_.isNil(hostid)">
    <div class="bs-callout-small bs-callout-primary">
      <h4>告警信息</h4>
    </div>
    <Layout :style="{border: '1px solid #1f4191',padding:'5px'}">
      <Content :style="{padding: '0', minHeight: '280px'}">
        <LegaTable ref="table" :options="options"></LegaTable>
      </Content>
    </Layout>
  </Card>
  <div v-else>
    <LegaTable ref="table" :options="options"></LegaTable>
  </div>
</template>

<script>
import { AlarmService } from '@/api/apm/alarm'
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
  props: {
    hostId: Number
  },
  data() {
    return {
      hostid: this.hostId,
      options: {
        type: 'grid',
        stripe: true,
        queryDataAction: this.show,
        actionsHandle: {},
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
            key: 'name',
            title: '告警来源'
          },
          {
            key: 'ip',
            title: 'IP地址'
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
          showItems: [
            {
              type: 'radioGroup',
              label: '告警级别',
              prop: 'severity',
              options: Object.values(AlarmLevelsConfig)
            },
            {
              type: 'radioGroup',
              label: '是否解决',
              prop: 'value',
              options: [
                {
                  id: '0',
                  name: '已解决'
                },
                {
                  id: '1',
                  name: '未解决'
                }
              ]
            },
            {
              type: 'input',
              label: 'IP',
              prop: 'ip',
              tip: 'IP'
            },
            {
              type: 'dateRange',
              label: '时间范围',
              prop: 'visit_date',
              tip: '时间范围'
            }
          ]
        }
      }
    }
  },
  methods: {
    // 显示所有告警信息
    show(params, callback) {
      let _c = []
      if (!this._.isNil(params.conditions)) {
        params.conditions.forEach(item => {
          if (item.field === 'visit_date' && item.value && item.value.length === 2) {
            const visitDataValues = item.value
            if (this._moment(visitDataValues[0]).isValid() && this._moment(visitDataValues[1]).isValid()) {
              let startTime = this._moment(item.value[0]).format('X')
              let endTime = this._moment(item.value[1]).add(1, 'days').format('X')
              _c.push({
                field: 'startTime',
                value: startTime
              })
              _c.push({
                field: 'endTime',
                value: endTime
              })
            }
          } else {
            _c.push({ ...item })
          }
        })
      }
      params.conditions = _c
      if (!this._.isNil(this.hostId)) {
        params.conditions.push({
          field: 'hostid',
          value: this.hostId
        })
      }
      // 默认查询未解决的
      let flag = false
      for (let obj of params.conditions) {
        if (obj.field === 'value') {
          flag = true
          break
        }
      }
      if (flag === false) {
        params.conditions.push({
          field: 'value',
          value: 1
        })
      }
      AlarmService.pageAlarm(params).then(res => {
        callback(res)
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
  }
}
</script>

<style>
</style>

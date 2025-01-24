<!--
 界面
@author 49773
@date 2018-10-23
created by scaffold
-->
<template>
  <Card>
    <div class="bs-callout-small bs-callout-primary">
      <h4>资源信息</h4>
    </div>
    <Layout >
      <Sider hide-trigger :style="{  border: '1px solid #1f4191'}" width="auto">
        <Tree :data="groupData" :render="renderContent"></Tree>
      </Sider>
      <Layout :style="{paddingLeft: '10px'}">
        <Content :style="{padding: '10px', minHeight: '280px', border: '1px solid #1f4191'}">
          <LegaTable ref="table" :options="options"></LegaTable>
        </Content>
      </Layout>
    </Layout>
    <resource-drawer :resourcedrawer="resourceDrawer" :hostid="hostId" :detailflag="detailFlag" @close-drawer="setNull"></resource-drawer>
  </Card>
</template>

<script>
import { HostsService } from '@/api/apm/host'
import ResourceDrawer from './ResourceDrawer.vue'
import './resource.less'
export default {
  components: {
    ResourceDrawer
  },
  props: {},
  data() {
    return {
      resourceDrawer: false, // 控制详情弹出框的展示
      detailFlag: null, // 传递要跳转的组件
      hostId: null, // 存放选中的主机id
      utils: {}, // 存放选中主机的CPU和内存利用率
      options: {
        type: 'tree',
        stripe: true,
        queryDataAction: this.show,
        actionsHandle: {},
        permissionPerfix: this.$route.name,
        buttons: [],
        columns: [
          {
            key: 'name',
            title: '名称',
            render: (h, params) => {
              return h('span', {
                class: 'hostName',
                style: {
                  cursor: 'pointer'
                },
                on: {
                  'click': () => {
                    this.hostId = params.row.hostid
                    this.detailFlag = 'ResourceDetail'
                    this.resourceDrawer = true
                  }
                }
              }, params.row.name)
            }
          },
          {
            key: 'ip',
            title: 'IP地址/域名'
          },
          // {
          //   key: 'cpu_util',
          //   title: 'CPU利用率',
          //   width: 200,
          //   render: (h, params) => {
          //     if (this._.isNil(params.row.cpu_util)) {
          //       return h('span', '无')
          //     } else {
          //       return h('Progress', {
          //         props: {
          //           percent: parseFloat(params.row.cpu_util.toFixed(2)),
          //           status: 'active'
          //         }
          //       })
          //     }
          //   }
          // },
          // {
          //   key: 'memory_util',
          //   title: '内存利用率',
          //   width: 200,
          //   render: (h, params) => {
          //     if (this._.isNil(params.row.memory_util)) {
          //       return h('span', '无')
          //     } else {
          //       return h('Progress', {
          //         props: {
          //           percent: parseFloat(params.row.memory_util.toFixed(2)),
          //           status: 'active'
          //         }
          //       })
          //     }
          //   }
          // },
          {
            key: 'available',
            title: '可用性',
            render: (h, params) => {
              let type = params.row.types.split(',')
              let ZBXStyle = { border: '1px solid grey', color: 'grey', padding: '0.5px' }
              let SNMPStyle = { border: '1px solid grey', color: 'grey', padding: '0.5px' }
              let JMXStyle = { border: '1px solid grey', color: 'grey', padding: '0.5px' }
              let IPMIStyle = { border: '1px solid grey', color: 'grey', padding: '0.5px' }
              if (type.indexOf('1') !== -1 && params.row.available === 1) {
                ZBXStyle.border = '1px solid rgb(52,175,103)'
                ZBXStyle.color = 'white'
                ZBXStyle.background = 'rgb(52,175,103)'
              } else if (type.indexOf('1') !== -1 && params.row.available === 2) {
                ZBXStyle.border = '1px solid rgb(214,78,78)'
                ZBXStyle.color = 'white'
                ZBXStyle.background = 'rgb(214,78,78)'
              }
              if (type.indexOf('2') !== -1 && params.row.snmp_available === 1) {
                SNMPStyle.border = '1px solid rgb(52,175,103)'
                SNMPStyle.color = 'white'
                SNMPStyle.background = 'rgb(52,175,103)'
              } else if (type.indexOf('2') !== -1 && params.row.snmp_available === 2) {
                SNMPStyle.border = '1px solid rgb(214,78,78)'
                SNMPStyle.color = 'white'
                SNMPStyle.background = 'rgb(214,78,78)'
              }
              if (type.indexOf('3') !== -1 && params.row.ipmi_available === 1) {
                IPMIStyle.border = '1px solid rgb(52,175,103)'
                IPMIStyle.color = 'white'
                IPMIStyle.background = 'rgb(52,175,103)'
              } else if (type.indexOf('3') !== -1 && params.row.ipmi_available === 2) {
                IPMIStyle.border = '1px solid rgb(214,78,78)'
                IPMIStyle.color = 'white'
                IPMIStyle.background = 'rgb(214,78,78)'
              }
              if (type.indexOf('4') !== -1 && params.row.jmx_available === 1) {
                JMXStyle.border = '1px solid rgb(52,175,103)'
                JMXStyle.color = 'white'
                JMXStyle.background = 'rgb(52,175,103)'
              } else if (type.indexOf('4') !== -1 && params.row.jmx_available === 2) {
                JMXStyle.border = '1px solid rgb(214,78,78)'
                JMXStyle.color = 'white'
                JMXStyle.background = 'rgb(214,78,78)'
              }
              return h('div', [
                h('span', {
                  style: {
                    ...ZBXStyle
                  }
                }, 'ZBX'),
                h('span', {
                  style: {
                    ...SNMPStyle
                  }
                }, 'SNMP'),
                h('span', {
                  style: {
                    ...JMXStyle
                  }
                }, 'JMX'),
                h('span', {
                  style: {
                    ...IPMIStyle
                  }
                }, 'IPMI')
              ])
            }
          },
          {
            key: 'status',
            title: '监控状态',
            render: (h, params) => {
              let str = params.row.status === 0 ? 'iconfont icon-connected' : params.row.status === 1 ? 'iconfont icon-disconnected' : '未知'
              if (str === '未知') {
                return h('span', str)
              } else {
                let color = str === 'iconfont icon-connected' ? 'green' : 'red'
                return h('Icon', { props: { custom: str, color: color, size: 20 } })
              }
            }
          }
        ],
        searchOptions: {
          labelWidth: 60,
          hiddenItems: [
          ],
          showItems: [
            {
              type: 'radioGroup',
              label: '可用性',
              prop: 'available',
              options: [
                {
                  id: '1',
                  name: '可用',
                  icon: 'ios-checkmark-circle-outline',
                  iconColor: 'green',
                  iconSize: 20
                },
                {
                  id: '2',
                  name: '不可用',
                  icon: 'ios-close-circle-outline',
                  iconColor: 'red',
                  iconSize: 20
                }
              ]
            },
            // {
            //   type: 'radioGroup',
            //   label: '告警情况',
            //   prop: 'warning',
            //   options: [
            //     {
            //       id: '0',
            //       name: '存在',
            //       icon: 'iconfont icon-ring',
            //       iconColor: 'red'
            //     },
            //     {
            //       id: '1',
            //       name: '正常',
            //       icon: 'iconfont icon-ring',
            //       iconColor: 'green'
            //     }
            //   ]
            // },
            {
              type: 'radioGroup',
              label: '是否监控',
              prop: 'status',
              options: [
                {
                  id: '0',
                  name: '已监控',
                  icon: 'iconfont icon-connected',
                  iconColor: 'green'
                },
                {
                  id: '1',
                  name: '未监控',
                  icon: 'iconfont icon-disconnected',
                  iconColor: 'red'
                }
              ]
            },
            {
              type: 'input',
              label: '名称',
              prop: 'name',
              tip: '名称'
            },
            {
              type: 'input',
              label: 'IP',
              prop: 'ip',
              tip: 'IP'
            }
          ]
        }
      },
      groupData: []
    }
  },
  methods: {
    renderContent(h, { root, node, data }) {
      return h('span',
        {
          style: {
            display: 'inline-block',
            cursor: 'pointer',
            width: '100%'
          },
          on: {
            click: () => { this.showHost(data) }
          }
        },
        [
          h('span',
            [
              h('Icon', {
                props: {
                  type: 'ios-folder-open'
                },
                style: {
                  marginRight: '8px'
                }
              }),
              h('span', { class: 'treeClass' }, data.title)
            ]
          )
        ]
      )
    },
    // 显示所有主机信息
    show(params, callback) {
      if (this._.isEmpty(this.groupData)) {
        this.initGroup()
      }
      HostsService.pageHostByGroupId(params).then(res => {
        callback(res)
      })
    },
    // 初始化主机分组信息
    initGroup() {
      HostsService.findHostGroup().then(res => {
        for (let elem of res.data) {
          elem.title = elem.NAME
          this.groupData.push(elem)
        }
      })
    },
    // 根据点击的主机分组显示不同的信息
    showHost(item) {
      let params = {
        conditions: [{
          field: 'groupid',
          value: item.groupid
        }]
      }
      HostsService.pageHostByGroupId(params).then(res => {
        this.$refs.table.dealResponseData({ ...res })
      })
    },
    // 置空
    setNull() {
      this.resourceDrawer = false
      this.hostId = null
    }
  },
  computed: {}
}
</script>

<style lang='less'>
</style>

<template>
  <Card>
    <div class="bs-callout-small bs-callout-primary">
      <h4>新增业务</h4>
    </div>
    <Layout :style="{border: '1px solid #1f4191',padding:'5px'}">
      <Content :style="{padding: '0', minHeight: '280px'}">
        <Spin v-if="spinFlag === true" fix>加载业务详情中...</Spin>
        <Row :gutter="20" style="margin-top: 5px;">
          <i-col :xs="24" :sm="24" :md="8" :lg="8">
            <Input v-model="businessTitle" placeholder="业务名称" style="width: 300px" />
          </i-col>
          <i-col :xs="24" :sm="24" :md="8" :lg="8">
            <Input disabled v-model="topoName" placeholder="选择关联的拓朴图" style="width: 350px" >
              <Button slot="prepend" @click="topoModal = !topoModal">选择</Button>
              <Button slot="append" icon="md-close" @click="emptyTopo"></Button>
            </Input>
          </i-col>
        </Row>
        <LegaTable ref="table" :options="businessList" @addDevice="deviceModal = !deviceModal"></LegaTable>
        <ButtonGroup >
          <Button size="large" type="primary" :loading='buttonLoading' @click="save" style="margin-top: 10px;">
            保存
          </Button>
          <Button size="large" type="primary" @click="back" style="margin-top: 10px;">
            取消
          </Button>
        </ButtonGroup>
      </Content>
    </Layout>
    <Modal v-model="deviceModal" width="700">
      <p slot="header" style="color:black;text-align:center">
        <span style="color: white;">设备列表</span>
      </p>
      <div style="text-align:center;">
        <LegaTable ref="device" :options="deviceList"></LegaTable>
      </div>
      <div slot="footer">
        <Input v-model="deviceName" search enter-button placeholder="输入设备名" @on-search="searchDevice"/>
      </div>
    </Modal>
    <Modal v-model="topoModal" width="500">
      <p slot="header" style="color:black;text-align:center">
        <span style="color: white;">拓扑图列表</span>
      </p>
      <div style="text-align:center;">
        <LegaTable ref="topo" :options="topoList"></LegaTable>
      </div>
      <div slot="footer">
        <Input v-model="topoSearchName" search enter-button placeholder="输入拓扑图名" @on-search="searchTopo"/>
      </div>
    </Modal>
  </Card>
</template>

<script>
import BusinessSelect from './BusinessSelect.vue'
import { HostsService } from '@/api/apm/host'
import { BusinessService } from '@/api/apm/business'
import { TopoService } from '@/api/apm/topo'
export default {
  components: {
    BusinessSelect
  },
  props: {
    businessId: String
  },
  data() {
    return {
      spinFlag: true,
      businessTitle: null,
      deviceModal: false, // 弹出框显示标志
      deviceName: '', // 搜索的设备名
      topoName: '', // 拓扑图名，用于显示
      topoId: null,
      topoModal: false,
      topoSearchName: '', // 用于搜索
      editBusinessList: {
        ok: () => {
          return true
        },
        data: []
      },
      tempData: [],
      buttonLoading: false,
      businessList: {
        queryDataAction: this.showBusiness,
        permissionPerfix: this.$route.name,
        heightLightRow: false,
        actionsHandle: {
          delete: (params, column) => {
            this.tempData.splice(params.index, 1)
            // 重新渲染表格
            this.$refs.table.cloneOptions.data = JSON.parse(JSON.stringify(this.tempData))
          }
        },
        columns: [
          {
            type: 'index',
            title: '序号'
          },
          {
            key: 'name',
            title: '名称'
          },
          {
            key: 'ip',
            title: 'IP地址/域名'
          },
          {
            key: 'isWarning',
            title: '开启告警',
            switchOnValue: true,
            render: 'switchStatus',
            switchOffLabel: '关闭',
            switchOnLabel: '开启',
            onChange: (val, params) => {
              this.tempData[params.row._index].isWarning = val
            }
          },
          {
            key: 'graphIds',
            title: '选择图形',
            width: 500,
            render: (h, params) => {
              return h(BusinessSelect, {
                props: {
                  graphIds: params.row.graphIds,
                  hostid: params.row.hostid
                },
                on: {
                  'graphs': ids => {
                    this.tempData[params.row._index].graphIds = [ ...ids ]
                  }
                }
              })
            }
          },
          {
            title: '操作',
            key: 'action',
            render: ['delete']
          }
        ],
        buttons: [
          {
            type: 'primary',
            name: '添加设备',
            icon: 'md-add',
            clickName: 'addDevice'
          }
        ]
      },
      deviceList: {
        height: 500,
        queryDataAction: this.showDevice,
        permissionPerfix: this.$route.name,
        columns: [
          {
            type: 'index',
            title: '序号'
          },
          {
            key: 'name',
            title: '名称'
          },
          {
            key: 'ip',
            title: 'IP地址/域名'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'md-add'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      // 排除添加同一个设备的情况
                      for (let obj of this.tempData) {
                        if (obj.hostid === params.row.hostid) {
                          this.$Message.error('您选择了重复的设备')
                          return
                        }
                      }
                      // 逻辑处理,添加一些预留属性
                      params.row.isWarning = false
                      params.row.graphIds = []
                      // 深拷贝一份，防止同一设备索引相同的情况
                      let newRow = JSON.parse(JSON.stringify(params.row))
                      delete newRow._index
                      delete newRow._rowKey
                      // 当前设备显示到业务列表
                      this.tempData.push(newRow)
                      this.$refs.table.cloneOptions.data = JSON.parse(JSON.stringify(this.tempData))
                      // 关闭对话框
                      this.deviceModal = !this.deviceModal
                    }
                  }
                })
              ])
            }
          }
        ]
      },
      topoList: {
        height: 500,
        queryDataAction: this.showTopo,
        permissionPerfix: this.$route.name,
        columns: [
          {
            type: 'index',
            title: '序号'
          },
          {
            key: 'name',
            title: '名称'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'ios-link'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.topoName = params.row.name
                      this.topoId = params.row.id
                      // 关闭对话框
                      this.topoModal = !this.topoModal
                    }
                  }
                })
              ])
            }
          }
        ]
      }
    }
  },
  methods: {
    back() {
      this.$router.push({
        name: 'businessInfo'
      })
    },
    showBusiness(params, callback) {
      callback(this.editBusinessList)
      if (!this._.isNil(this.businessId)) {
        this.spinFlag = true
        BusinessService.getBusinessAndTopo(this.businessId).then(res => {
          this.businessTitle = res.data.name
          this.topoName = res.data.topoName
          this.topoId = res.data.topoId
          let businessDetail = JSON.parse(res.data.businessDetail)
          let tempData = []
          for (let obj of businessDetail) {
            let business = {
              hostid: obj.hostid,
              name: obj.hostname,
              ip: obj.ip,
              isWarning: obj.isWarning,
              graphIds: obj.graphIds
            }
            tempData.push(business)
          }
          this.tempData = tempData
          this.$refs.table.cloneOptions.data = JSON.parse(JSON.stringify(tempData))
          this.spinFlag = false
        })
      } else {
        this.spinFlag = false
      }
    },
    showDevice(params, callback) {
      if (this.deviceName !== '') {
        params.conditions = [{
          field: 'name',
          value: this.deviceName
        }]
      }
      HostsService.pageHostByGroupId(params).then(res => {
        callback(res)
      })
    },
    searchDevice() {
      this.$refs.device.reLoad()
    },
    showTopo(params, callback) {
      if (this.topoSearchName !== '') {
        params.conditions = [{
          field: 'name',
          value: this.topoSearchName
        }]
      }
      TopoService.pageNoBindTopo(params).then(res => {
        callback(res)
      })
    },
    searchTopo() {
      this.$refs.topo.reLoad()
    },
    emptyTopo() {
      this.topoName = ''
      this.topoId = null
    },
    // 保存
    save() {
      this.buttonLoading = true
      let errorMsg = ''
      let errorFlag = false
      if (this._.isNil(this.businessTitle) || this.businessTitle === '') {
        errorMsg = '请填写业务名'
        errorFlag = true
      } else {
        let i = 0
        for (let obj of this.tempData) {
          i++
          if (obj.isWarning === false && this._.isEmpty(obj.graphIds)) { // 没有配置业务细节
            errorMsg = '第' + i + '个设备没有配置具体业务'
            errorFlag = true
            break
          }
        }
      }
      // 判断是否有填写错误
      if (errorFlag === true) {
        this.$Message.error(errorMsg)
        this.buttonLoading = false
      } else {
        // 封装数据
        let device = []
        // 业务详情
        for (let obj of this.tempData) {
          let business = {
            hostid: obj.hostid,
            hostname: obj.name,
            ip: obj.ip,
            isWarning: obj.isWarning,
            graphIds: obj.graphIds
          }
          device.push(business)
        }
        // 业务拓扑图
        let data = {
          id: this._.isNil(this.businessId) ? undefined : this.businessId,
          name: this.businessTitle,
          businessDetail: JSON.stringify(device),
          topoId: this._.isNil(this.topoId) ? this._.isNil(this.businessId) ? undefined : '' : this.topoId
        }
        BusinessService.save(data).then(res => {
          this.$Message.success(this._.isNil(this.businessId) ? '新增成功' : '修改成功')
          this.buttonLoading = false
          this.back()
        })
      }
    }
  }
}
</script>

<style lang="less">
</style>

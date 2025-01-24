<!--  -->
<template>
<div class="resource-authority-container">
  <Card>

    <div class="bs-callout-small bs-callout-primary">
      <h4> 分配角色资源权限 </h4>
    </div>
    <Row >
      <i-col :xs="24" :sm="24" :md="24" :lg="24">
        <div style="text-align:left;">
          <ButtonGroup>
            <i-button type='primary' @click.native='goBack'>
              <Icon type="ios-arrow-back" />返回</i-button>
          </ButtonGroup>
        </div>

      </i-col>
    </Row>
    <Alert show-icon v-if="role">
      <span style="font-size:10px">当前角色</span>
      <span style="font-weight:bold;font-size:14px"> {{ (role || {}).name || '暂无'}} </span>
      <Icon type="ios-bulb-outline" slot="icon"></Icon>
    </Alert>
    <Row>
      <Spin fix size="large" v-if="buttonLoading"> 正在加载... </Spin>
      <i-col>
        <LegaTable ref="table" :options="options"></LegaTable>
      </i-col>
    </Row>
  </Card>

</div>
</template>

<script>
import {
  backMixin
} from '@/mixin/back-mixin'
import ModuleElement from '../module-element/ModuleElementList'
import {
  ModuleService,
  ResourceAuthorityService
} from '@/api/admin'
import Icons from '@/components/icons'
const ModuleRoot = '-1'
export default {
  mixins: [backMixin],
  props: {
    role: Object
  },
  components: {
    ModuleElement,
    Icons
  },
  data() {
    return {
      targetRoute: {
        name: 'roleManager'
      },
      buttonLoading: false,
      selectedModule: {},
      moduleTreeData: [{
        name: 'parent 1',
        expand: true,
        render: this.renderNode,
        children: [{
          name: 'child 1-1',
          expand: true,
          render: this.renderNode,
          children: [{
            render: this.renderNode,
            name: 'leaf 1-1-1',
            expand: true
          },
          {
            name: 'leaf 1-1-2',
            render: this.renderNode,
            expand: true
          }
          ]
        },
        {
          name: 'child 1-2',
          render: this.renderNode,
          expand: true,
          children: [{

            name: 'leaf 1-2-1',
            render: this.renderNode,
            expand: true
          },
          {
            name: 'leaf 1-2-1',
            render: this.renderNode,
            expand: true
          }
          ]
        }
        ]
      }],
      options: {
        type: 'tree',
        loadData: this.loadData,
        queryDataAction: this.handlePageModuleAction,
        actionsHandle: {},
        permissionPerfix: this.$route.name,
        buttons: [],
        columns: [{
          key: 'hasAuthority',
          align: 'center',
          width: 60,
          render: (h, params) => {
            const row = this._.defaultsDeep({}, params.row)
            return h('Checkbox', {
              style: {
                'margin-right': '0px'
              },
              props: {
                value: !this._.isNil(params.row.authorityId)
              },
              on: {
                'on-change': (value) => {
                  let crow = this.$refs['table'].getRowByKey(row._rowKey)
                  if (value) {
                    params = {
                      roleId: this.roleId,
                      resourceId: crow.id,
                      resourceType: crow.type
                    }
                    ModuleService.signAuthority(params).then(resp => {
                      if (resp.ok()) {
                        this.$Message.success('权限分配成功')
                        const d = resp.data
                        this.$refs['table'].updateByRowKey(row._rowKey, {
                          roleId: d.roleId,
                          authorityId: d.id

                        })
                      } else {
                        this.$refs['table'].updateByRowKey(row._rowKey, {
                          authorityId: undefined
                        })
                      }
                    })
                  } else {
                    if (crow && crow.authorityId) {
                      ResourceAuthorityService.logicDelete(crow.authorityId).then(resp => {
                        if (resp.ok()) {
                          this.$Message.success('权限已取消')
                          crow.authorityId = undefined
                          crow.roleId = undefined
                          this.$refs['table'].updateByRowKey(row._rowKey, {
                            roleId: undefined,
                            authorityId: undefined
                          })
                        } else {
                          this.$refs['table'].reLoad()
                          // this.$refs['table'].updateByRowKey(row._rowKey, {
                          //   authorityId: crow.authorityId
                          // })
                        }
                      })
                    }
                  }
                }
              }
            })
          }
        },
        {
          key: 'name',
          title: '名称',
          type: 'tree',
          render: (h, params) => {
            return h('span', [
              h(Icons, {
                props: {
                  type: params.row.iconCls,
                  size: 12
                }
              }),
              h('span', params.row.name)
            ])
          },
          showTaggle: (row) => {
            return row.childrenCnt > 0 || row.eleCnt > 0
          }
        },
        {
          key: 'code',
          title: '编码'
        },
        {
          key: 'type',
          title: '类型',
          align: 'center',
          width: 100,
          render: (h, params) => {
            const ModuleTypes = {
              menu: '菜单',
              api: '数据',
              btn: '按钮',
              uri: 'URI'
            }
            return h('span', ModuleTypes[params.row.type] || '-')
          }
        },
        {
          key: 'iconCls',
          title: '图标样式',
          align: 'center',
          width: 100,
          render: (h, params) => {
            return h(Icons, {
              props: {
                type: params.row.iconCls
              }
            })
          }
        }
        ],
        searchOptions: {}
      }
    }
  },
  methods: {
    loadData(p, callback) {
      if (p && this.roleId) {
        ModuleService.findModulesAndElementsByRoleAndPid(this.roleId, p.id).then(resp => {
          if (resp.ok()) {
            callback(resp.data)
          }
        })
      }
    },
    handlePageModuleAction(params, callback) {
      if (this.roleId) {
        ModuleService.findModulesAndElementsByRoleAndPid(this.roleId, '-1').then(resp => {
          callback(resp)
        })
      } else {
        callback()
      }
    },
    init() {
      // 查找资源权限的 顶层 数据
      ModuleService.findModulesByPid(ModuleRoot).then(res => {
        if (res.ok()) {
          const data = (res.data || []).map(item => {
            let _i = { ...item
            }
            _i.render = this.renderNode
            return _i
          })

          console.log(data)
        }
      })
    }
  },
  mounted: function () {
    let {
      sourceRoute
    } = this.$route.params
    this.sourceRoute = sourceRoute
    this.init()
  },
  computed: {
    roleId() {
      return (this.role || {}).id
    }
  }
}
</script>

<style lang="less" scoped>
.resource-authority-container {
  .ivu-row {
    margin-bottom: 10px;
  }
  .ivu-alert {
    margin-bottom: 0px;
  }
}
</style>

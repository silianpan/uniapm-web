<!--
资源模块表 界面
@author hsc
@date 2019-01-07
created by scaffold
-->
<template>
    <div>
        <Card>
            <Row :gutter="5">
                <i-Col>
                <LegaTable ref="table" :options ="options" @addClick="handleAddClickAction" >
                </LegaTable>
                </i-Col>
            </Row>
        </Card>
    </div>
</template>
<script>
import LegaTable from '@/components/table/LegaTable'
import { ModuleService } from '@/api/admin'
import Icons from '@/components/icons'
import {
  mapGetters
} from 'vuex'

export default {
  props: { },
  components: {
    LegaTable,
    Icons
  },
  data () {
    return {
      options: {
        type: 'tree',
        loadData: this.loadData,
        queryDataAction: this.handlePageModuleAction,
        actionsHandle: {
          modify: (params, column) => {
            this.modifyClick(params.row || {})
          },
          delete: (params, column) => {
            this.deleteClick(params.row || {})
          },
          moduleElementManage: (params, column) => {
            this.$router.push({
              name: 'moduleElementList',
              params: {
                sourceRoute: this.$route,
                module: params.row || {}
              }
            })
          }
        },
        permissionPerfix: this.$route.name,

        buttons: [{
          type: 'primary',
          name: '新增',
          icon: 'md-add',
          clickName: 'addClick',
          permissionSuffix: 'btn:menu:add'
        }
        ],
        columns: [
          {
            key: 'name',
            title: '名称',
            type: 'tree',
            render: (h, params) => {
              return h('span', {
                style: {
                  'line-height': '25px'
                }
              }, [
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
              return row.childrenCnt > 0
            }
          },
          {
            key: 'code',
            title: '编码'
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
          },
          {
            key: 'type',
            title: '类型',
            align: 'center',
            width: 100,
            render: (h, params) => {
              const ModuleTypes = {
                menu: '菜单',
                api: '数据'
              }
              return h('span', ModuleTypes[params.row.type] || '-')
            }
          },
          {
            key: 'route',
            title: '路由名称',
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.route || '-')
            }
          },

          {
            key: 'enable',
            title: '是否启用',
            align: 'center',
            width: 100,
            render: 'switchStatus',
            switchOnValue: true,
            onChange: (val, params) => {
              let { row } = params
              if (row.enable !== val) {
                // ModuleService.enable
              }
            },
            switchOnLabel: '启用',
            switchOffLabel: '禁用'
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            render: [
              { key: 'moduleElementManage', permissionSuffix: 'btn:menu:modify' },
              { key: 'modify', permissionSuffix: 'btn:menu:modify' },
              { key: 'delete', permissionSuffix: 'btn:menu:logic:delete' }]
          }
        ],
        searchOptions: {
          // hiddenItems: [
          //   {
          //     type: 'input', label: '路由路径', prop: 'path', tip: '路由路径'
          //   }
          // ],
          // showItems: [
          //   {
          //     type: 'input', label: '模块名称', prop: 'name', tip: '模块名称'
          //   },
          //   {
          //     type: 'input', label: '编码', prop: 'code', tip: '编码'
          //   },
          //   {
          //     type: 'input', label: '路由名称', prop: 'route', tip: '路由名称'
          //   }
          // ]
        }
      }
    }
  },
  methods: {
    loadData(p, callback) {
      if (p) {
        ModuleService.findModulesByPid(p.id).then(resp => {
          if (resp.ok()) {
            callback(resp.data.map(i => {
              let _i = { ...i }
              _i.pName = p.name
              return _i
            }))
          }
        })
      }
    },
    handlePageModuleAction(params, callback) {
      ModuleService.findModulesByPid('-1').then(resp => {
        callback(resp)
      })
    },
    /** 修改按钮 点击 */
    modifyClick(row) {
      this.$router.push({
        name: 'moduleManagerForm',
        params: {
          sourceRoute: this.$route,
          data: row
        }
      })
    },
    /** 新增 */
    handleAddClickAction() {
      this.$router.push({
        name: 'moduleManagerForm',
        params: {
          sourceRoute: this.$route
        }
      })
    },
    /** 点击删除按钮 */
    deleteClick(row) {
      ModuleService.logicDelete(row.id).then((res) => {
        if (res.ok()) {
          this.$Message.success('删除成功！')
        }
        this.$refs['table'].reLoad()
      })
    }
  },

  mounted: function() {
  },
  computed: {
    ...mapGetters(['elements', 'hasElementsPerimByKey', 'dictDatasWithGroupKey', 'dictFormatter'])
  }
}

</script>
<style  scoped>
</style>

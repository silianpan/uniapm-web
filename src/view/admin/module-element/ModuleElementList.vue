<!--
资源模块内元素表 界面
@author hsc
@date 2019-01-07
created by scaffold
-->
<template>
    <div>
        <Card>
            <Row :gutter="5">
                <i-Col>
                <LegaTable ref="table" :options ="options" @goBack="goBack" @addClick="handleAddClickAction" >
                </LegaTable>
                </i-Col>
            </Row>
        </Card>
    </div>
</template>
<script>
import LegaTable from '@/components/table/LegaTable'
import { ModuleElementService } from '@/api/admin'
import Icons from '@/components/icons'
import { backMixin } from '@/mixin/back-mixin'
import {
  mapGetters
} from 'vuex'
export default {
  mixins: [backMixin],
  props: {
    module: Object
  },
  components: {
    LegaTable,
    Icons
  },
  data () {
    return {
      targetRoute: {
        name: 'moduleManager'
      },
      options: {
        queryDataAction: this.handleQuery,
        actionsHandle: {
          modify: (params, column) => {
            this.modifyClick(params.row || {})
          },
          view: (params, column) => {
            this.viewClick(params.row || {})
          },
          delete: (params, column) => {
            this.deleteClick(params.row || {})
          }
        },
        permissionPerfix: this.$route.name,
        buttons: [
          {
            type: 'default',
            name: '返回',
            icon: 'ios-arrow-back',
            clickName: 'goBack',
            permissionSuffix: 'btn:module_element:modify'
          },
          {
            type: 'primary',
            name: '新增',
            icon: 'md-add',
            clickName: 'addClick',
            permissionSuffix: 'btn:module_element:add'
          }
        ],
        columns: [
          {
            key: 'moduleName',
            title: '所属模块',
            render: (h, params) => {
              return h('span', (this.module || {}).name)
            }
          },
          {
            key: 'name',
            title: '模块元素名称'
          },
          {
            key: 'code',
            title: '编码'
          },
          {
            key: 'uri',
            title: '请求后台服务路径'
          },
          {
            key: 'method',
            title: '请求类型'
          },
          {
            key: 'enable',
            title: '是否启用',
            render: 'switchStatus',
            switchOnValue: true,
            onChange: (val, params) => {
              let { row } = params
              if (row.enable !== val) {
                this.$refs['table'].reLoad()
                // UserService.setEnableUser(row.id, val)
              }
            },
            switchOnLabel: '启用',
            switchOffLabel: '禁用'
          },
          {
            title: '操作',
            key: 'action',
            render: [{ key: 'modify', permissionSuffix: 'btn:module_element:modify' }, { key: 'delete', permissionSuffix: 'btn:module_element:logic:delete' }]
          }
        ],
        searchOptions: {
          showItems: [
            {
              type: 'input', label: '元素名称', prop: 'name', tip: '模块名称'
            },
            {
              type: 'input', label: '编码', prop: 'code', tip: '编码'
            }
          ]
        }
      }
    }
  },
  methods: {
    handleQuery(params, callback) {
      let p = { ...params }
      let conditions = p.conditions || []
      if (this.module && this.module.id) {
        conditions.push({
          field: 'moduleId',
          value: this.module.id,
          queryType: 'eq'
        })
        p.conditions = conditions
        ModuleElementService.findAll(p).then(res => {
          callback(res)
        })
      } else {
        this.goBack()
      }
    },
    /** 修改按钮 点击 */
    modifyClick(row) {
      ModuleElementService.findById(row.id).then(resp => {
        // response.data
        if (resp.ok()) {
          this.$router.push({
            name: 'moduleElementFormCard',
            params: {
              sourceRoute: this.$route,
              module: this.module,
              element: resp.data
            }
          })
        } else {

        }
      })
    },
    /** 查看详情按钮点击 */
    viewClick(row) {

    },
    /** 新增 */
    handleAddClickAction() {
      this.$router.push({
        name: 'moduleElementFormCard',
        params: {
          sourceRoute: this.$route,
          module: this.module
        }
      })
    },
    /** 点击删除按钮 */
    deleteClick(row) {
      ModuleElementService.logicDelete(row.id).then((res) => {
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

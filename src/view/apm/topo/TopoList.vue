<template>
  <Card>
    <div class="bs-callout-small bs-callout-primary">
      <h4>拓扑列表</h4>
    </div>
    <Layout :style="{border: '1px solid #1f4191',padding:'5px'}">
      <Content :style="{padding: '0', minHeight: '280px'}">
        <LegaTable ref="table" :options="options" @addClick="addTopoClick"></LegaTable>
      </Content>
    </Layout>
  </Card>
</template>

<script>
import { TopoService } from '@/api/apm/topo'
export default {
  data() {
    return {
      options: {
        type: 'tree',
        stripe: true,
        queryDataAction: this.show,
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
            type: 'primary',
            name: '新增',
            icon: 'md-add',
            clickName: 'addClick',
            permissionSuffix: 'btn:topo:add'
          }
        ],
        columns: [
          {
            key: 'name',
            title: '拓扑图名称'
          },
          {
            key: 'fullscreen',
            title: '是否大屏展示',
            render: (h, params) => {
              return h('span', params.row.fullscreen ? '是' : '否')
            }
          },
          {
            key: 'defaultscreen',
            title: '是否默认展示',
            render: (h, params) => {
              return h('span', params.row.defaultscreen ? '是' : '否')
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            render: [
              { key: 'modify', permissionSuffix: 'btn:topo:modify' },
              { key: 'delete', permissionSuffix: 'btn:topo:logic:delete' },
              'view'
            ]
          }
        ],
        searchOptions: {
          hiddenItems: [],
          showItems: [
            {
              type: 'input',
              label: '名称',
              prop: 'name'
            }
          ]
        }
      }
    }
  },
  methods: {
    show(params, callback) {
      let _c = []
      if (!this._.isNil(params.conditions)) {
        params.conditions.forEach(item => {
          _c.push({ ...item })
        })
      }
      params.conditions = _c
      TopoService.page(params).then(res => {
        callback(res)
      })
    },
    addTopoClick() {
      this.$router.push({ name: 'topoForm', sourceRoute: this.$route })
    },
    /** 修改按钮 点击 */
    modifyClick(row) {
      this.$router.push({
        name: 'topoForm',
        params: {
          sourceRoute: this.$route,
          data: row
        }
      })
    },
    /** 点击删除按钮 */
    deleteClick(row) {
      TopoService.logicDelete(row.id).then((res) => {
        if (res.ok()) {
          this.$Message.success('删除成功！')
        }
        this.$refs['table'].reLoad()
      })
    },
    viewClick(row) {
      this.$router.push({ name: 'topo', params: { topoid: row.id } })
    }
  }
}
</script>

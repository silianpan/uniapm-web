<!--
角色表 界面
@author hsc
@date 2019-01-07
created by scaffold
-->
<template>
<div>
  <Card>
    <Row :gutter="5">
      <i-Col>
        <LegaTable ref="table" :options="options" @query-data-action="handleQueryAction" @on-row-click="handleRowClick" @addClick="handleAddClickAction" @signAuthority="handleSignAuthorityClick" @signUser="handleSignUserClick">
          <Row slot="table-title" >
          <Alert show-icon  v-if="selectedRole">
               <span style="font-size:10px">已选中角色</span>
               <span style="font-weight:bold;font-size:14px"> {{ (selectedRole || {}).name || '暂无'}} </span>
              <Icon type="ios-bulb-outline" slot="icon"></Icon>
          </Alert>
          </Row>
        </LegaTable>
      </i-Col>
    </Row>
  </Card>
</div>
</template>

<script>
import LegaTable from '@/components/table/LegaTable'
import {
  RoleService
} from '@/api/admin'
import {
  mapGetters
} from 'vuex'
export default {
  props: {},
  components: {
    LegaTable
  },
  data() {
    return {
      selectedRole: undefined,
      options: {
        actionsHandle: {
          modify: (params, column) => {
            this.modifyClick(params.row || {})
          },
          delete: (params, column) => {
            this.deleteClick(params.row || {})
          }
        },
        permissionPerfix: this.$route.name,
        buttons: [{
          type: 'primary',
          name: '新增',
          icon: 'md-add',
          clickName: 'addClick',
          permissionSuffix: 'btn:role:add'
        },
        {
          type: 'primary',
          name: '分配权限',
          customIcon: 'iconfont icon-jiaosequanxian',
          clickName: 'signAuthority',
          iconSize: 12,
          permissionSuffix: 'btn:role:sign-authority'
        },
        {
          type: 'primary',
          name: '分配用户',
          customIcon: 'iconfont icon-tubiaozhizuomoban-',
          clickName: 'signUser',
          iconSize: 12,
          permissionSuffix: 'btn:role:sign-user'
        }
        ],
        url: `${RoleService.baseUrlPrefix}/page`,
        columns: [{
          type: 'index',
          with: 40
        },
        {
          key: 'name',
          title: '角色名'
        },
        {
          key: 'level',
          title: '级别'
        },
        {
          key: 'desc',
          title: '角色描述'
        },
        {
          key: 'enable',
          title: '是否启用',
          render: 'switchStatus',
          switchOnValue: true,
          onChange: (val, params) => {
            let {
              row
            } = params
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
          render: [
            {
              key: 'modify',
              permissionSuffix: 'btn:role:modify'
            },
            {
              key: 'delete',
              permissionSuffix: 'btn:role:logic:delete'
            }
          ]
        }
        ],
        searchOptions: {
          showItems: [{
            type: 'input',
            label: '角色名',
            prop: 'name',
            tip: '角色名'
          }]

        }

      }
    }
  },
  methods: {
    handleQueryAction(params) {
      this.selectedRole = undefined
    },
    handleRowClick(row) {
      if (this.selectedRole && row) {
        if (this.selectedRole.id !== row.id) {
          this.selectedRole = { ...row }
        }
      } else {
        this.selectedRole = { ...row }
      }
    },
    handleSignUserClick() {
      if (this.selectedRole && this.selectedRole.id) {
        this.$router.push({
          name: 'signUserToRole',
          params: {
            sourceRoute: this.$route,
            role: { ...this.selectedRole }
          }
        })
      } else {
        this.$Message.info('请选中某个角色')
      }
    },
    handleSignAuthorityClick() {
      if (this.selectedRole && this.selectedRole.id) {
        this.$router.push({
          name: 'signResourceAuthorityToRole',
          params: {
            sourceRoute: this.$route,
            role: { ...this.selectedRole }
          }
        })
      } else {
        this.$Message.info('请选中某个角色')
      }
    },
    /** 修改按钮 点击 */
    modifyClick(row) {
      RoleService.findById(row.id).then(resp => {
        // response.data
        if (resp.ok()) {
          this.$router.push({
            name: 'roleManagerForm',
            params: {
              sourceRoute: this.$route,
              role: resp.data
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
        name: 'roleManagerForm',
        params: {
          sourceRoute: this.$route
        }
      })
    },

    /** 点击删除按钮 */
    deleteClick(row) {
      RoleService.logicDelete(row.id).then((resp) => {
        if (resp.ok()) {
          this.$Message.success('删除成功！')
        }
        this.$refs['table'].reLoad()
      })
    }
  },

  mounted: function () {
    this.selectedRole = undefined
  },
  computed: {
    ...mapGetters(['elements', 'hasElementsPerimByKey', 'dictDatasWithGroupKey', 'dictFormatter'])
  }
}
</script>

<style  scoped>
</style>

<!--
用户表 界面
@author hsc
@date 2019-01-07
created by scaffold
-->
<template>
    <div>
        <Card>
            <Row :gutter="5">
                <i-Col>
                <LegaTable ref="table" :options ="options" @addClick="handleAddClickAction">
                </LegaTable>
                </i-Col>
            </Row>
        </Card>
    </div>
</template>
<script>
import LegaTable from '@/components/table/LegaTable'
import { UserService } from '@/api/admin'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'UserList',
  props: { },
  components: {
    LegaTable
  },
  data () {
    return {
      options: {
        actionsHandle: {
          resetPassword: (params, column) => {
            this.resetPassword(params.row || {})
          },
          view: (params, column) => {
            this.viewClick(params.row || {})
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
          permissionSuffix: 'btn:user:add'
        }
        ],
        url: `${UserService.baseUrlPrefix}/page`,
        columns: [
          {
            type: 'index',
            with: 40
          },
          {
            key: 'name',
            title: '用户名'
          },
          {
            key: 'username',
            title: '帐号'
          },
          {
            key: 'salt',
            title: '加盐值'
          },
          {
            key: 'phone',
            title: '联系电话'
          },
          {
            key: 'mail',
            title: '邮箱'
          },
          {
            key: 'enable',
            title: '是否启用',
            render: 'switchStatus',
            switchOnValue: true,
            onChange: (val, params) => {
              let { row } = params
              UserService.changeEnable(row.id, val).then(res => {
                if (!res.ok()) {
                  this.$refs['table'].reLoad()
                } else {
                  this.$Message.success(res.msg)
                }
              })
            },
            switchOnLabel: '启用',
            switchOffLabel: '禁用'
          },
          {
            key: 'lockStatus',
            title: '是否被锁定',
            render: 'switchStatus',
            switchOnValue: true,
            onChange: (val, params) => {
              let { row } = params
              UserService.changeLockStatus(row.id, val).then(res => {
                if (!res.ok()) {
                  this.$refs['table'].reLoad()
                } else {
                  this.$Message.success(res.msg)
                }
              })
            },
            switchOnLabel: '锁定',
            switchOffLabel: '未锁定'
          },
          {
            title: '操作',
            key: 'action',
            render: [
              { key: 'resetPassword', permissionSuffix: 'btn:user:reset-pwd' },
              { key: 'delete', permissionSuffix: 'btn:user:logic:delete' }
            ]
          }
        ],
        searchOptions: {
          hiddenItems: [
            {
              type: 'input', label: '联系电话', prop: 'phone', tip: '联系电话'
            }
          ],
          showItems: [
            {
              type: 'input', label: '用户名', prop: 'name', tip: '用户名'
            },
            {
              type: 'input', label: '帐号', prop: 'username', tip: '帐号'
            }
          ]
        }

      }
    }
  },
  methods: {
    /** 修改按钮 点击 */
    resetPassword(row) {
      UserService.resetUserPwdById(row.id).then(resp => {
        if (resp.ok()) {
          this.$Message.success('密码重置成功')
        }
        this.$refs['table'].reLoad()
      })
    },
    /** 查看详情按钮点击 */
    viewClick(row) {

    },
    /** 新增 */
    handleAddClickAction() {
      this.$router.push({
        name: 'userManagerForm',
        params: {
          sourceRoute: this.$route
        }
      })
    },
    /** 点击删除按钮 */
    deleteClick(row) {
      UserService.logicDelete(row.id).then((resp) => {
        if (resp.ok()) {
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

<!--  -->
<template>
<div class="re-role-user-container">
  <!-- <h1> 分配( {{roleData.name || ''}} ) 用户</h1> -->
  <div class="bs-callout-small bs-callout-primary">
    <h4> 分配角色用户 </h4>
  </div>
  <Row type="flex" justify="center">
    <i-col :xs="24" :sm="24" :md="24" :lg="24">
      <Spin fix size="large" v-if="buttonLoading"> 正在加载... </Spin>
      <Alert show-icon v-if="role">
        <span style="font-size:10px">当前角色</span>
        <span style="font-weight:bold;font-size:14px"> {{ (role || {}).name || '暂无'}} </span>
        <Icon type="ios-bulb-outline" slot="icon"></Icon>
      </Alert>
      <Transfer :data="data" :target-keys="targetKeys" :list-style="listStyle" :render-format="render" :titles="['可分配用户','已分配用户']" @on-change="handleChange">
        <div :style="{float: 'right', margin: '5px',cursor:'pointer'}" @click="load">
          <Tooltip content="刷新" placement="top">
            <Icon type="md-refresh" />
          </Tooltip>
        </div>
      </Transfer>
    </i-col>
  </Row>
  <Row type="flex" justify="center">
    <i-col :xs="24" :sm="24" :md="12" :lg="12">
      <div style="text-align:center;">
        <i-button type='primary' @click='goBack'>
          <Icon type="ios-arrow-back" />返回</i-button>
        <i-button type='primary' style="margin-left:10px" :loading='buttonLoading' @click='handleSaveClick'>
          <Icon custom="iconfont icon-baocun" size=12 /> 保存</i-button>
      </div>
    </i-col>
  </Row>
</div>
</template>

<script>
import {
  UserService
} from '@/api/admin'
import {
  backMixin
} from '@/mixin/back-mixin'
export default {
  mixins: [backMixin],
  props: {
    role: Object
  },
  components: {},
  data() {
    return {
      targetRoute: {
        name: 'roleManager'
      },
      buttonLoading: false,
      // 数据源，其中的数据将会被渲染到左边一栏中，targetKeys 中指定的除外。
      data: [],
      // 显示在右侧框数据的key集合
      targetKeys: [],

      listStyle: {
        width: 'calc(50% - 30px)',
        height: '400PX'
      }
    }
  },
  methods: {
    handleSaveClick() {
      if (this.role && this.role.id) {
        this.buttonLoading = true
        const roleId = this.role.id
        const userIds = [...this.targetKeys]
        UserService.signUserToRole(roleId, userIds).then(resp => {
          if (resp.ok()) {
            this.$Message.success('分配成功')
            this.load()
          }
          this.buttonLoading = false
        })
      } else {
        this.$Message.info('请选择某个角色')
        this.goBack()
      }
    },
    handleChange(newTargetKeys, direction, moveKeys) {
      this.targetKeys = newTargetKeys
      // console.log(newTargetKeys)
    },
    load() {
      this.buttonLoading = true
      this.$nextTick(() => {
        this.init()
      })
    },
    render(item) {
      return item.name
    },
    async init() {
      if (this.role && this.role.id) {
        const roleId = this.role.id
        let allUser = []
        let resp = await UserService.findAll()
        if (resp.ok()) {
          allUser = [...resp.data]
          this.data = allUser.map(u => {
            return {
              key: u.id,
              name: u.name
            }
          })
        }
        resp = await UserService.findExistsUserByRole(roleId)
        if (resp.ok()) {
          this.targetKeys = resp.data.map(item => item.id)
        }
      }
      this.buttonLoading = false
    }
  },
  mounted: function () {
    let {
      sourceRoute
    } = this.$route.params
    this.sourceRoute = sourceRoute
    this.load()
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.re-role-user-container {
  .ivu-row-flex {
    margin-bottom: 10px;
  }
}
</style>

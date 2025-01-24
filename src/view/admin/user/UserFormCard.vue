<!--
用户表

@author hsc
@since 2019-01-08

-->
<template>
<div>
  <Card>
    <div>
      <div class="bs-callout-small bs-callout-primary">
        <h4> {{_.isNil(userData.id)?'新增用户':'修改用户'}}</h4>
      </div>
    </div>
    <Row type="flex" justify="center">
      <i-col :xs="24" :sm="24" :md="12" :lg="12">
        <lega-form  ref="userForm" :form-item-data="userFormItemData" :form-rules="userFormRules"></lega-form>
        <Spin fix v-if="buttonLoading" size="large">正在保存数据...</Spin>
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col :xs="24" :sm="24" :md="12" :lg="12">
        <div style="float:right;position:relative">
          <ButtonGroup>
            <i-button type='primary' @click.native='goBack'>
              <Icon type="ios-arrow-back" />返回</i-button>
            <i-button type='primary' :loading='buttonLoading' @click.native='handleSaveClick'>
              <Icon custom="iconfont icon-baocun" size=12 /> 保存</i-button>
          </ButtonGroup>
        </div>
      </i-col>
    </Row>
  </Card>
</div>
</template>
<script>
import {
  mapGetters
} from 'vuex'
import {
  formMixin
} from '@/mixin/form-mixin'
import {
  backMixin
} from '@/mixin/back-mixin'
import LegaForm from '@/components/form/LegaForm'
import { UserService } from '@/api/admin'
export default {
  mixins: [formMixin, backMixin],
  props: {
    user: Object
  },
  components: {
    LegaForm
  },
  data() {
    return {
      targetRoute: {
        name: 'userManager'
      },
      // 按钮是否处于加载
      buttonLoading: false,
      userData: {},
      // 表单验证规则
      userFormRules: {
        name: [{
          required: true,
          message: '用户名不能为空',
          trigger: 'blur'
        }],
        username: [{
          required: true,
          validator: this.usernameValidator,
          trigger: 'blur'
        }],
        pwd: [
          {
            required: true,
            validator: this.pwdValidator,
            trigger: 'blur'
          }
        ]
      },
      // 表单项配置
      userFormItemData: [
        [
          {
            type: 'input',
            prop: 'name',
            label: '用户名',
            tip: '用户名'
          }
        ],
        [
          {
            type: 'input',
            prop: 'username',
            label: '登录帐号',
            tip: '帐号'
          }
        ],
        [
          {
            type: 'input',
            prop: 'pwd',
            label: '密码',
            tip: '密码'
          }
        ],
        [
          {
            type: 'switch',
            prop: 'enable',
            label: '是否启用',
            tip: '是否启用',
            options: {
              size: 'large',
              openText: '启用',
              closeText: '关'
            }
          }
        ],
        [
          {
            type: 'switch',
            prop: 'lockStatus',
            label: '是否锁定',
            tip: '是否禁用',
            options: {
              size: 'large',
              openText: '锁定',
              closeText: '未锁定'
            }
          }
        ]
      ]
    }
  },
  methods: {
    usernameValidator: function (rule, value, callback) {
      if (this._.isNil(value) || value === '') {
        callback(new Error('登录账号不能为空'))
        return
      }
      // 检查账户复杂程度
      // 检查登录账号是否已经存在
      let params = []
      if (this.userData && this.userData.id) {
        params.push({
          field: 'id',
          queryType: 'neq',
          value: this.userData.id
        })
      }
      params.push({
        field: 'username',
        queryType: 'eq',
        value: value
      })
      UserService.countByCondition(params).then(resp => {
        if (resp.ok()) {
          let cnt = resp.data
          if (cnt === 0) {
            callback()
          } else {
            callback(new Error('账户已经存在'))
          }
        } else {
          callback(new Error(esp.msg))
        }
      })
    },
    pwdValidator: function (rule, value, callback) {
      if (this._.isNil(value) || value === '') {
        callback(new Error('密码不能为空'))
        return
      }
      // 检查密码长度

      // 重置 表单的 路由名称 路由路径 ，并禁止其编辑
      callback()
    },
    /** 保存点击 */
    handleSaveClick: function () {
      const vm = this
      vm.buttonLoading = true
      var opt = {
        fail: function () {
          vm.$Message.error('数据格式不正确')
          vm.buttonLoading = false
        }
      }

      let msg = '信息更改成功'
      opt.success = function (params) {
        if (vm._.isNil(params.id) || vm._.isEmpty(params.id)) {
          msg = '新增成功'
        }
        // 将参数整理成 需要的数据
        let _p = vm.makeData(params)
        console.log(_p)
        UserService.save(_p).then(resp => {
          if (resp.ok()) {
            vm.$Message.info(msg)
            vm.goBack()
          }
          vm.buttonLoading = false
        })
      }
      vm.$refs['userForm'].validate(opt)
    },
    /** 将参数整理成 需要的数据 */
    makeData: function (formData) {
      return formData
    },
    _initForm: function () {
      const _d = {
        enable: true,
        lockStatus: false,
        ...this.user
      }
      this.userData = _d
      this.$refs['userForm'].setFormDatas(_d)
    }
  },
  mounted: function () {
    let {
      sourceRoute
    } = this.$route.params
    this.sourceRoute = sourceRoute
    this._initForm()
  },
  computed: {
    ...mapGetters([
      'dictDatasWithGroupKey',
      'dictFormatter'
    ])
  }
}
</script>

<style scoped>
</style>

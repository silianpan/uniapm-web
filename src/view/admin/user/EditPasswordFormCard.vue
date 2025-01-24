<!--

@author hsc
@since 2018-12-20

-->
<template>
<div class="sys-user-container">
  <Card>
    <div class="bs-callout-small bs-callout-primary">
      <h4> 修改用户密码</h4>
    </div>
    <Row type="flex" justify="center">
      <i-col :xs="24" :sm="24" :md="12" :lg="12">
        <Spin fix size="large" v-if="buttonLoading"></Spin>
        <lega-form ref="userForm" :form-item-data="userFormItemData" :form-rules="userFormRules"></lega-form>
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col :xs="24" :sm="24" :md="12" :lg="12">
        <div style="float:right;position:relative">
          <ButtonGroup>
            <i-button @click.native='goBack'>
              <Icon custom="iconfont icon-zhongzhi" size=12 />取消</i-button>
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
import LegaForm from '@/components/form/LegaForm'
import {
  UserService
} from '@/api/admin'
import {
  backMixin
} from '@/mixin/back-mixin'
export default {
  mixins: [formMixin, backMixin],
  props: {
    userId: String
  },
  components: {
    LegaForm
  },
  data() {
    return {
      editUserInfo: {},
      // 来自于哪个 route
      sourceRoute: {},
      // 按钮是否处于加载
      buttonLoading: false,
      // 表单验证规则
      userFormRules: {
        // name: [{
        //   required: true,
        //   message: '姓名不能位空',
        //   trigger: 'change'
        // }],
        // username: [{
        //   required: true,
        //   validator: this.loginNameValidator,
        //   trigger: 'blur'
        // }],
        pwd: [{
          required: true,
          validator: this.oldPasswordValidator,
          trigger: 'blur'
        }],
        newPwd: [{
          required: true,
          validator: this.newPasswordValidator,
          trigger: 'blur'
        }],
        rpNewPwd: [{
          required: true,
          validator: this.rpPasswordValidator,
          trigger: 'blur'
        }]
      },
      // 表单项配置
      userFormItemData: [
        // [
        //   {
        //   type: 'input',
        //   prop: 'name',
        //   disabled: true,
        //   labelWidth: 100,
        //   label: '姓名',
        //   tip: '姓名'
        // }],
        // [{
        //   type: 'input',
        //   prop: 'username',
        //   labelWidth: 100,
        //   disabled: true,
        //   label: '账户',
        //   tip: '登录账户'
        // }],
        [{
          type: 'password',
          labelWidth: 100,
          prop: 'pwd',
          label: '原密码',
          tip: '原密码'
        }],
        [{
          type: 'password',
          prop: 'newPwd',
          labelWidth: 100,
          label: '新密码',
          tip: '新密码'
        }],
        [{
          type: 'password',
          prop: 'rpNewPwd',
          labelWidth: 100,
          label: '确认新密码',
          tip: '确认新密码'
        }]
      ]
    }
  },
  methods: {
    loginNameValidator: function (rule, value, callback) {
      if (this._.isNil(value) || value === '') {
        callback(new Error('登陆账户不能为空'))
        return
      }
      callback()
    },
    // 旧 密码  是否正确
    oldPasswordValidator: function (rule, value, callback) {
      if (this._.isNil(value) || value === '') {
        callback(new Error('密码不能为空'))
        return
      }
      // 根据 userid 验证 输入的密码是否正确
      UserService.validateUserOldPwdById(this.userId, value).then(res => {
        if (res.ok()) {
          if (res.data === true) {
            callback()
          } else {
            callback(new Error('原密码不正确'))
          }
        } else {
          callback(new Error(res.msg))
        }
      })
    },
    // 验证新输入的密码
    newPasswordValidator: function (rule, value, callback) {
      if (this._.isNil(value) || value === '') {
        callback(new Error('密码不能为空'))
        return
      }
      // 校验长度
      if (value.length < 5 || value.length > 12) {
        callback(new Error('密码长度在6～12位之间'))
        return
      }
      // 获取到新密码 与 重复密码
      const formDatas = this.$refs.userForm.getFormDatas()
      const newPassword = formDatas.newPwd
      const rpPassword = formDatas.rpNewPwd
      if (rpPassword && newPassword !== rpPassword) {
        callback(new Error('新密码与确认密码不一致'))
      } else {
        callback()
      }
    },
    // 验证新输入的重复密码
    rpPasswordValidator: function (rule, value, callback) {
      if (this._.isNil(value) || value === '') {
        callback(new Error('确认密码不能为空'))
        return
      }
      if (value.length < 5 || value.length > 12) {
        callback(new Error('密码长度在6～12位之间'))
        return
      }
      // 获取到密码 与 重复密码
      const formDatas = this.$refs.userForm.getFormDatas()
      const newPassword = formDatas.newPwd
      const rpPassword = formDatas.rpNewPwd
      if (newPassword !== rpPassword) {
        callback(new Error('确认密码与密码不一致'))
        return
      }
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
      opt.success = function (params) {
        // 将参数整理成 需要的数据
        let _p = vm.makeData(params)
        if (_p.id) {
          UserService.modifyUserPwdById(_p.id, _p.pwd, _p.newPwd).then(res => {
            if (res.ok()) {
              if (res.data === true) {
                vm.$Message.success('密码修改成功')
              }
              vm.goBack()
            }
            vm.buttonLoading = false
          })
        }
      }
      vm.$refs['userForm'].validate(opt)
    },
    /** 将参数整理成 需要的数据 */
    makeData: function (formData) {
      let d = {}
      d.id = this.editUserInfo.id
      d.pwd = formData.pwd
      d.newPwd = formData.newPwd
      return d
    }
  },
  mounted: function () {
    let {
      sourceRoute
    } = this.$route.params
    this.sourceRoute = sourceRoute
    if (!this._.isNil(this.userId)) {
      this.buttonLoading = true
      UserService.findById(this.userId).then(res => {
        if (res.ok()) {
          this.editUserInfo = res.data
          this.$refs.userForm.setFormDatas({
            name: res.data.name,
            username: res.data.username
          })
        } else {
          this.goBack()
        }
        this.buttonLoading = false
      })
    } else {
      this.goBack()
    }
  },
  computed: {
    ...mapGetters([
      'dictDatasWithGroupKey',
      'dictFormatter'
    ])
  }
}
</script>

<style lang="less" scoped>
.sys-user-container {
  .ivu-row {
    margin-bottom: 10px;
  }
}
</style>

<!--
角色表

@author hsc
@since 2019-01-08

-->
<template>
<div>
  <Card>
    <div class="bs-callout-small bs-callout-primary">
      <h4> {{_.isNil(roleData.id)?'新增角色':'修改角色'}}</h4>
    </div>
    <Row type="flex" justify="center">
      <i-col :xs="24" :sm="24" :md="12" :lg="12">
        <lega-form ref="roleForm" :form-item-data="roleFormItemData" :form-rules="roleFormRules"></lega-form>
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
import {
  RoleService
} from '@/api/admin'
export default {
  mixins: [formMixin, backMixin],
  props: {
    role: Object
  },
  components: {
    LegaForm
  },
  data() {
    return {
      targetRoute: {
        name: 'roleManager'
      },
      // 按钮是否处于加载
      buttonLoading: false,
      roleData: {},
      // 表单验证规则
      roleFormRules: {
        name: [{
          required: true,
          validator: this.roleNameValidator,
          trigger: 'blur'
        }],
        pid: [{
          required: true,
          message: '父级不能为空',
          trigger: 'blur'
        }]

      },
      // 表单项配置
      roleFormItemData: [
        [{
          type: 'input',
          prop: 'name',
          label: '角色名',
          tip: '角色名'
        }],
        [{
          type: 'input',
          prop: 'pid',
          label: '父级',
          tip: '父级角色'
        }],
        [{
          type: 'input',
          prop: 'level',
          label: '级别',
          tip: '级别'
        }],
        [{
          type: 'switch',
          prop: 'enable',
          label: '是否启用',
          tip: '是否启用',
          options: {
            size: 'large',
            openText: '启用',
            closeText: '关'
          }
        }],
        [{
          type: 'textArea',
          prop: 'desc',
          label: '角色描述',
          tip: '角色描述'
        }]
      ]
    }
  },
  methods: {
    roleNameValidator: function (rule, value, callback) {
      if (this._.isNil(value) || value === '') {
        callback(new Error('角色名称不能为空'))
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

      let msg = '信息更改成功'
      opt.success = function (params) {
        if (vm._.isNil(params.id) || vm._.isEmpty(params.id)) {
          msg = '新增成功'
        }
        // 将参数整理成 需要的数据
        let _p = vm.makeData(params)
        RoleService.save(_p).then(resp => {
          if (resp.ok()) {
            vm.$Message.success(msg)
            vm.goBack()
          }
          vm.buttonLoading = false
        })
      }
      vm.$refs['roleForm'].validate(opt)
    },
    /** 将参数整理成 需要的数据 */
    makeData: function (formData) {
      return formData
    },
    _initForm: function () {
      const _d = {
        enable: true,
        ...this.role
      }

      this.roleData = _d
      this.$refs['roleForm'].setFormDatas(_d)
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

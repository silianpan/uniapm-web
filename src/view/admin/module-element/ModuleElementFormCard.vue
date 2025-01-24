<!--
资源模块内元素表

@author hsc
@since 2019-01-08

-->
<template>
<div>
  <Card>
    <div class="bs-callout-small bs-callout-primary">
      <h4> {{_.isNil(moduleElementData.id)?'新增模块元素':'修改模块元素'}}</h4>
    </div>
    <Row type="flex" justify="center">
      <i-col :xs="24" :sm="24" :md="12" :lg="12">
        <lega-form ref="moduleElementForm" :form-item-data="moduleElementFormItemData" :form-rules="moduleElementFormRules"></lega-form>
        <Spin fix v-if="buttonLoading" size="large">正在保存数据...</Spin>
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col :xs="24" :sm="24" :md="12" :lg="12">
        <div style="float:right;position:relative">
          <ButtonGroup>
            <i-button type='primary' @click.native='goBack'>
              <Icon  type="ios-arrow-back" />返回</i-button>
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
import { ModuleElementService } from '@/api/admin'
const ModuleElementTypes = {
  uri: 'URI',
  btn: '按钮'
}
export default {
  mixins: [formMixin, backMixin],
  props: {
    module: Object,
    element: Object
  },
  components: {
    LegaForm
  },
  data() {
    return {
      elementType: 'uri',
      // 按钮是否处于加载
      buttonLoading: false,

      moduleElementData: {}
      // 表单验证规则
    }
  },
  methods: {
    moduleCodeValidator: function (rule, value, callback) {
      if (this._.isNil(value) || value === '') {
        callback(new Error('模块不能为空'))
        return
      }
      let params = [
        {
          field: 'code',
          queryType: 'eq',
          value: value
        }
      ]
      if (this.moduleElementData && this.moduleElementData.id) {
        params.push({
          field: 'id',
          queryType: 'neq',
          value: this.moduleElementData.id
        })
      }
      ModuleElementService.countByCondition(params).then(resp => {
        if (resp.ok()) {
          callback()
        } else {
          callback(new Error(resp.msg))
        }
      })
      // 重置 表单的 路由名称 路由路径 ，并禁止其编辑
      // this.elementType = value
    },
    /** 模块类型验证器 */
    moduleTypeValidator: function (rule, value, callback) {
      if (this._.isNil(value) || value === '') {
        callback(new Error('模块类型不能为空'))
        return
      }
      // 重置 表单的 路由名称 路由路径 ，并禁止其编辑
      this.elementType = value
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
        ModuleElementService.save(_p).then(res => {
          if (res.ok()) {
            vm.$Message.info(msg)
            vm.goBack()
          }
          vm.buttonLoading = false
        })
      }
      vm.$refs['moduleElementForm'].validate(opt)
    },
    /** 将参数整理成 需要的数据 */
    makeData: function (formData) {
      return formData
    },
    _initForm: function () {
      let { id, name } = (this.module || {})
      const _d = {
        moduleId: id,
        moduleName: name,
        type: 'uri',
        enable: true,
        method: 'GET',
        ...this.element
      }
      this.elementType = _d.type
      this.moduleElementData = _d
      this.$refs['moduleElementForm'].setFormDatas(_d)
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
    ]),
    moduleElementFormRules() {
      let rules = {
        moduleName: [{
          required: true,
          message: '模块不能为空',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '名称不能为空',
          trigger: 'blur'
        }],
        code: [{
          required: true,
          validator: this.moduleCodeValidator,
          trigger: 'blur'
        }],
        type: [{
          required: true,
          validator: this.moduleTypeValidator,
          trigger: 'change'
        }]

      }
      return rules
    },
    moduleElementFormItemData() {
      let moduleItem
      if (this.module && this.module.id && this.module.name) {
        moduleItem = [
          {
            type: 'input',
            prop: 'moduleName',
            label: '所属模块',
            tip: '所属模块',
            disabled: true
          }
        ]
      } else {
        moduleItem = [
          {
            type: 'input',
            prop: 'moduleName',
            label: '所属模块',
            tip: '请选择模块'
          }
        ]
      }
      let uriFormItems = []
      if (this.elementType === 'uri') {
        uriFormItems = [
          [{
            type: 'input',
            prop: 'uri',
            label: '服务路径',
            tip: '请求后台服务路径'
          }],
          [{
            type: 'select',
            prop: 'method',
            label: '请求类型',
            options: 'GET,POST,DELETE'.split(',').map(item => {
              return {
                key: item,
                value: item
              }
            }),
            tip: '请求类型,默认GET请求'
          }]
        ]
      }
      let items = [
        moduleItem,
        [{
          type: 'input',
          prop: 'name',
          label: '名称',
          tip: '模块元素名称'
        }],

        [{
          type: 'input',
          prop: 'code',
          label: '编码',
          tip: '编码'
        }],
        [
          {
            type: 'select',
            prop: 'type',
            label: '类型',
            options: Object.keys(ModuleElementTypes).map(field => {
              return {
                key: ModuleElementTypes[field],
                value: field
              }
            }),
            tip: '模块元素类型'
          }
        ],
        ...uriFormItems,
        [
          {
            type: 'input',
            prop: 'iconCls',
            label: '图标样式',
            tip: '图标样式'
          }
        ],
        [{
          type: 'input',
          prop: 'level',
          label: '等级',
          tip: '模块元素等级(可用作排序)'
        }],
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
            type: 'textArea',
            prop: 'desc',
            label: '描述',
            tip: '模块元素描述'
          }
        ]
      ]
      return items
    }
  }
}
</script>

<style scoped>
</style>

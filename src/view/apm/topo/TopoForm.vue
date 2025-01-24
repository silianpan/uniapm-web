<!--
资源模块表

@author hsc
@since 2019-01-07

-->
<template>
<div class="module-container">
  <Card>
    <div class="bs-callout-small bs-callout-primary">
      <h4> {{_.isNil(moduleData.id)?'新增拓扑图':'修改拓扑图'}}</h4>
    </div>
    <Row type="flex" justify="center">
      <i-col :xs="24" :sm="24" :md="12" :lg="12">
        <lega-form ref="topoForm" :form-item-data="moduleFormItemData" :form-rules="moduleFormRules" :labelWidth="100"></lega-form>
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
  formMixin
} from '@/mixin/form-mixin'
import {
  backMixin
} from '@/mixin/back-mixin'
import LegaForm from '@/components/form/LegaForm'
import {
  TopoService
} from '@/api/apm/topo'
export default {
  mixins: [formMixin, backMixin],
  props: {
    data: Object
  },
  components: {
    LegaForm
  },
  data() {
    return {
      moduleTypeIsNotMenu: false,
      targetRoute: {
        name: 'topologyInfo'
      },
      // 按钮是否处于加载
      buttonLoading: false,
      // 是否是预览状态
      isPreView: false,
      moduleData: {},
      // 表单验证规则
      moduleFormRules: {
        name: [{
          required: true,
          message: '拓扑图名称不能为空',
          trigger: 'blur'
        }]
      },
      // 表单项配置
      moduleFormItemData: [
        [{
          type: 'input',
          prop: 'name',
          label: '拓扑图名称',
          tip: '拓扑图名称'
        }],
        [{
          type: 'switch',
          prop: 'fullscreen',
          label: '是否大屏展示',
          tip: '是否大屏展示',
          options: {
            size: 'large',
            openText: '是',
            closeText: '否'
          }
        }],
        [{
          type: 'switch',
          prop: 'defaultscreen',
          label: '是否默认展示',
          tip: '是否默认展示',
          options: {
            size: 'large',
            openText: '是',
            closeText: '否'
          }
        }]
      ]
    }
  },
  methods: {
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
        // 保存菜单模块
        TopoService.save(_p).then(res => {
          if (res.ok()) {
            vm.$Message.info(msg)
            vm.goBack()
          }
          vm.buttonLoading = false
        })
      }
      vm.$refs['topoForm'].validate(opt)
    },
    /** 将参数整理成 需要的数据 */
    makeData: function (formData) {
      return formData
    },
    _initForm: function () {
      const data = {
        fullscreen: false,
        defaultscreen: false,
        ...this.data
      }
      this.moduleData = data
      this.$refs['topoForm'].setFormDatas(data)
    }
  },
  mounted: function () {
    let {
      sourceRoute
    } = this.$route.params
    this.sourceRoute = sourceRoute
    this._initForm()
  }
}
</script>

<style lang="less" scoped>
.module-container {
  .ivu-row {
    margin-bottom: 10px;
  }
}
</style>

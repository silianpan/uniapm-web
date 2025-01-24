<!--
资源模块表

@author hsc
@since 2019-01-07

-->
<template>
<div class="module-container">
  <Card>
    <div class="bs-callout-small bs-callout-primary">
      <h4> {{_.isNil(moduleData.id)?'新增菜单模块':'修改菜单模块'}}</h4>
    </div>
    <Row type="flex" justify="center">
      <i-col :xs="24" :sm="24" :md="12" :lg="12">
        <lega-form ref="moduleForm" :form-item-data="moduleFormItemData" :form-rules="moduleFormRules"></lega-form>
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
  ModuleService
} from '@/api/admin'
const ModuleTypes = {
  menu: '菜单',
  api: '数据'
}
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
        name: 'moduleManager'
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
          message: '模块名称不能为空',
          trigger: 'blur'
        }],
        code: [{
          required: true,
          message: '编码不能为空',
          trigger: 'blur'
        }],
        type: [{
          required: true,
          validator: this.moduleTypeValidator,
          trigger: 'change'
        }]

      },
      // 表单项配置
      moduleFormItemData: [
        [{
          type: 'input',
          prop: 'name',
          label: '模块名称',
          tip: '模块名称'
        }],

        [{
          type: 'input',
          prop: 'code',
          label: '编码',
          tip: '编码'
        }],
        [{
          type: 'select',
          prop: 'type',
          label: '模块类型',
          tip: '模块类型',
          options: Object.keys(ModuleTypes).map(field => {
            return {
              key: ModuleTypes[field],
              value: field
            }
          })

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
          type: 'dynamic-modal',
          prop: 'pid',
          textField: 'pName',
          label: '父级模块',
          placeholder: '请选择父级模块',
          handleClear: () => {
            this.$refs['moduleForm'].setFormFieldData('pid', '-1')
            this.$refs['moduleForm'].setFormFieldData('pids', '-1')
            this.$refs['moduleForm'].setFormFieldData('pName', '根模块')
          },
          options: {
            title: '父级模块',
            footerHide: true,
            width: '70%',
            renderBody: h => {
              return h('LegaTable', {
                props: {
                  options: {
                    type: 'tree',
                    loadData: this.loadData,
                    queryDataAction: this.handlePageModuleAction,
                    actionsHandle: {
                      select: (params, column) => {
                        this.$nextTick(() => {
                          let row = params.row
                          this.$refs['moduleForm'].setFormFieldData('pid', row.id)
                          this.$refs['moduleForm'].setFormFieldData('pids', `${row.pids || -1},${row.id}`)
                          this.$refs['moduleForm'].setFormFieldData('pName', row.name)
                          this.$refs['moduleForm']
                            .getDynamicModalByKey('pName')
                            .remove()
                        })
                      }
                    },
                    columns: [
                      {
                        key: 'name',
                        title: '模块名称',
                        type: 'tree',
                        showTaggle: (row) => {
                          return row.childrenCnt > 0
                        }
                      },
                      {
                        key: 'code',
                        title: '编码',
                        align: 'center'
                      },
                      {
                        key: 'type',
                        title: '模块类型',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                          const ModuleTypes = {
                            menu: '菜单',
                            api: '数据'
                          }
                          return h('span', ModuleTypes[params.row.type] || '-')
                        }
                      },
                      {
                        key: 'route',
                        title: '路由名称',
                        align: 'center',
                        render: (h, params) => {
                          return h('span', params.row.route || '-')
                        }
                      },
                      {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 100,
                        render: ['select']
                      }
                    ]
                  }

                }
              })
            }
          }
        }],
        [{
          type: 'input',
          prop: 'route',
          label: '路由名称',
          tip: '路由名称',
          disabled: () => {
            return this.moduleTypeIsNotMenu
          }
        }],
        [{
          type: 'input',
          prop: 'path',
          label: '路由路径',
          tip: '路由路径',
          disabled: () => {
            return this.moduleTypeIsNotMenu
          }
        }],
        [{
          type: 'input',
          prop: 'iconCls',
          label: '图标样式',
          tip: '图标样式'
        }],
        [{
          type: 'input',
          prop: 'level',
          label: '等级',
          tip: '模块等级(用作排序)'
        }],

        [{
          type: 'textArea',
          prop: 'desc',
          label: '模块描述',
          tip: '模块描述'
        }]
      ]
    }
  },
  methods: {
    handlePageModuleAction(params, callback) {
      ModuleService.findModulesByPid('-1').then(resp => {
        callback(resp)
      })
    },
    loadData(p, callback) {
      if (p) {
        ModuleService.findModulesByPid(p.id).then(resp => {
          if (resp.ok()) {
            callback(resp.data)
          }
        })
      }
    },
    /** 模块类型验证器 */
    moduleTypeValidator: function (rule, value, callback) {
      if (this._.isNil(value) || value === '') {
        callback(new Error('模块类型不能为空'))
        return
      }
      // 重置 表单的 路由名称 路由路径 ，并禁止其编辑
      this.moduleTypeIsNotMenu = value !== 'menu'
      if (this.moduleTypeIsNotMenu) {
        this.$refs['moduleForm'].setFormFieldData('route', undefined)
        this.$refs['moduleForm'].setFormFieldData('path', undefined)
      }
      callback()
    },
    /** 点击说明按钮 */
    handleShowDescriptionClick() {

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
        // 保存菜单模块
        ModuleService.save(_p).then(res => {
          if (res.ok()) {
            vm.$Message.info(msg)
            vm.goBack()
          }
          vm.buttonLoading = false
        })
      }
      vm.$refs['moduleForm'].validate(opt)
    },
    /** 将参数整理成 需要的数据 */
    makeData: function (formData) {
      return formData
    },
    _initForm: function () {
      const data = {
        enable: true,
        type: 'menu',
        pid: '-1',
        pids: '-1',
        pName: '根模块',
        ...this.data
      }
      this.moduleData = data
      this.moduleTypeIsNotMenu = this.moduleData.type !== 'menu'
      this.$refs['moduleForm'].setFormDatas(data)
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

<style lang="less" scoped>
.module-container {
  .ivu-row {
    margin-bottom: 10px;
  }
}
</style>

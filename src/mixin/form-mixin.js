import { mapGetters } from 'vuex'
var formMixin = {
  computed: {
    ...mapGetters([
      'elements',
      'hasElementsPerimByKey',
      'dictDatasWithGroupKey',
      'dictFormatter'
    ])
  },
  methods: {
    // 重置表单
    resetFormItem: function() {
      this.$refs['form'].resetFields()
    },
    getFormDatas: function() {
      return {}
    },
    validate: function(validOpt) {
      const vm = this
      let _validaOpt = {
        ...{
          success: params => {
            vm.$Message.error('数据格式正确!')
          },
          fail: () => {
            vm.$Message.error('验证失败!')
          }
        },
        ...validOpt
      }
      // vm.validOpt = {...vm.validOpt, ...validOpt}
      vm.$refs['form'].validate(valid => {
        if (valid) {
          // vm.editting = false;
          if (vm._.isFunction(_validaOpt.success)) {
            // 如果
            try {
              let params = vm.getFormDatas()
              if (vm._.isFunction(_validaOpt.success)) {
                _validaOpt.success(params)
              }
            } catch (e) {
              console.log(e)
              vm.$Message.error(e)
              if (vm._.isFunction(_validaOpt.fail)) {
                _validaOpt.fail()
              }
            }
          }
        } else {
          if (vm._.isFunction(_validaOpt.fail)) {
            _validaOpt.fail()
          }
        }
      })
    }
  }
}
export { formMixin }

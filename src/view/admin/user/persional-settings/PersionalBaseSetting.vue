<!--  -->
<template>
<div class="base-setting-container">
  <h3>基本设置</h3>
  <Divider></Divider>
  <Row type="flex" :gutter="20">
    <i-col :xs="24" :sm="24" :md="12" :lg="12">
      <lega-form :labelWidth="null" ref="userForm" labelPosition="top" :form-item-data="userFormItemData" :form-rules="userFormRules"></lega-form>
      <Spin fix v-if="buttonLoading" size="large"></Spin>
    </i-col>
    <i-col :xs="24" :sm="24" :md="12" :lg="12">
      <div style="width:100%;height:100%;">
        <div class="img-box" :style="imageStyle">
          <img ref="img-cropper" :src="imageUrl" />
        </div>
        <div style="margin-top:10px">
          <Button icon="ios-camera" type="primary" :loading="buttonLoading"  @click="handleSelectImageClick"> 选择头像</Button>
        </div>
      </div>
    </i-col>
  </Row>
  <Row>
    <i-col>
      <div style="text-align:left">
        <Button :loading="buttonLoading" @click="handleUpdateUserInfoClick" icon="md-refresh" type="primary">更新基本信息</Button>
      </div>
    </i-col>
  </Row>
</div>
</template>

<script>
import ImageEditor from '@/components/image-editor/ImageEditor'
import { RegexUtil } from '@/utils/RegexUtil'
import {
  formMixin
} from '@/mixin/form-mixin'
import {
  UserService
} from '@/api/admin'
export default {
  props: {
    userId: String
  },
  mixins: [formMixin],
  components: {
    ImageEditor
  },
  data() {
    return {
      imageStyle: {
        'height': '100px',
        'width': '100px',
        'position': 'relative',
        'overflow': 'hidden',
        'line-height': '32px',
        'border-radius': '50px',
        'display': 'inline-block',
        'text-align': 'center',
        'vertical-align': 'middle',
        'color': '#fff',
        'white-space': 'nowrap'
      },
      imageUrl: '',
      buttonLoading: false,
      userFormItemData: [
        [
          {
            type: 'input',
            prop: 'name',
            label: '昵称',
            tip: '昵称'
          }],
        [
          {
            type: 'input',
            prop: 'phone',
            label: '联系电话',
            tip: '联系电话'
          }

        ],
        [
          {
            type: 'input',
            prop: 'mail',
            label: '邮箱',
            tip: '邮箱'
          }
        ]
      ],
      userFormRules: {
        name: [{
          required: true,
          message: '昵称不能为空',
          trigger: 'change'
        }],
        phone: [
          {
            validator: this.phoneValidator,
            trigger: 'blur'
          }
        ],
        mail: [
          {
            validator: this.mailValidator,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    /** 验证电话格式 */
    phoneValidator: function (rule, value, callback) {
      if (this._.isNil(value) || this._.isEmpty(value)) {
        callback()
      } else {
        if (!RegexUtil.testPhone(value)) {
          callback(new Error('电话格式不正确'))
        } else {
          callback()
        }
      }
    },
    /** 验证邮箱格式 */
    mailValidator: function (rule, value, callback) {
      if (this._.isNil(value) || this._.isEmpty(value)) {
        callback()
      } else {
        if (!RegexUtil.testEmail(value)) {
          callback(new Error('邮箱格式不正确'))
        } else {
          callback()
        }
      }
    },
    /** 将参数整理成 需要的数据 */
    makeData: function (formData) {
      let d = { ...formData }
      d.photo = this.imageUrl
      return d
    },
    handleUpdateUserInfoClick: function () {
      const vm = this
      vm.buttonLoading = true
      var opt = {
        fail: function () {
          vm.$Message.error('表单数据不正确')
          vm.buttonLoading = false
        }
      }
      opt.success = function (params) {
        // 将参数整理成 需要的数据
        let _p = vm.makeData(params)
        if (_p.id) {
          UserService.save(_p).then(res => {
            if (res.ok()) {
              vm.$Message.success('基本信息更新成功')
            }
            vm.buttonLoading = false
          })
        }
      }
      vm.$refs['userForm'].validate(opt)
    },

    handleSelectImageClick() {
      const _dynamicModal = this._dynamicModal.newInstance({
        width: '80%',
        footerHide: true,
        closable: false,
        renderBody: (h) => {
          return h(ImageEditor, {
            props: {
              canvasOptions: {
                maxWidth: 4096,
                maxHeight: 4096
              },
              previewImgStyle: { ...this.imageStyle },
              imgSrc: this.imageUrl,
              okClick: (canvas, cropBox) => {
                this.imageUrl = canvas.toDataURL('image/png')
                _dynamicModal.remove()
              }
            }
          })
        }
      })
      _dynamicModal.show()
    }
  },
  mounted: function () {
    if (!this._.isNil(this.userId)) {
      this.buttonLoading = true
      UserService.findById(this.userId).then(res => {
        if (res.ok()) {
          let { id, name, phone, photo, mail } = res.data
          this.imageUrl = photo
          this.$refs.userForm.setFormDatas({ id, name, phone, photo, mail })
        }
        this.buttonLoading = false
      })
    }
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.cropper {
  height: 300px;
  box-sizing: border-box;
  border: 1px solid #c3c3c3;

  .img {
    max-height: 100%;
  }
}

.base-setting-container {
  .ivu-row-flex {
    margin-bottom: 5px;
  }

  .img-box {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    border-color: #eee;
    max-width: 100%;
    max-width: 100%;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>

<!--  -->
<template>
<div class="image-editor-contianer">

  <Row :gutter="10">
    <i-col :xs="12" :sm="12" :md="12" :lg="12">
      <div class="bs-callout-small bs-callout-primary">
        <h4> 裁剪</h4>
      </div>
      <div class="img-box">
        <img ref="img-cropper" :src="imgSrc||''" />
      </div>
    </i-col>
    <i-col :xs="12" :sm="12" :md="12" :lg="12">
      <div class="bs-callout-small bs-callout-primary">
        <h4> 预览</h4>
      </div>
      <div  :style="previewImgStyle">
        <div class="preview-box" ref="preview-box">
        </div>
      </div>
      <Divider style="margin:5px"></Divider>
      <div>
        <ButtonGroup v-for="(groupBtns, index) in buttonGroups" :key="index">
          <i-button :disabled="btnDisabled" v-for="(btn, _index) in groupBtns" :key="_index" @click="btn.click" :type="btn.type||'primary'">
            <Tooltip placement="top" :content="btn.poptip || ''">
              <Icon :custom="btn.iconType" :size="btn.iconSize || 12"></Icon>
            </Tooltip>
          </i-button>
        </ButtonGroup>
      </div>
      <Divider style="margin:5px"></Divider>
      <div>
        <div class="ivu-upload">
          <input multiple="false" ref="fileInput" class="ivu-upload-input" type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleImageChange" />
        </div>
         <ButtonGroup>
          <Button icon="ios-camera" type="primary"  @click="handleSelectImageClick">选择图片</Button>
          <Button type="primary"  @click="handleOkClick" :disabled="btnDisabled">确定</Button>
         </ButtonGroup>
        </div>
    </i-col>
  </Row>

</div>
</template>

<script>
import Icons from '@/components/icons'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'
export default {
  props: {
    imgSrc: String,
    okClick: Function,
    canvasOptions: {
      type: Object,
      default: function() {
        return {
          maxWidth: 4096,
          maxHeight: 4096
        }
      }
    },
    previewImgStyle: Object
  },
  components: {
    Icons
  },
  data() {
    return {
      cropperImg: null,
      btnDisabled: true,
      buttonGroups: [

        [{
          type: 'primary',
          iconType: 'iconfont icon-search-plus',
          iconSize: 14,
          poptip: '放大',
          click: () => {
            this.cropperImg.zoom(0.1)
          }
        },
        {
          type: 'primary',
          iconType: 'iconfont icon-search-minus',
          iconSize: 14,
          poptip: '缩小',
          click: () => {
            this.cropperImg.zoom(-0.1)
          }
        }
        ],
        [{
          type: 'primary',
          iconType: 'iconfont icon-arrow-left',
          poptip: '左移动',
          iconSize: 14,
          click: () => {
            this.cropperImg.move(-10, 0)
          }
        },
        {
          type: 'primary',
          iconType: 'iconfont icon-arrowrighticon',
          poptip: '右移动',
          iconSize: 14,
          click: () => {
            this.cropperImg.move(10, 0)
          }
        },
        {
          type: 'primary',
          iconType: 'iconfont icon-arrow-up',
          poptip: '上移动',
          iconSize: 14,
          click: () => {
            this.cropperImg.move(0, -10)
          }
        },
        {
          type: 'primary',
          iconType: 'iconfont icon-icon-down-arrow',
          poptip: '下移动',
          iconSize: 14,
          click: () => {
            this.cropperImg.move(0, 10)
          }
        }
        ],
        [
          {
            type: 'primary',
            iconType: 'iconfont icon-rotate-left',
            poptip: '逆时针旋转45度',
            iconSize: 14,
            click: () => {
              this.cropperImg.rotate(-45)
            }
          },
          {
            type: 'primary',
            iconType: 'iconfont icon-rotateright',
            poptip: '顺时针旋转45度',
            iconSize: 14,
            click: () => {
              this.cropperImg.rotate(45)
            }
          }
        ]
      ]
    }
  },
  methods: {
    handleOkClick: function() {
      let canvas = this.cropperImg.getCroppedCanvas({ ...this.canvasOptions })
      if (this.okClick && this._.isFunction(this.okClick)) {
        this.okClick(canvas, this.cropperImg.getCropBoxData())
      }
    },
    handleImageChange: function (e) {
      const files = e.target.files
      if (!files) {
        return
      }
      this.btnDisabled = true
      let reader = new FileReader()
      reader.onload = () => {
        console.log(this.cropperImg)
        this.cropperImg.replace(reader.result) // 这里必须设置true这个参数，否则旋转会有bug
        reader.onload = null
        this.btnDisabled = false
      }
      reader.readAsDataURL(files[0])
    },
    handleSelectImageClick() {
      this.$refs.fileInput.click()
    }
  },
  beforeDestroy: function () {
    if (this.cropperImg) {
      this.cropperImg.destroy()
    }
  },
  mounted: function () {
    this.cropperImg = new Cropper(this.$refs['img-cropper'], {
      dragMode: 'move',
      preview: this.$refs['preview-box'],
      restore: false,
      center: false,
      highlight: false,
      cropBoxMovable: false,
      toggleDragModeOnDblclick: false
    })
    this.btnDisabled = this._.isEmpty(this.imgSrc)
  },
  computed: {
  }
}
</script>

<style lang="less" scoped>
.image-editor-contianer {
  .ivu-btn-group {
    margin-right: 10px;
  }

  .preview-box {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    margin-bottom: 10px;
    height: 200px !important;
    border-color: #eee;
    overflow: hidden;
    // width: 100% !important;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
  }

  .img-box {
    img {
      max-height: 100%;
      max-width: 100%;
    }

    height: 300px;
    width: 100%;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    border-color: #eee;
    display: inline-block;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
  }
}
</style>

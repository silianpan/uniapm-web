<template>
  <!-- 文件上传组件 -->
  <Upload :default-file-list="item.attachment" :format="item.format" :accept="item.accept" :multiple="item.multiple===true?true:false" :with-credentials="true" :type="item.uploadType==='drag'?'drag':'select'" :action="item.actionUrl?item.actionUrl:''" :on-success="uploadSuccessHandle" :on-remove="uploadRemoveHandle" :on-error="uploadErrorHandle">
    <div style="padding: 20px 0" v-if="item.uploadType==='drag'">
      <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
      <p>{{item.uploadText}}</p>
    </div>
    <!-- <Button v-else :type="item.buttonType?item.buttonType:'primary'" icon="ios-cloud-upload-outline">{{item.uploadText}}</Button> -->
    <v-btn v-else dark color="success">{{item.uploadText}}</v-btn>
  </Upload>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          multiple: false,
          uploadType: 'select',
          actionUrl: '',
          uploadText: '上传附件',
          accept: '',
          format: [],
          attachment: []
        }
      }
    }
  },
  methods: {
    // 文件上传成功调用
    uploadSuccessHandle(response, file, fileList) {
      this.$emit('uploadSuccessHandle', response, file, fileList)
    },
    // 文件上传移除
    uploadRemoveHandle(file, fileList) {
      this.$emit('uploadRemoveHandle', file, fileList)
    },
    // 上传失败
    uploadErrorHandle(error, file, fileList) {
      this.$emit('uploadErrorHandle', error, file, fileList)
    }
  }
}
</script>

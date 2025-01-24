<template>
<Row type="flex" justify="center">
  <i-col :xs="24" :sm="isBigScreenCenter?18:24" :md="isBigScreenCenter?16:24" :lg="isBigScreenCenter?14:24">
    <Form :model="formData" ref="formData" :rules="formRules" :label-width="labelWidth" label-position="right">
      <Row v-for="(rowItems,rowIndex) in formItemData" :key="rowIndex" type="flex">
        <i-col :span="getSpanSize(rowItems)" v-for="(item,index) in rowItems" :key="index">
        <FormItem :label="item.label" :prop="item.prop">
          <!-- 输入框 -->
          <i-input v-if="item.type == 'input'" :placeholder="item.tip != null ? item.tip : '请填写'" v-model="formData[item.prop]" :class="item.style?'':'input-size'" :style="item.style" :disabled="item.disabled == true ? true : false" @on-blur="item.blurAction?inputBlurAction(item.blurAction):null">
          <Button v-if="item.button===true" slot="append"  @click="inputButtonClickHandle(item.buttonClick)">
            <icon v-if="item.customIcon" :custom="item.customIcon" :size="item.iconSize || 12"></icon>
            {{item.buttonName?item.buttonName:''}}
            </Button>
          </i-input>

          <!-- 文本域 -->
          <i-input v-if="item.type == 'textArea'" type="textarea" :rows="item.rows == null ? 2 : item.rows" :placeholder="item.tip != null ? item.tip : '请填写'" v-model="formData[item.prop]" :style="item.style" style="margin-bottom: 10px" :disabled="item.disabled == true ? true : false">
          </i-input>

          <!-- 密码输入框 -->
          <i-input v-if="item.type == 'password'" type="password" :rows="item.rows == null ? 2 : item.rows" :placeholder="item.tip != null ? item.tip : ''" v-model="formData[item.prop]" :style="item.style" style="margin-bottom: 10px" :disabled="item.disabled == true ? true : false">
          </i-input>

          <!-- 时间或时间区间选择组件 -->
          <TimePicker v-if="item.type == 'time'" v-model="formData[item.prop]" :disabled="item.disabled == true ? true : false" placement="bottom-end" placeholder="请选择时间" :class="item.style?'':'input-size'" :style="item.style"></TimePicker>
          <TimePicker v-if="item.type == 'timeRange'" v-model="formData[item.prop]" :disabled="item.disabled == true ? true : false" type="timeRange" placement="bottom-end" placeholder="请选择时间范围" :class="item.style?'':'input-size'" :style="item.style"></TimePicker>

          <!-- 日期或日期区间选择组件 -->
          <DatePicker v-if="item.type == 'date'" v-model="formData[item.prop]" :disabled="item.disabled == true ? true : false" placement="bottom-end" placeholder="请选择日期" :class="item.style?'':'input-size'" :style="item.style"></DatePicker>
          <DatePicker v-if="item.type == 'dateRange'" v-model="formData[item.prop]" :disabled="item.disabled == true ? true : false" type="daterange" placement="bottom-end" placeholder="请选择日期范围" :class="item.style?'':'input-size'" :style="item.style"></DatePicker>

          <!-- 日期时间选择组件 -->
          <DatePicker type="datetime" v-if="item.type == 'datetime'" v-model="formData[item.prop]" :disabled="item.disabled == true ? true : false" placement="bottom-end" placeholder="请选择日期时间" :class="item.style?'':'input-size'" :style="item.style"></DatePicker>

          <!-- 选择组件 -->
          <Select v-if="item.type == 'select'" filterable clearable v-model="formData[item.prop]" :class="item.style?'':'input-size'" :style="item.style" :placeholder="item.tip != null ? item.tip : '请选择'" :disabled="item.disabled == true ? true : false" @on-change="handleSelectChange(item.selectChangeAction, formData[item.prop])">
            <Option v-for="(selectItem,selectIndex) in item.options" :key="selectIndex" :label="selectItem[item.selectLabel]?selectItem[item.selectLabel]:selectItem.name" :value="selectItem[item.selectValue]?selectItem[item.selectValue]+'':selectItem.id+''">
            </Option>
          </Select>

          <!-- 级联选择组件 -->
          <Cascader v-if="item.type == 'cascader'" filterable clearable :class="item.style?'':'input-size'" :style="item.style" :disabled="item.disabled == true ? true : false" :placeholder="item.tip != null ? item.tip : '请选择'" trigger="hover" :data="item.options" @on-change="handleCascaderSelectChange(item.selectChangeAction, formData[item.prop])" v-model="formData[item.prop]">
          </Cascader>

          <!-- 单选按钮组 -->
          <RadioGroup v-if="item.type == 'radioGroup'" v-model="formData[item.prop]" :vertical="item.vertical===true?true:false" :type="item.button===true?'button':null" :size="item.size" :disabled="item.disabled == true ? true : false">
            <Radio v-for="(radioItem, radioIndex) in item.options" :key="radioIndex" :disabled="item.disabled===true?true:false" :label="radioItem[item.radioLabel]?radioItem[item.radioLabel]:radioItem.id">
              <Icon v-if="this._.isNil(radioItem.icon)" :type="radioItem.icon" :color="radioItem.iconColor" :size="radioItem.iconSize"></Icon>
              <span>{{ radioItem[item.radioName]?radioItem[item.radioName]:radioItem.name }}</span>
            </Radio>
          </RadioGroup>

          <!-- 多选按钮组 -->
          <CheckboxGroup v-if="item.type == 'checkboxGroup'" v-model="formData[item.prop]" :vertical="item.vertical===true?true:false" :type="item.button===true?'button':null" :size="item.size" :disabled="item.disabled == true ? true : false">
            <Checkbox v-for="(checkboxItem, checkboxIndex) in item.options" :key="checkboxIndex" :disabled="item.disabled===true?true:false" :label="checkboxItem[item.checkboxLabel]?checkboxItem[item.checkboxLabel]:checkboxItem.id">{{ checkboxItem[item.checkboxName]?checkboxItem[item.checkboxName]:checkboxItem.name }}</Checkbox>
          </CheckboxGroup>

          <!-- 文件上传组件 -->
          <Upload v-if="item.type == 'upload'" :multiple="item.multiple===true?true:false" :with-credentials="true" :type="item.uploadType==='drag'?'drag':'select'" :action="item.actionUrl?item.actionUrl:''" :on-success="uploadSuccessHandle" :on-remove="uploadRemoveHandle" :on-error="uploadErrorHandle">
            <div style="padding: 20px 0" v-if="item.uploadType==='drag'">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>{{item.uploadText}}</p>
            </div>
            <Button v-else :type="item.buttonType?item.buttonType:'primary'" icon="ios-cloud-upload-outline">{{item.uploadText}}</Button>
          </Upload>

          <!-- 城市级联组件 -->
          <!-- <AlSelector v-if="item.type == 'alSelector'" v-model="formData[item.prop]" :level="item.level?item.level:1" :gutter="0" /> -->

          <!-- 表格附件上传 -->
          <LegaTable v-if="item.type == 'tableFileUpload'" :options="item.tableFileData" @uploadFileButtonClick="uploadFileButtonClick"></LegaTable>

          <!-- 开关按钮 -->
          <i-switch v-if="item.type == 'switch'" v-model="formData[item.prop]"></i-switch>

          <!-- 富文本：UEditor -->
          <!-- <vue-ueditor-wrap v-if="item.type == 'textEditor2'" :config="ueditorConfig" v-model="formData[item.prop]" :destroy="true"></vue-ueditor-wrap> -->

          <!-- <component v-if="item.type == 'textEditor2'" :is="currentViewComp" transition="fade" transition-mode="out-in"
            :config="ueditorConfig" v-model="formData[item.prop]" :destroy="true"></component> -->

        </FormItem>
        </i-col>
      </Row>
      <!-- <div class="split-line"></div> -->
    </Form>
  </i-col>
</Row>
</template>

<script>
// import AlSelector from '@/components/legaAreaLinkage/AlSelector.vue'
import LegaTable from '@/components/LegaTable.vue'
// import VueUeditorWrap from 'vue-ueditor-wrap'
export default {
  components: {
    LegaTable
  },
  props: {
    formItemData: {
      type: Array,
      default: function() {
        return []
      }
    },
    formData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    formRules: {
      type: Object,
      default: function() {
        return {}
      }
    },
    labelWidth: {
      type: Number,
      default: 120
    },
    isBigScreenCenter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentViewComp: null,
      cascaderSelectOption: []
      // ueditorConfig: {
      //   serverUrl: this.$config.ueditorServer,
      //   UEDITOR_HOME_URL: process.env.BASE_URL + 'ueditor1_4_3_3/'
      // }
    }
  },
  // mounted() {
  //   this.currentViewComp = VueUeditorWrap
  // },
  destroyed() {
    this.currentViewComp = null
  },
  methods: {
    // input blur事件
    inputBlurAction(blurAction) {
      this.$emit(blurAction)
    },
    // 表格附件上传按钮点击事件
    uploadFileButtonClick() {
      this.$emit('uploadFileButtonClick')
    },
    // 选择组件改变事件
    handleSelectChange(selectActionName, selectValue) {
      if (selectActionName) {
        this.$emit(selectActionName, selectValue)
      }
    },
    // 级联选择组件改变事件
    handleCascaderSelectChange(selectActionName, selectValue) {
      if (selectActionName) {
        this.$emit(selectActionName, this.cascaderSelectOption)
      }
    },
    // 获取span大小
    getSpanSize(rowItems) {
      // 向上取整
      return Math.ceil(24 / rowItems.length)
    },
    // 文本输入框按钮点击事件
    inputButtonClickHandle(buttonClick) {
      this.$emit(buttonClick)
    },
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

<style lang="less">
@import './legaForm.less';
</style>

<!--  -->
<template>
<div>
  <Form :model="formData" ref="form" :rules="formRules" :label-width="labelWidth" :label-position="labelPosition">
    <Row v-for="(rowItems,rowIndex) in formItemData" :key="rowIndex" type="flex" v-if="_.isArray(rowItems)">
      <i-Col :xs="24" :sm="24" :md="getSpanSize(rowItems)>8?getSpanSize(rowItems):8" :lg="getSpanSize(rowItems)" v-for="(item,index) in rowItems" :key="index">
        <FormItem v-if="!readOnly" :label="item.label" :prop="item.prop" :label-width="item.labelWidth||labelWidth">
          <!-- 输入框 -->
          <i-Input v-if="item.type == 'input'" :placeholder="item.tip || '请填写'" v-model="formData[item.prop]" :class="item.style|| 'input-size'" :style="item.style" :disabled="getDisabled(item)" @on-blur="item.blurAction?inputBlurAction(item.blurAction):null">
            <Button v-if="!_.isNil(item.prepend) && item.prepend.button===true" slot="prepend" :icon="item.prepend.buttonIcon" @click="inputButtonClickHandle(item.prepend.buttonClick)">
              <icon v-if="item.prepend.customIcon" :type="item.prepend.customIcon" :custom="item.prepend.customIcon" :size="item.prepend.iconSize || 12"></icon>
              {{getInputButtonName(item.prepend)}}
            </Button>
            <Button v-if="!_.isNil(item.append) && item.append.button===true" slot="append" :icon="item.append.buttonIcon" @click="inputButtonClickHandle(item.append.buttonClick)">
              <icon v-if="item.append.customIcon" :type="item.append.customIcon" :custom="item.append.customIcon" :size="item.append.iconSize || 12"></icon>
              {{getInputButtonName(item.append)}}
            </Button>
          </i-Input>

          <!-- 文本域 -->
          <i-Input v-if="item.type == 'textArea'" type="textarea" :rows="item.rows || 2 " :placeholder="item.tip || '请填写'" v-model="formData[item.prop]" @input="handleInputAction($event,item)" :style="item.style" style="margin-bottom: 10px" :disabled="getDisabled(item)">
          </i-Input>

          <!-- 密码输入框 -->
          <i-Input v-if="item.type == 'password'" type="password" :rows="item.rows || 2" :placeholder="item.tip || ''" v-model="formData[item.prop]" :style="item.style" style="margin-bottom: 10px" :disabled="getDisabled(item)"></i-Input>

          <InputNumber v-if="item.type == 'inputNumber'" :style="item.style" :formatter="_.isFunction(item.formatter)?item.formatter:(value)=>value" :max="item.max" :min="item.min" v-model="formData[item.prop]"></InputNumber>
          <!-- 时间或时间区间选择组件 -->
          <TimePicker v-if="item.type == 'time'" v-model="formData[item.prop]" :disabled="getDisabled(item)" placement="bottom-end" placeholder="请选择时间" :class="item.style || 'input-size'" :style="item.style"></TimePicker>
          <TimePicker v-if="item.type == 'timeRange'" v-model="formData[item.prop]" :disabled="getDisabled(item)" type="timeRange" placement="bottom-end" placeholder="请选择时间范围" :class="item.style || 'input-size'" :style="item.style"></TimePicker>

          <!-- 日期或日期区间选择组件 -->
          <DatePicker v-if="item.type == 'date'" v-model="formData[item.prop]" :disabled="getDisabled(item)" placement="bottom-end" placeholder="请选择日期" :class="item.style || 'input-size'" :style="item.style"></DatePicker>
          <DatePicker v-if="item.type == 'dateRange'" v-model="formData[item.prop]" :disabled="getDisabled(item)" type="daterange" :placement=" item.placement || 'bottom-end'" placeholder="请选择日期范围" :class="item.style || 'input-size'" :style="item.style"></DatePicker>

          <!-- 日期时间选择组件 -->
          <DatePicker type="datetime" v-if="item.type == 'datetime'" v-model="formData[item.prop]" :disabled="getDisabled(item)" placement="bottom-end" placeholder="请选择日期时间" :class="item.style || 'input-size'" :style="item.style"></DatePicker>
          <!-- 选择组件 -->
          <Select v-if="item.type == 'select'" @on-change="handleSelectChangeAction($event,item)" filterable clearable v-model="formData[item.prop]" :class="item.style||''" :style="item.style" :placeholder="item.tip != null ? item.tip : '请选择'" :disabled="getDisabled(item)">
              <Option v-for="(selectItem,selectIndex) in getSelectOptions(item)" :key="selectIndex" :label="selectItem[item['keyField']|| 'key' ] || selectItem.name" :value="selectItem[item['valueField'] || 'value'] || `${selectItem.id}`">
              </Option>
            </Select>

          <!-- 级联选择组件 -->
          <Cascader v-if="item.type == 'cascader'" filterable clearable :class="item.style || 'input-size'" :style="item.style" :disabled="getDisabled(item)" :placeholder="item.tip ||  '请选择'" :data="getSelectOptions(item)" @on-change="handleCascaderSelectChange(item.selectChangeAction, formData[item.prop])" v-model="formData[item.prop]" :load-data="item.loadData" change-on-select>
          </Cascader>

          <!-- 单选按钮组 -->
          <RadioGroup v-if="item.type == 'radioGroup'" v-model="formData[item.prop]" :vertical="item.vertical || false" :type="item.button===true?'button':null" :size="item.size" :disabled="getDisabled(item)">
            <Radio v-for="(radioItem, radioIndex) in getSelectOptions(item)" :key="radioIndex" :disabled="getDisabled(item)" :label="radioItem[item.radioLabel]?radioItem[item.radioLabel]:radioItem.id">
              <Icon :type="radioItem.icon" :custom="radioItem.icon" :color="radioItem.iconColor" :size="radioItem.iconSize"></Icon>
              <span>{{ radioItem[item.radioName]?radioItem[item.radioName]:radioItem.name }}</span>
            </Radio>
          </RadioGroup>

          <!-- 多选按钮组 -->
          <CheckboxGroup v-if="item.type == 'checkboxGroup'" v-model="formData[item.prop]" :vertical="item.vertical || false" :type="item.button===true?'button':null" :size="item.size" :disabled="getDisabled(item)">
            <Checkbox v-for="(selectItem, checkboxIndex) in getSelectOptions(item)" :key="checkboxIndex" :disabled="getDisabled(selectItem)" :label="selectItem[item['valueField']|| 'value' ] ">{{ selectItem[item['keyField'] || 'key'] || `${selectItem.id}` }}</Checkbox>
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
          <al-selector v-if="item.type == 'alSelector'" v-model="formData[item.prop]"  @input="handleInputAction($event,item)" :level="item.level || 1" :gutter="0" :disabled="item.disabled || []" />

          <!-- 表格附件上传 -->
          <!-- <LegaTable v-if="item.type == 'tableFileUpload'" :options="item.tableFileData" @uploadFileButtonClick="uploadFileButtonClick"></LegaTable> -->

          <!-- 开关按钮 -->
          <i-switch v-if="item.type == 'switch'" v-model="formData[item.prop]" :disabled="item.disabled" :size="getOptions(item).size ">
              <span slot="open">{{getOptions(item).openText||""}}</span>
              <span slot="close">{{getOptions(item).closeText||""}}</span>
          </i-switch>

          <i v-if="item.type ==='dynamic-modal'" @click="handleClear(item)" :class="['ivu-icon', 'ivu-icon-ios-close', 'ivu-input-icon','ivu-input-icon-normal',{'ivu-input-icon-clear':_.isEmpty(formData[item.textField || item.idField || item.prop])}]"></i>
          <input v-if="item.type ==='dynamic-modal'" :clearable="true" @click="handleDynamicModalShow(item)" :class="['ivu-input', 'ivu-input-default', 'ivu-input-disabled']" style='cursor:pointer' :placeholder="item.placeholder" :readonly="true" :value="formData[item.textField || item.idField || item.prop] || ''" />
          <!-- 富文本：UEditor -->
          <!-- <vue-ueditor-wrap v-if="item.type == 'textEditor2'" :config="ueditorConfig" v-model="formData[item.prop]" :destroy="true"></vue-ueditor-wrap> -->
          <!--
         <component v-if="item.type == 'textEditor2'" :is="currentViewComp" transition="fade" transition-mode="out-in" :config="ueditorConfig" v-model="formData[item.prop]" :destroy="true"></component>
        -->
        </FormItem>
        <div v-else style="margin-bottom:15px">
          <Icon  v-if="!_.isNil((item.onlyRead || {}).icon)" :color ="(item.onlyRead || {}).icon.color" :type="(item.onlyRead || {}).icon.type" :custom="(item.onlyRead || {}).icon.custom" :size="(item.onlyRead || {}).icon.size" /> <span style="font-weight: bold;font-size:16px"> {{item.label}}：</span> {{readOnlyTextformatter(item)}}
        </div>
      </i-Col>
    </Row>
    <Divider v-else :orientation="rowItems.orientation || 'center'" :dashed="rowItems.dashed || false">{{rowItems.name}}</Divider>
  </Form>
</div>
</template>

<script>
import {
  formMixin
} from '@/mixin/form-mixin'
import {
  DynamicModal
} from '@/utils/modalUtil'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'LeagForm',
  mixins: [formMixin],
  props: {
    // 只读
    readOnly: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    /** 表单项 配置 */
    formItemData: {
      type: Array,
      default: function () {
        return []
      }
    },
    /** 表单规则 */
    formRules: {
      type: Object,
      default: function () {
        return {}
      }
    },
    labelWidth: {
      type: Number,
      default: 80
    },
    labelPosition: {
      type: String,
      default: 'right'
    }
  },
  components: {},
  data() {
    return {
      formData: {},
      /** 动态弹窗 */
      dynamicModals: {}
    }
  },
  methods: {
    getDisabled(rowItem) {
      if (this._.isBoolean(rowItem.disabled)) {
        return rowItem.disabled
      }
      if (this._.isFunction(rowItem.disabled)) {
        return rowItem.disabled(rowItem)
      }
      return false
    },
    getOptions(item) {
      if (item && 'options' in item) {
        return item.options || {}
      }
      return {}
    },
    handleInputAction: function () {
      let value = arguments[0]
      let item = arguments[1]
      if (!this._.isNil(item.onInput) && this._.isFunction(item.onInput)) {
        item.onInput(value)
      }
    },
    handleSelectChangeAction: function () {
      let value = arguments[0]
      let item = arguments[1]
      if (!this._.isNil(item.onChange) && this._.isFunction(item.onChange)) {
        item.onChange(value)
      }
    },
    /** 格式化显示文本 */
    readOnlyTextformatter: function (item) {
      if (this._.isFunction((item.onlyRead || {}).r)) {
        return (item.onlyRead || {}).r(this.formData)
      }
      console.log(item.onlyRead)

      if ((item.onlyRead || {}).r === 'dictFormatter') {
        return this.dictFormatter(item['dictGroup'], this.formData[item.prop])
      }
      return this.formData[item.prop] || ''
    },
    /** 获取动态弹窗 */
    getDynamicModalByKey(key) {
      return this.dynamicModals[key] || {}
    },
    /** 清除 */
    handleClear: function (item) {
      const vm = this
      vm.formData[item.textField || item.idField || item.prop] = undefined
      if (vm._.isFunction(item.handleClear)) {
        item.handleClear()
      }
    },
    /**  打开动态表单 */
    handleDynamicModalShow: function (item) {
      this.dynamicModals[item.textField || item.idField || item.prop] = DynamicModal.newInstance(item.options || {}, this)
      this.dynamicModals[item.textField || item.idField || item.prop].show()
    },
    /** 获取表单数据 */
    getFormDatas: function () {
      return JSON.parse(JSON.stringify(this.formData || {}))
    },
    /** 设置表单数据 */
    setFormDatas: function (formData = {}) {
      this.formData = formData
    },
    /** 设置字段值 */
    setFormFieldData(field, value) {
      this.$set(this.formData, field, value)
    },
    setFormFieldsData(fieldsData = {}) {
      for (let field in fieldsData) {
        this.$set(this.formData, field, fieldsData[field])
      }
    },
    getSelectOptions(rowItem) {
      if (this._.isArray(rowItem.options) && rowItem.options.length > 0) {
        return rowItem.options
      }
      if (this._.isFunction(rowItem.r)) {
        let _options = rowItem.r(rowItem)
        if (!this._.isNil(_options) && this._.isArray(_options)) {
          return _options
        }
        return []
      }
    },
    getInputButtonName(rowItem) {
      if (this._.isString(rowItem.buttonName)) {
        return rowItem.buttonName
      }
      if (this._.isFunction(rowItem.buttonName)) {
        return rowItem.buttonName(rowItem)
      }
      return ''
    },
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
  },
  mounted: function () {},
  computed: {
    ...mapGetters([
      'elements',
      'hasElementsPerimByKey',
      'dictDatasWithGroupKey',
      'dictFormatter'
    ])
  }
}
</script>

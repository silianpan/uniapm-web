<!--
  搜索组件
-->
<template>
<div>
  <div v-if="currentShowItems.length>0">
    <Row :gutter="5">
      <Form ref="formData" :model="formData" :label-width="options.labelWidth || 80">
        <i-Col :xs="24" :sm="24" :md="8" :lg="6" v-for="(item, index) in currentShowItems" :key="index">
          <FormItem :label="item.label" :prop="item.prop">
            <!-- 输入框 -->
            <i-Input v-if="item.type === 'input'" :placeholder="item.tip != null ? item.tip : '请填写'" v-model="formData[item.prop]" :class="item.style?'':'input-size'" :style="item.style" :disabled="item.disabled || false" @on-blur="item.blurAction?inputBlurAction(item.blurAction):null">
            </i-Input>
            <!-- 时间或时间区间选择组件 -->
            <TimePicker v-if="item.type === 'time'" v-model="formData[item.prop]" :disabled="item.disabled || false" placement="bottom-end" placeholder="请选择时间" :class="item.style?'':'input-size'" :style="item.style"></TimePicker>
            <TimePicker v-if="item.type ==='timeRange'" v-model="formData[item.prop]" :disabled="item.disabled || false" type="timeRange" placement="bottom-end" placeholder="请选择时间范围" :class="item.style?'':'input-size'" :style="item.style"></TimePicker>
            <!-- 日期或日期区间选择组件 -->
            <DatePicker v-if="item.type == 'date'" v-model="formData[item.prop]" :disabled="item.disabled || false" placement="bottom-end" placeholder="请选择日期" :class="item.style?'':'input-size'" :style="item.style"></DatePicker>
            <DatePicker v-if="item.type == 'dateRange'" v-model="formData[item.prop]" :disabled="item.disabled || false" type='daterange' :placement="item.placement || 'bottom-end'" placeholder="请选择日期范围" :class="item.style?'':'input-size'" :style="item.style"></DatePicker>
            <!-- 日期时间选择组件 -->
            <DatePicker type="datetime" v-if="item.type == 'datetime'" v-model="formData[item.prop]" :disabled="item.disabled || false" placement="bottom-end" placeholder="请选择日期时间" :class="item.style || 'input-size'" :style="item.style"></DatePicker>
            <!-- 选择组件 -->
            <Select v-if="item.type == 'select'" filterable clearable v-model="formData[item.prop]"  :class="item.style||''" :style="item.style" :placeholder="item.tip != null ? item.tip : '请选择'" :disabled="item.disabled || false">
              <Option v-for="(selectItem,selectIndex) in getSelectOptions(item)" :key="selectIndex" :label="selectItem[item['keyField']|| 'key' ] || selectItem.name" :value="selectItem[item['valueField'] || 'value'] || `${selectItem.id}`">
              </Option>
            </Select>
            <!-- 级联选择组件 -->
            <Cascader v-if="item.type == 'cascader'" filterable clearable :class="item.style || 'input-size'" :style="item.style" :disabled="item.disabled || false" :placeholder="item.tip != null ? item.tip : '请选择'" trigger="hover" :data="item.options" @on-change="handleCascaderSelectChange(item.selectChangeAction)" v-model="formData[item.prop]">
            </Cascader>

            <!-- 单选按钮组 -->
            <RadioGroup v-if="item.type == 'radioGroup'" v-model="formData[item.prop]" :vertical="item.vertical===true?true:false" :type="item.button===true?'button':null" :size="item.size" :disabled="item.disabled || false">
              <Radio v-for="(radioItem, radioIndex) in item.options" :key="radioIndex" :disabled="item.disabled===true?true:false" :label="radioItem[item.radioLabel]?radioItem[item.radioLabel]:radioItem.id">
                <Icon :type="radioItem.icon" :custom="radioItem.icon" :color="radioItem.iconColor" :size="radioItem.iconSize"></Icon>
                <span>{{ radioItem[item.radioName]?radioItem[item.radioName]:radioItem.name }}</span>
              </Radio>
            </RadioGroup>

            <!-- 多选按钮组 -->
            <CheckboxGroup v-if="item.type == 'checkboxGroup'" v-model="formData[item.prop]" :vertical="item.vertical===true?true:false" :type="item.button===true?'button':null" :size="item.size" :disabled="item.disabled || false">
              <Checkbox v-for="(checkboxItem, checkboxIndex) in item.options" :key="checkboxIndex" :disabled="item.disabled===true?true:false" :label="checkboxItem[item.checkboxLabel]?checkboxItem[item.checkboxLabel]:checkboxItem.id">{{ checkboxItem[item.checkboxName]?checkboxItem[item.checkboxName]:checkboxItem.name }}</Checkbox>
            </CheckboxGroup>
            <!-- 城市级联组件 -->
            <!-- <AlSelector v-if="item.type == 'alSelector'" v-model="formData[item.prop]" :level="item.level?item.level:1" :gutter="0" /> -->
            <!-- 开关按钮 -->
            <i-switch v-if="item.type == 'switch'" v-model="formData[item.prop]"></i-switch>
          </FormItem>
        </i-Col>

        <i-Col :xs="currentShowItems.length%4 !==0?24:0" :sm="currentShowItems.length%4 !==0?24:0" :md="currentShowItems.length%4 !==0?8:0" :lg="currentShowItems.length%4 !==0?6:0">
          <Button type="primary" :loading="searchBtn.loading"  @click="handleSearchAction" style="margin-right:5px">
                  <Icon type="md-search" size="16" />
                  <span v-if="!searchBtn.loading">搜索</span>
                  <span v-else>Loading...</span>
              </Button>
          <Button type="primary" @click="handleResetAction" style="margin-right:5px">
                  <Icon type="md-refresh" size="16" />
                  <span >重置</span>
              </Button>
          <a v-if="!expand && currentShowItems.length< allItems.length" @click="handleExpandClick" style="margin-left: 8px;">展开
                <i class="anticon anticon-down"><svg viewBox="64 64 896 896" class="" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path></svg></i>
              </a>
          <a v-if="expand" @click="handleCollapseClick" style="margin-left: 8px;">收起 <i class="anticon anticon-up"><svg viewBox="64 64 896 896" class="" data-icon="up" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3A8 8 0 0 0 140 768h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z"></path></svg></i></a>
        </i-Col>
      </Form>
    </Row>
    <div v-if="currentShowItems.length%4==0" style="overflow: hidden;">
      <div style="float: right; margin-bottom: 24px;">
        <Button type="primary" :loading="searchBtn.loading"  @click="handleSearchAction" style="margin-right:5px">
                  <Icon type="md-search" size="16" />
                  <span v-if="!searchBtn.loading">搜索</span>
                  <span v-else>Loading...</span>
              </Button>
        <Button type="primary" @click="handleResetAction" style="margin-right:5px">
                  <Icon type="md-refresh" size="16" />
                  <span >重置</span>
              </Button>
        <a v-if="!expand && currentShowItems.length< allItems.length" @click="handleExpandClick" style="margin-left: 8px;">展开
                <i class="anticon anticon-down"><svg viewBox="64 64 896 896" class="" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path></svg></i>
              </a>
        <a v-if="expand" @click="handleCollapseClick" style="margin-left: 8px;">收起 <i class="anticon anticon-up"><svg viewBox="64 64 896 896" class="" data-icon="up" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3A8 8 0 0 0 140 768h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z"></path></svg></i></a>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
export default {
  name: 'LeagSearchForm',
  props: {
    options: {
      type: Object,
      default: function () {
        return {
          hiddenItems: [],
          showColumns: [],
          labelWidth: 90
        }
      }
    }
  },
  components: {},
  data() {
    return {
      currentShowItems: [],
      hiddenItems: [],
      showItems: [],
      /** 搜索按钮 */
      searchBtn: {
        loading: false
      },
      /** 是否是 展开状态 */
      expand: false,

      /** 表单 */
      formData: {

      }
    }
  },
  methods: {
    /** 搜索按钮点击  */
    handleSearchAction: function () {
      console.log(this.getFormData())
      this.$emit('on-search-action', this.getFormData(), this.getFieldQueryType())
    },
    getFieldQueryType: function () {
      const vm = this
      let fieldQueryType = {}
      vm.currentShowItems.map((item) => {
        if (!vm._.isNil(vm.formData[item.prop])) {
          if (item.type === 'select') {
            fieldQueryType[item.prop] = item.queryType || 'eq'
          } else {
            fieldQueryType[item.prop] = item.queryType || 'like'
          }
        }
      })
      return fieldQueryType
    },
    /** 重置按钮点击  */
    handleResetAction: function () {
      const vm = this
      let _formData = {}
      vm.allItems.map((item) => {
        _formData[item.prop] = undefined
      })
      // vm.$set(vm.formData, _formData)
      vm.formData = _formData
      this.$emit('on-reset-action')
    },
    /** 展开更多按钮点击  */
    handleExpandClick: function () {
      const vm = this
      vm.expand = true
      vm.currentShowItems = vm.allItems
    },
    /** 收起按钮点击 */
    handleCollapseClick: function () {
      const vm = this
      vm.expand = false
      vm.currentShowItems = [...vm.showItems]
    },
    /** 获取表单数据 */
    getFormData: function () {
      const vm = this
      let _data = {}
      vm.currentShowItems.map((item) => {
        if (
          !vm._.isNil(vm.formData[item.prop]) &&
          vm.formData[item.prop] !== ''
        ) {
          _data[item.prop] = vm.formData[item.prop]
        }
      })
      return _data
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
    init() {
      const vm = this
      let {
        hiddenItems,
        showItems
      } = this.options
      vm.showItems = showItems
      vm.hiddenItems = hiddenItems
      vm.currentShowItems = showItems
    }
  },
  watch: {
    options: {
      handler: function (newOptions, oldOptions) {
        if (this._.isNil(this.options) || this._.eq(newOptions, oldOptions)) {
          return
        }
        this.init()
      },
      deep: true
    }
  },
  mounted: function () {
    this.init()
  },
  computed: {
    ...mapGetters(['elements', 'hasElementsPerimByKey', 'dictDatasWithGroupKey', 'dictFormatter']),
    allItems() {
      const vm = this
      return [...vm.showItems, ...vm.hiddenItems]
    }
  }
}
</script>

<style  scoped>
</style>

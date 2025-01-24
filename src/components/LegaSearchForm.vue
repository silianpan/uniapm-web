<template>
  <Form :model="formData" ref="formData" :label-width="labelWidth" label-position="right">
    <Row v-for="(rowItems,rowIndex) in formItemData" :key="rowIndex" type="flex">
      <!-- <Col :span="12"></Col> -->
      <Col :span="getSpanSize(rowItems)" v-for="(item,index) in rowItems" :key="index">
      <FormItem :label="item.label" :prop="item.prop">
        <!-- 输入框 -->
        <Input v-if="item.type == 'input'" :size="item.size?item.size:'small'" :placeholder="item.tip != null ? item.tip : ''" v-model="formData[item.prop]" class="search-form-input-size">
        </Input>

        <!-- 文本域 -->
        <Input v-if="item.type == 'textArea'" type="textarea" :rows="item.rows == null ? 2 : item.rows" :placeholder="item.tip != null ? item.tip : ''" v-model="formData[item.prop]" style="margin-bottom: 10px">
        </Input>

        <!-- 时间或时间区间选择组件 -->
        <TimePicker v-if="item.type == 'time'" v-model="formData[item.prop]" :disabled="item.disabled == true ? true : false" placement="bottom-end" placeholder="请选择时间" class="search-form-input-size"></TimePicker>
        <TimePicker v-if="item.type == 'timeRange'" v-model="formData[item.prop]" :disabled="item.disabled == true ? true : false" type="timeRange" placement="bottom-end" placeholder="请选择时间范围" class="search-form-input-size"></TimePicker>

        <!-- 日期或日期区间选择组件 -->
        <DatePicker v-if="item.type == 'date'" v-model="formData[item.prop]" :disabled="item.disabled == true ? true : false" placement="bottom-end" placeholder="请选择日期" class="search-form-input-size"></DatePicker>
        <DatePicker v-if="item.type == 'dateRange'" v-model="formData[item.prop]" :disabled="item.disabled == true ? true : false" type="daterange" placement="bottom-end" placeholder="请选择日期范围" class="search-form-input-size"></DatePicker>

        <!-- 选择组件 -->
        <Select v-if="item.type == 'select'" filterable clearable v-model="formData[item.prop]" size="small" :class="item.style?'':'search-form-input-size'" :style="item.style" :placeholder="item.tip != null ? item.tip : '请选择'" :disabled="item.disabled == true ? true : false">
          <Option v-for="(selectItem,selectIndex) in getSelectOptions(item)" :key="selectIndex" :label="selectItem[item['keyField'] || 'key' ] || selectItem.name" :value="selectItem[item['valueField']|| 'value'] || selectItem.id+''">
          </Option>
        </Select>
      </FormItem>
      </Col>
    </Row>
    <div class="split-line"></div>
    <Row class="but-pos">
      <Button type="primary" size="small" @click="handleFormSearch">搜索</Button>
      <Button type="warning" size="small" @click="handleFormReset">重置</Button>
      <Button size="small" @click="handleFormCancel">取消</Button>
    </Row>
  </Form>
</template>

<script>
export default {
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
    labelWidth: {
      type: Number,
      default: 100
    }
  },
  methods: {
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
    // 获取span大小
    getSpanSize(rowItems) {
      // 向上取整
      return Math.ceil(24 / rowItems.length)
    },
    handleFormSearch() {
      this.$emit('handleFormSearch', this.formData)
    },
    handleFormReset() {
      for (let key in this.formData) {
        this.formData[key] = ''
      }
    },
    handleFormCancel() {
      this.$emit('handleFormCancel', false)
    }
  }
}
</script>

<style lang="less">
@import './legaForm.less';
</style>

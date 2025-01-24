<!-- word表格展示 -->
<template>
  <Form class="word-view-child" :model="formData" ref="formData" :label-width="labelWidth">
    <Row v-for="(rowItems,rowIndex) in formItemData" :key="rowIndex" type="flex">
      <i-col :span="getSpanSize(rowItems,item)" v-for="(item,index) in rowItems" :key="index" :class="item.type === 'title'?'title':''">
        <span v-if="item.type === 'title'" :style="item.textStyle">{{ item.label }}</span>
        <FormItem v-else :prop="item.prop" class="word-view-child-form-item" :label-width="item.labelWidth">
          <span slot="label" :style="item.lineHeight?'line-height:' + item.lineHeight:item.children?'line-height:' + 28*item.children.length +'px':''" class="word-view-child-label">
            {{ item.label }}
          </span>
          <lega-word-view-child v-if="item.children" :formItemData="item.children" :formData="formData"></lega-word-view-child>
          <template v-if="item.render && _.isFunction(item.render)">
            <LegaCell :value="formData" :render="item.render"  ></LegaCell>
          </template>
          <span v-else-if="item.display === 'html'" v-html="formatter(formData[item.prop], formData, item.formatter)">
          </span>
          <span v-else :class="item.getTextClass !== null && typeof(item.getTextClass) === 'function'?item.getTextClass(formData[item.prop], formData):''" :style="item.textStyle">
            {{formatter(formData[item.prop], formData, item.formatter)}}
          </span>
        </FormItem>
      </i-col>
    </Row>
  </Form>
</template>

<script>
import LegaWordViewChild from '@/components/LegaWordViewChild'
import LegaCell from '@/components/base/LegaCell.js'
export default {
  name: 'lega-word-view-child',
  components: {
    'lega-word-view-child': LegaWordViewChild,
    LegaCell
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
    labelWidth: {
      type: Number,
      default: 100
    }
  },
  methods: {
    // 获取span大小
    getSpanSize(rowItems, item) {
      // 先判断item.span是否存在
      // 再判断item.span是否是数组，如果是，自适应布局，否则，普通布局
      if (!this._.isNil(item) && !this._.isNil(item.span)) {
        return item.span
      }
      // 向上取整
      return Math.ceil(24 / rowItems.length)
    },
    // 格式化字段显示
    formatter(value, formData, formatterFunc) {
      if (typeof formatterFunc === 'function') {
        return formatterFunc(value, formData)
      }
      return value
    }
  }
}
</script>

<style lang="less">
.word-view-child-label {
  font-size: 14px !important;
}
.word-view-child
  .ivu-row-flex
  .ivu-col:not(:first-child)
  > .word-view-child-form-item {
  border-left: 1px solid #ccc;
}
</style>

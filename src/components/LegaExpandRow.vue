<!-- 展开行组件 -->
<template>
  <Form class="expand-row-form" :model="formData" ref="formData" :label-width="labelWidth" label-position="right">
    <Row v-for="(rowItems,rowIndex) in formItemData" :key="rowIndex" type="flex">
      <i-col :span="getSpanSize(rowItems)" v-for="(item,index) in rowItems" :key="index">
        <FormItem v-if="item.linkClick" :label="item.label">
          <span class="link-click" @click="linkClick(item.linkClick, formData)">链接</span>
        </FormItem>
        <FormItem v-else :label="item.label" :prop="item.prop">
          <span :class="item.getTextClass !== null && typeof(item.getTextClass) === 'function'?item.getTextClass(formData[item.prop], formData):''" :style="item.textStyle">
            {{formatter(formData[item.prop], formData, item.formatter)}}
          </span>
        </FormItem>
      </i-col>
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
    // 获取span大小
    getSpanSize(rowItems) {
      // 向上取整
      return Math.ceil(24 / rowItems.length)
    },
    // 格式化字段显示
    formatter(value, formData, formatterFunc) {
      if (typeof formatterFunc === 'function') {
        return formatterFunc(value, formData)
      }
      return value
    },
    linkClick(linkClick, formData) {
      this.$emit(linkClick, formData)
    }
  }
}
</script>

<style lang="less">
.expand-row-form {
  padding: 10px 0 0 10px;
  .ivu-form-item {
    margin-bottom: 0;
    label {
      font-size: 1.2em;
    }
    .ivu-form-item-content span {
      font-size: 1.2em;
      color:#303133;
      border-bottom: 1px solid #909399;
    }
  }
  .link-click {
    color: #409EFF;
    cursor: pointer;
  }
}
</style>

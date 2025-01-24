<!--
grid body
 -->
<template>
<table cellspacing="0" cellpadding="0" border="0" :style="styleObject">
  <colgroup>
    <col v-for="(column, index) in columns" :width="setCellWidth(column)" :key="index">
  </colgroup>
  <tbody :class="[prefixCls + '-tbody']">
    <template v-for="(row) in objData">
      <grid-tr v-show="isShow(row)" :row="row" :key="row._rowKey" :prefix-cls="prefixCls" @mouseenter.native.stop="handleMouseIn(row)" @mouseleave.native.stop="handleMouseOut(row)" @click.native="clickCurrentRow(row)" @dblclick.native.stop="dblclickCurrentRow(row)">
        <td v-for="(column ,cindex ) in columns" :class="alignCls(column, row)" :key="cindex">
          <grid-cell :prefix-cls="prefixCls" :row="row" :key="column._columnKey" :column="column" :natural-index="cindex" :row-key="row._rowKey" :checked="rowChecked(row._rowKey)" :disabled="rowDisabled(row._rowKey)" :expanded="rowExpanded(row)"></grid-cell>
        </td>
      </grid-tr>
    </template>
  </tbody>
</table>
</template>

<script>
import GridTr from './grid-tr.vue'
import GridCell from './grid-cell.vue'
import Mixin from './mixin'
export default {
  mixins: [ Mixin ],
  props: {
    // class 前缀
    prefixCls: String,
    // style object
    styleObject: Object,
    // 所有的columns
    columns: Array,
    // 所有的数据
    objData: Array,
    columnsWidth: Object,
    fixed: {
      type: [Boolean, String],
      default: false
    }
  },
  components: {
    GridTr,
    GridCell
  },
  data() {
    return {}
  },
  methods: {
    isShow(row) {
      return row && row._isShow
    },
    // 某一行 被选中
    rowChecked (row) {
      return row && row._isChecked
    },
    // 是否禁用某一行
    rowDisabled(row) {
      return row && row._isDisabled
    },
    // 某一行是否 展开
    rowExpanded(row) {
      return row && row._isExpanded
    },
    // 鼠标移动进来时
    handleMouseIn (row) {
      this.$parent.handleMouseIn(row)
    },
    // 鼠标移出时
    handleMouseOut (row) {
      this.$parent.handleMouseOut(row)
    },
    // 点击当前行
    clickCurrentRow (row) {
      this.$parent.clickCurrentRow(row)
    },
    // 双击当前行
    dblclickCurrentRow (row) {
      this.$parent.dblclickCurrentRow(row)
    }
  },
  mounted: function () {},
  computed: {

  }
}
</script>

<style  scoped>
</style>

<!--
  grid 单元格
 -->
<template>
<div :class="classes" ref="cell">
  <!-- 有下标 -->
  <template v-if="renderType === 'index'"><span>{{ cellContent }}</span></template>
  <!-- 如果单元格 渲染类型 是可选择 则渲染 checkbox -->
  <template v-if="renderType === 'selection'">
    <Checkbox :value="checked" @click.native.stop="handleClick" @on-change="toggleSelect" :disabled="disabled"></Checkbox>
  </template>
  <!-- 普通类型的 渲染类型 -->
  <template v-if="renderType === 'normal'">
    <template v-if="column.tooltip">
      <Tooltip transfer :content="cellContent" :disabled="!showTooltip" :max-width="300" class="ivu-table-cell-tooltip">
        <span ref="content" @mouseenter="handleTooltipIn" @mouseleave="handleTooltipOut" class="ivu-table-cell-tooltip-content">{{ row[column.key] }}</span>
      </Tooltip>
    </template>
    <span v-else>{{cellContent}}</span>
  </template>
  <!-- 如果 渲染类型 是 tree -->
  <template v-if="renderType === 'tree'">
    <div :class="expandCls" @click="toggleExpand">
      <!-- 根据当前row的 level 显示 空格数 -->
      <i v-for="(item, index) in (row._level-1)" :key="index" class="ivu-icon cell-space"></i>
      <!-- 图标 -->
      <Icon v-if="showTaggleIcon"  type="ios-arrow-forward"></Icon>
      <Icon v-else-if="showLoading" type="ios-loading" class="ivu-load-loop"></Icon>
      <i v-else class=" ivu-icon cell-space "/>
      <!-- 一个空格 -->
      <i class="ivu-icon cell-space "/>
      <template v-if="column.tooltip">
        <Tooltip transfer :content="cellContent" :disabled="!showTooltip" :max-width="300" class="ivu-table-cell-tooltip">
          <span ref="content" @mouseenter="handleTooltipIn" @mouseleave="handleTooltipOut" class="ivu-table-cell-tooltip-content">{{ row[column.key] }}</span>
        </Tooltip>
      </template>
      <span  v-else-if="column.render" style=" -webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;vertical-align: middle;">
        <Cell :row="row" :column="column" :row-key="rowKey" :render="column.render"></Cell>
      </span>
      <span v-else>{{cellContent}}</span>
    </div>
  </template>
  <Cell v-if="renderType === 'render'" :row="row" :column="column" :row-key="rowKey" :render="column.render"></Cell>
</div>
</template>

<script>
import {
  deepCopy
} from './utils.js'
import Cell from './CellRender'
export default {
  name: 'GridCell',
  props: {
    // 样式前缀
    prefixCls: String,
    // 当前row
    row: Object,
    // 当前column
    column: Object,
    // 索引
    naturalIndex: Number, // index of rebuildData
    // 数据下标
    rowKey: String, // _index of data
    // 是否 被选中
    checked: Boolean,
    // 是否 禁止被选中
    disabled: Boolean,
    // 是否展开
    expanded: Boolean

  },
  components: {
    Cell
  },
  data() {
    return {
      renderType: '',
      showTooltip: false // 鼠标滑过overflow文本时，再检查是否需要显示
    }
  },
  created() {
    // index | selection |   html | render | normal
    if (this.column.render && this.column.type !== 'tree') {
      this.renderType = 'render'
    } else {
      this.renderType = this.column.type || 'normal'
    }
  },
  methods: {
    /** checkbox 选中 与非选中 切换时 */
    toggleSelect () {
      // 找到 grid 层 的组件 调用 toggleSelect
      this.$parent.$parent.$parent.toggleSelect(this.row)
    },
    /** 展开 子grid时 */
    toggleExpand () {
      if (this.showTaggleIcon) {
        this.$parent.$parent.$parent.toggleExpand(this.row)
      }
    },
    /** 判断 */
    // showTaggleIcon() {
    //   debugger
    // },
    handleClick () {
      // 放置 Checkbox 冒泡
    },
    /** 当鼠标移动到该div时 显示tooltip */
    handleTooltipIn () {
      const $content = this.$refs.content
      this.showTooltip = $content.scrollWidth > $content.offsetWidth
    },
    /** 当鼠标移出到该div时 隐藏tooltip */
    handleTooltipOut () {
      this.showTooltip = false
    }
  },
  mounted: function () {},
  computed: {
    showTaggleIcon() {
      if (this.row && this._.isFunction(this.row.showTaggle)) {
        return this.row.showTaggle(JSON.parse(JSON.stringify(this.row))) && !this.showLoading
      }
      if (this.column && this._.isFunction(this.column.showTaggle)) {
        return this.column.showTaggle(JSON.parse(JSON.stringify(this.row))) && !this.showLoading
      }
      return this.row && 'children' in this.row && this.row.children.length > 0 && !this.showLoading
    },
    showLoading() {
      return '_loading' in this.row && this.row._loading
    },
    /** 作为 非 jsx 语法的 渲染函数 的内容 */
    cellContent() {
      if (this._.isFunction(this.column.r)) {
        let params = {
          row: deepCopy(this.row),
          column: this.column
        }
        return this.column.r(params)
      }
      if (this.renderType === 'index') {
        return (naturalIndex + 1)
      }
      return this.row[this.column.key]
    },
    /** 单元格 样式 */
    classes() {
      return [
        `${this.prefixCls}-cell`,
        {
          [`${this.prefixCls}-cell-ellipsis`]: this.column.ellipsis || false,
          [`${this.prefixCls}-cell-with-selection`]: this.renderType === 'selection'
        }
      ]
    },
    expandCls() {
      return [
        `${this.prefixCls}-cell-expand`,
        {
          [`tree-grid-arrow-open`]: this.expanded
        }
      ]
    }
  }
}
</script>

<style  scoped>
.cell-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 14px;
  height: 14px;
}
.cell-space::before {
  content: '';
}

.tree-grid-arrow-open i {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
</style>

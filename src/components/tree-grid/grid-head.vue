<!--
 表格header 主要是 全选和 排序
 -->

<template>
    <table cellspacing="0" cellpadding="0" border="0" :style="styles">
        <colgroup>
            <col v-for="(column, index) in columns" :width="setCellWidth(column)" :key="index">
            <col v-if="$parent.showVerticalScrollBar" :width="$parent.scrollBarWidth"/>
        </colgroup>
        <thead>
            <tr v-for="(cols,cIndex, rowIndex) in headRows" :key="cIndex">
                <th
                    v-for="(column, index) in cols"
                    :key="index"
                    :colspan="column.colSpan"
                    :rowspan="column.rowSpan"
                    :class="alignCls(column)">
                    <div :class="cellClasses(column)">
                        <template v-if="column.type === 'expand'">
                            <span v-if="!column.renderHeader">{{ column.title || '' }}</span>
                            <render-header v-else :render="column.renderHeader" :column="column" :index="index"></render-header>
                        </template>
                        <template v-else-if="column.type === 'selection'">
                          <Checkbox :value="isSelectAll" :disabled="!objData.length" @on-change="selectAll"></Checkbox>
                        </template>
                        <template v-else>
                            <span v-if="!column.renderHeader" :class="{[prefixCls + '-cell-sort']: column.sortable}" @click="handleSortByHead(getColumn(rowIndex, index)._index)">{{ column.title || '#' }}</span>
                            <render-header v-else :render="column.renderHeader" :column="column" :index="index"></render-header>
                            <span :class="[prefixCls + '-sort']" v-if="column.sortable">
                                <i class="ivu-icon ivu-icon-md-arrow-dropup" :class="{on: getColumn(rowIndex, index)._sortType === 'asc'}" @click="handleSort(getColumn(rowIndex, index)._index, 'asc')"></i>
                                <i class="ivu-icon ivu-icon-md-arrow-dropdown" :class="{on: getColumn(rowIndex, index)._sortType === 'desc'}" @click="handleSort(getColumn(rowIndex, index)._index, 'desc')"></i>
                            </span>
                        </template>
                    </div>
                </th>
                <th v-if="$parent.showVerticalScrollBar && rowIndex===0" :class='scrollBarCellClass()' :rowspan="headRows.length"></th>
            </tr>
        </thead>
    </table>
</template>

<script>
import Mixin from './mixin'
export default {
  name: 'GridHead',
  mixins: [ Mixin ],
  props: {
    prefixCls: String,
    styleObject: Object,
    columns: Array,

    objData: Array,
    // data: Array, // rebuildData
    columnsWidth: Object,

    fixed: {
      type: [Boolean, String],
      default: false
    },
    columnRows: Array,
    fixedColumnRows: Array
  },
  components: {},
  data () {
    return {
    }
  },
  methods: {
    cellClasses (column) {
      return [
        `${this.prefixCls}-cell`,
        {
          [`${this.prefixCls}-hidden`]: !this.fixed && column.fixed && (column.fixed === 'left' || column.fixed === 'right'),
          [`${this.prefixCls}-cell-with-selection`]: column.type === 'selection'
        }
      ]
    },
    scrollBarCellClass() {
      let hasRightFixed = false
      for (let i in this.headRows) {
        for (let j in this.headRows[i]) {
          if (this.headRows[i][j].fixed === 'right') {
            hasRightFixed = true
            break
          }
          if (hasRightFixed) break
        }
      }
      return [
        {
          [`${this.prefixCls}-hidden`]: hasRightFixed
        }
      ]
    },
    itemClasses (column, item) {
      return [
        `${this.prefixCls}-filter-select-item`,
        {
          [`${this.prefixCls}-filter-select-item-selected`]: column._filterChecked[0] === item.value
        }
      ]
    },
    itemAllClasses (column) {
      return [
        `${this.prefixCls}-filter-select-item`,
        {
          [`${this.prefixCls}-filter-select-item-selected`]: !column._filterChecked.length
        }
      ]
    },
    selectAll () {
      const status = !this.isSelectAll
      this.$parent.selectAll(status)
    },
    handleSort (index, type) {
      const column = this.columns[index]
      const _index = column._index

      if (column._sortType === type) {
        type = 'normal'
      }
      this.$parent.handleSort(_index, type)
    },
    handleSortByHead (index) {
      const column = this.columns[index]
      if (column.sortable) {
        const type = column._sortType
        if (type === 'normal') {
          this.handleSort(index, 'asc')
        } else if (type === 'asc') {
          this.handleSort(index, 'desc')
        } else {
          this.handleSort(index, 'normal')
        }
      }
    },
    handleFilter (index) {
      this.$parent.handleFilter(index)
    },
    handleSelect (index, value) {
      this.$parent.handleFilterSelect(index, value)
    },
    handleReset (index) {
      this.$parent.handleFilterReset(index)
    },
    handleFilterHide (index) {
      this.$parent.handleFilterHide(index)
    },
    // 因为表头嵌套不是深拷贝，所以没有 _ 开头的方法，在 isGroup 下用此列
    getColumn (rowIndex, index) {
      const isGroup = this.columnRows.length > 1
      if (isGroup) {
        const id = this.headRows[rowIndex][index].__id
        return this.columns.filter(item => item.__id === id)[0]
      } else {
        return this.headRows[rowIndex][index]
      }
    }
  },
  mounted: function() {},
  computed: {
    // data() {
    //   if (this.objData) {
    //     Object.values(this.objData)
    //   }
    //   return []
    // },
    styles () {
      const style = Object.assign({}, this.styleObject)
      const width = parseInt(this.styleObject.width)
      style.width = `${width}px`
      return style
    },
    isSelectAll () {
      let isSelectAll = true
      if (this.objData.length === 0) isSelectAll = false
      if (!this.objData.find(item => !item._isDisabled)) isSelectAll = false // #1751
      for (let i = 0; i < this.objData.length; i++) {
        if (!this.objData[i]._isChecked && !this.objData[i]._isDisabled) {
          isSelectAll = false
          break
        }
      }

      return isSelectAll
    },
    headRows () {
      const isGroup = this.columnRows.length > 1
      if (isGroup) {
        return this.fixed ? this.fixedColumnRows : this.columnRows
      } else {
        return [this.columns]
      }
    }
  }
}

</script>
<style  scoped>
</style>

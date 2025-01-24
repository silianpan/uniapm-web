<!--  -->
<template>
<div :class="wrapClasses" :style="styles">
  <div :class="classes">
    <!-- title header  solt-->
    <div :class="[prefixCls + '-title']" v-if="showSlotHeader" ref="title">
      <slot name="header"></slot>
    </div>
    <!-- header -->
    <div :class="[prefixCls + '-header']" v-if="showHeader" ref="header" @mousewheel="handleMouseWheel">
      <grid-head :prefix-cls="prefixCls" :styleObject="tableHeaderStyle" :columns="cloneColumns" :column-rows="columnRows" :obj-data="objData" :columns-width="columnsWidth" ></grid-head>
    </div>
    <!-- body -->
    <div :class="[prefixCls + '-body']" :style="bodyStyle" ref="body" @scroll="handleBodyScroll" v-show="!((!!localeNoDataText && (!data || data.length === 0)) || (!!localeNoFilteredDataText && isEmptyData))">
      <grid-body ref="tbody" :prefix-cls="prefixCls" :styleObject="tableStyle" :columns="cloneColumns"  :columns-width="columnsWidth" :obj-data="objData"></grid-body>
    </div>
    <!-- empyt text -->
    <div :class="[prefixCls + '-tip']" :style="bodyStyle" @scroll="handleBodyScroll" v-show="((!!localeNoDataText && (!data || data.length === 0)) || (!!localeNoFilteredDataText && isEmptyData))">
      <table cellspacing="0" cellpadding="0" border="0" :style="tableStyle">
        <tbody>
          <tr>
            <td :style="{'height':bodyStyle.height,'width':'100%'}">
              <span v-html="localeNoDataText" v-if="!data || data.length === 0"></span>
              <span v-html="localeNoFilteredDataText" v-else></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- footer -->
    <div :class="[prefixCls + '-footer']" v-if="showSlotFooter" ref="footer"><slot name="footer"></slot></div>
  </div>
   <!-- loading -->
  <Spin fix size="large" v-if="loading">
    <slot name="loading"></slot>
  </Spin>
</div>
</template>

<script>
import GridHead from './grid-head.vue'
import GridBody from './grid-body.vue'
import { on, off } from '@/utils/dom'
import elementResizeDetectorMaker from 'element-resize-detector'
import { deepCopy, oneOf, uuid4, convertToRows, getAllColumns, getScrollBarSize, getStyle } from './utils.js'
// 默认数据配置
const defaultOptions = {
  // 方法
  method: 'get',
  // url
  url: '',
  // 参数
  queryParams: {},
  // 数据配置
  columns: [],
  data: []

}
const prefixCls = 'ivu-table'
let columnKey = 1
// console.log(defaultOptions)
export default {
  name: 'TableTreeGrid',
  // mixins: [Mixin],
  props: {
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    size: {
      validator (value) {
        return oneOf(value, ['small', 'large', 'default'])
      },
      default () {
        return !this.$IVIEW || this.$IVIEW.size === '' ? 'default' : this.$IVIEW.size
      }
    },
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default () {
        return ''
      }
    },
    data: {
      type: Array,
      default () {
        return []
      }
    },
    noDataText: {
      type: String
    },
    noFilteredDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    loading: {
      type: Boolean,
      default: false
    },
    expandedAll: {
      type: Boolean,
      default: false
    },
    loadData: {
      type: Function
    }
  },
  components: {
    GridHead,
    GridBody
  },
  data() {
    // 带id 的 columns
    const colsWithId = this.makeColumnsId(this.columns)
    return {
      // 是否初始化结束
      ready: false,
      // 表格的宽度
      tableWidth: 0,
      // 列的宽度
      columnsWidth: {},
      // 样式前缀
      prefixCls: prefixCls,
      // 整合 之后的数据
      objData: [], // checkbox or highlight-row
      // 排序 过滤之后的数据
      // 备份 columns 的配置数据
      cloneColumns: this.makeColumns(colsWithId),
      // 多表头
      columnRows: this.makeColumnRows(colsWithId),

      allColumns: getAllColumns(colsWithId), // for multiple table-head, get columns that have no children

      showSlotHeader: true,

      showSlotFooter: true,
      // grid 的高度
      bodyHeight: 0,
      // 滚动条 的宽度
      scrollBarWidth: getScrollBarSize(),
      // 废弃
      cloneData: deepCopy(this.data), // when Cell has a button to delete row data, clickCurrentRow will throw an error, so clone a data
      // 是否展示 垂直滚动条
      showVerticalScrollBar: false,
      // 是否展示 水平 滚动条
      showHorizontalScrollBar: false,
      // header宽度
      headerWidth: 0,
      // header 高度
      headerHeight: 0
    }
  },
  methods: {

    /** 转换 树形数据 降低纬度 */
    transTreeData(datas, level, parent) {
      // let _index = level
      return datas.map((row, index) => {
        let _c = {
          _isHover: false,
          // 是否被禁
          _isDisabled: false,
          // 是否被选中
          _isChecked: false,
          // 是否展开
          _isExpanded: this.expandedAll,
          // 是否高亮显示
          _isHighlight: false,

          _loading: false,
          // tree 层级
          _level: level,
          // 父级 row
          _prowKey: (parent || {})._rowKey || '-1',

          _rowKey: uuid4(),

          _isShow: (parent || {})._isExpanded !== false
        }
        let newRow = { ..._c, ...deepCopy(row) }// todo 直接替换
        let _index = this.objData.findIndex(i => i._rowKey === newRow._prowKey)

        _index > -1 ? this.objData.splice(_index + 1, 0, newRow) : this.objData.push(newRow)
        if (newRow.children) {
          newRow.children = this.transTreeData(newRow.children, level + 1, newRow)
        }
        return newRow
      })
    },
    /** 整理数据  */
    makeObjData () {
      this.objData = []
      this.transTreeData(this.data, 1, null)
    },
    // 修改列，设置一个隐藏的 id，便于后面的多级表头寻找对应的列，否则找不到
    makeColumnsId (columns) {
      return columns.map(item => {
        if ('children' in item) item.children = this.makeColumnsId(item.children || [])
        item.__id = uuid4()
        return item
      })
    },
    /** 整理 columns */
    makeColumns (cols) {
      // 在 data 时，this.allColumns 暂时为 undefined
      let columns = deepCopy(getAllColumns(cols))
      let auto = []
      columns.forEach((column, index) => {
        column._index = index
        column._columnKey = columnKey++
        column._width = column.width ? column.width : '' // update in handleResize()
        column._sortType = 'normal'
        if ('sortType' in column) {
          column._sortType = column.sortType
        }
        auto.push(column)
      })
      return auto
    },

    // create a multiple table-head
    makeColumnRows (cols) {
      return convertToRows(cols)
    },
    rowClsName (row) {
      return this.rowClassName(row)
    },
    /** 自适应 */
    handleResize () {
      // let tableWidth = parseInt(getStyle(this.$el, 'width')) - 1;
      // columns  归类
      // 表格宽度
      let tableWidth = this.$el.offsetWidth - 1
      // 列的宽度
      let columnsWidth = {}
      // 最小的宽度
      let sumMinWidth = 0
      // 设置width 属性的 column
      let hasWidthColumns = []
      // 没有宽度属性的 column
      let noWidthColumns = []
      // 有 maxWitdh 属性的 column
      let maxWidthColumns = []
      // 没有 maxWitdh 属性的 column
      let noMaxWidthColumns = []

      this.cloneColumns.forEach((col) => {
        if (col.width) {
          hasWidthColumns.push(col)
        } else {
          noWidthColumns.push(col)
          if (col.minWidth) {
            sumMinWidth += col.minWidth
          }
          if (col.maxWidth) {
            maxWidthColumns.push(col)
          } else {
            noMaxWidthColumns.push(col)
          }
        }
        col._width = null
      })

      let unUsableWidth = hasWidthColumns.map(cell => cell.width).reduce((a, b) => a + b, 0)
      let usableWidth = tableWidth - unUsableWidth - sumMinWidth - (this.showVerticalScrollBar ? this.scrollBarWidth : 0) - 1
      let usableLength = noWidthColumns.length
      let columnWidth = 0
      if (usableWidth > 0 && usableLength > 0) {
        columnWidth = parseInt(usableWidth / usableLength)
      }

      for (let i = 0; i < this.cloneColumns.length; i++) {
        const column = this.cloneColumns[i]
        let width = columnWidth + (column.minWidth ? column.minWidth : 0)
        if (column.width) {
          width = column.width
        } else {
          if (column._width) {
            width = column._width
          } else {
            if (column.minWidth > width) {
              width = column.minWidth
            } else if (column.maxWidth < width) {
              width = column.maxWidth
            }
            if (usableWidth > 0) {
              usableWidth -= width - (column.minWidth ? column.minWidth : 0)
              usableLength--
              if (usableLength > 0) {
                columnWidth = parseInt(usableWidth / usableLength)
              } else {
                columnWidth = 0
              }
            } else {
              columnWidth = 0
            }
          }
        }

        column._width = width

        columnsWidth[column._index] = {
          width: width
        }
      }
      if (usableWidth > 0) {
        usableLength = noMaxWidthColumns.length
        columnWidth = parseInt(usableWidth / usableLength)
        for (let i = 0; i < noMaxWidthColumns.length; i++) {
          const column = noMaxWidthColumns[i]
          let width = column._width + columnWidth
          if (usableLength > 1) {
            usableLength--
            usableWidth -= columnWidth
            columnWidth = parseInt(usableWidth / usableLength)
          } else {
            columnWidth = 0
          }
          column._width = width
          columnsWidth[column._index] = {
            width: width
          }
        }
      }

      this.tableWidth = this.cloneColumns.map(cell => cell._width).reduce((a, b) => a + b, 0) + (this.showVerticalScrollBar ? this.scrollBarWidth : 0) + 1
      this.columnsWidth = columnsWidth
      this.fixedHeader()
    },
    /** 鼠标 移动进来 */
    handleMouseIn (row) {
      if (this.disabledHover) return
      if (row._isHover) return
      row._isHover = true
    },
    /** 鼠标移出去 */
    handleMouseOut (row) {
      if (this.disabledHover) return
      row._isHover = false
    },
    // 通用处理 highlightCurrentRow 和 clearCurrentRow
    handleCurrentRow (type, row) {
      let oldIndex = -1
      for (let i in this.objData) {
        if (this.objData[i]._isHighlight) {
          oldIndex = parseInt(i)
          this.objData[i]._isHighlight = false
        }
      }
      if (type === 'highlight') row._isHighlight = true
      const oldData = oldIndex < 0 ? null : JSON.parse(JSON.stringify(row))
      const newData = type === 'highlight' ? JSON.parse(JSON.stringify(row)) : null
      this.$emit('on-current-change', newData, oldData)
    },
    highlightCurrentRow (row) {
      if (!this.highlightRow || row._isHighlight) return
      this.handleCurrentRow('highlight', row)
    },
    clickCurrentRow (row) {
      this.highlightCurrentRow(row)
      this.$emit('on-row-click', JSON.parse(JSON.stringify(row), row._rowKey))
    },
    dblclickCurrentRow (row) {
      this.highlightCurrentRow(row)
      this.$emit('on-row-dblclick', JSON.parse(JSON.stringify({ ...row })), row._rowKey)
    },
    getSelection () {
      let selectionIndexes = []
      if (this.objData) {
        this.objData.map(item => {
          if (item._isChecked) {
            selectionIndexes.push(deepCopy(item))
          }
        })
      }
      return selectionIndexes
    },
    /** checked 状态切换 */
    toggleSelect (row) {
      let data = row
      if (!data) {
        return
      }
      const status = !data._isChecked
      data._isChecked = status
      const selection = this.getSelection()
      this.$emit(status ? 'on-select' : 'on-select-cancel', selection, JSON.parse(JSON.stringify(data)))
      this.$emit('on-selection-change', selection)
    },
    close(data) {
      if (data.children) {
        data.children.forEach((child, childIndex) => {
          child._isShow = false
          child._isExpanded = false
          if (child.children) {
            this.close(child)
          }
        })
      }
    },
    open(data) {
      if (data.children) {
        data.children.forEach((child, childIndex) => {
          child._isShow = true
          // 非 属性结构数据
          if (child.children && child._isExpanded) {
            this.open(child)
          }
        })
      }
    },
    /** 展开 */
    toggleExpand (row) {
      let data = row
      if (!data) {
        return
      }
      const status = !data._isExpanded
      data._isExpanded = status
      if (!data._isExpanded) {
        this.close(data)
      } else {
        if (data.children && data.children.length > 0) {
          this.open(data)
        } else {
          if (this.loadData) {
            data._loading = true
            this.loadData(data, children => {
              data._loading = false
              if (children.length) {
                // buildTree
                let reBuildChild = this.transTreeData(children, data._level + 1, data)
                data.children = reBuildChild
              }
            })
          }
        }
      }
      this.$emit('on-expand', JSON.parse(JSON.stringify(row)), status)
      if (this.height) {
        this.$nextTick(() => this.fixedBody())
      }
    },
    selectAll (status) {
      if (this.objData) {
        this.objData.forEach((item, index) => {
          if (!item._isDisabled) {
            this.$set(this.objData[index], '_isChecked', status)
          }
        })
      }
      const selection = this.getSelection()
      if (status) {
        this.$emit('on-select-all', selection)
      } else {
        this.$emit('on-select-all-cancel', selection)
      }
      this.$emit('on-selection-change', selection)
    },
    /** 调整 header */
    fixedHeader () {
      if (this.height) {
        this.$nextTick(() => {
          const titleHeight = parseInt(getStyle(this.$refs.title, 'height')) || 0
          const headerHeight = parseInt(getStyle(this.$refs.header, 'height')) || 0
          const footerHeight = parseInt(getStyle(this.$refs.footer, 'height')) || 0
          this.bodyHeight = this.height - titleHeight - headerHeight - footerHeight
          this.$nextTick(() => this.fixedBody())
        })
      } else {
        this.bodyHeight = 0
        this.$nextTick(() => this.fixedBody())
      }
    },
    /** 调整 bady */
    fixedBody () {
      if (this.$refs.header) {
        this.headerWidth = this.$refs.header.children[0].offsetWidth
        this.headerHeight = this.$refs.header.children[0].offsetHeight
        // this.showHorizontalScrollBar = this.headerWidth>this.$refs.header.offsetWidth;
      }

      if (!this.$refs.tbody || !this.data || this.data.length === 0) {
        this.showVerticalScrollBar = false
      } else {
        let bodyContentEl = this.$refs.tbody.$el
        let bodyEl = bodyContentEl.parentElement
        let bodyContentHeight = bodyContentEl.offsetHeight
        let bodyHeight = bodyEl.offsetHeight

        this.showHorizontalScrollBar = bodyEl.offsetWidth < bodyContentEl.offsetWidth + (this.showVerticalScrollBar ? this.scrollBarWidth : 0)
        this.showVerticalScrollBar = this.bodyHeight ? bodyHeight - (this.showHorizontalScrollBar ? this.scrollBarWidth : 0) < bodyContentHeight : false

        if (this.showVerticalScrollBar) {
          bodyEl.classList.add(this.prefixCls + '-overflowY')
        } else {
          bodyEl.classList.remove(this.prefixCls + '-overflowY')
        }
        if (this.showHorizontalScrollBar) {
          bodyEl.classList.add(this.prefixCls + '-overflowX')
        } else {
          bodyEl.classList.remove(this.prefixCls + '-overflowX')
        }
      }
    },

    handleBodyScroll (event) {
      if (this.showHeader) this.$refs.header.scrollLeft = event.target.scrollLeft
      // if (this.isLeftFixed) this.$refs.fixedBody.scrollTop = event.target.scrollTop
      // if (this.isRightFixed) this.$refs.fixedRightBody.scrollTop = event.target.scrollTop
    },
    /** 鼠标滚动具柄 */
    handleMouseWheel (event) {
      const deltaX = event.deltaX
      const $body = this.$refs.body

      if (deltaX > 0) {
        $body.scrollLeft = $body.scrollLeft + 10
      } else {
        $body.scrollLeft = $body.scrollLeft - 10
      }
    },
    GetOriginalIndex (_index) {
      return this.cloneColumns.findIndex(item => item._index === _index)
    },
    handleSort (_index, type) {

    },
    makeDataWithFilter () {

    },
    updateByRowKey(rowKey, data) {
      if (this.objData) {
        let row = this.objData.find(item => item._rowKey === rowKey)
        if (row) {
          Object.assign(row, data)
        }
      }
    },
    getRowByKey(rowKey) {
      if (this.objData) {
        let row = this.objData.find(item => item._rowKey === rowKey)
        let cr = deepCopy(row)
        delete cr.children
        return cr
      }
    }
  },
  mounted: function () {
    this.handleResize()
    this.$nextTick(() => {
      this.ready = true
    })
    on(window, 'resize', this.handleResize)
    this.observer = elementResizeDetectorMaker()
    this.observer.listenTo(this.$el, this.handleResize)
    this.$on('on-visible-change', (val) => {
      if (val) {
        this.handleResize()
      }
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.handleResize)
    this.observer.removeListener(this.$el, this.handleResize)
  },
  created () {
    this.showSlotHeader = this.$slots.header !== undefined
    this.showSlotFooter = this.$slots.footer !== undefined
    this.makeObjData()
  },
  watch: {
    data: {
      handler () {
        this.makeObjData()
        this.handleResize()
        this.fixedHeader()
        // here will trigger before clickCurrentRow, so use async
        setTimeout(() => {
          this.cloneData = deepCopy(this.data)
        }, 0)
      },
      deep: true
    },
    columns: {
      handler () {
        // todo 这里有性能问题，可能是左右固定计算属性影响的
        const colsWithId = this.makeColumnsId(this.columns)
        this.allColumns = getAllColumns(colsWithId)
        this.cloneColumns = this.makeColumns(colsWithId)
        this.columnRows = this.makeColumnRows(false, colsWithId)
        this.handleResize()
      },
      deep: true
    },
    height () {
      this.handleResize()
    },
    showHorizontalScrollBar () {
      this.handleResize()
    },
    showVerticalScrollBar () {
      this.handleResize()
    }
  },
  computed: {
    /** 数据为空 时的数据 */
    localeNoDataText () {
      return this.noDataText || '暂无数据'
    },
    /** 为 */
    localeNoFilteredDataText () {
      return this.noFilteredDataText || '暂无数据'
    },
    wrapClasses () {
      return [
        `${prefixCls}-wrapper`,
        {
          [`${prefixCls}-hide`]: !this.ready,
          [`${prefixCls}-with-header`]: this.showSlotHeader,
          [`${prefixCls}-with-footer`]: this.showSlotFooter
        }
      ]
    },
    isEmptyData() {
      return !this.objData || this.objData.length === 0
    },
    classes () {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-border`]: this.border,
          [`${prefixCls}-stripe`]: this.stripe,
          [`${prefixCls}-with-fixed-top`]: !!this.height
        }
      ]
    },
    styles () {
      let style = {}
      if (this.height) {
        const height = parseInt(this.height)
        style.height = `${height}px`
      }
      if (this.width) style.width = `${this.width}px`
      return style
    },
    tableStyle () {
      let style = {}
      if (this.tableWidth !== 0) {
        let width = ''
        if (this.bodyHeight === 0) {
          width = this.tableWidth
        } else {
          width = this.tableWidth - (this.showVerticalScrollBar ? this.scrollBarWidth : 0)
        }
        //                    const width = this.bodyHeight === 0 ? this.tableWidth : this.tableWidth - this.scrollBarWidth;
        style.width = `${width}px`
      }
      return style
    },
    tableHeaderStyle () {
      let style = {}
      if (this.tableWidth !== 0) {
        let width = ''
        width = this.tableWidth
        style.width = `${width}px`
      }
      return style
    },
    bodyStyle () {
      let style = {}
      if (this.bodyHeight !== 0) {
        const height = this.bodyHeight
        style.height = `${height}px`
      }
      return style
    }
  }
}
</script>

<style  scoped>
</style>

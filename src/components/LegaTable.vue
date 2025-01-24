<template>
  <div>
    <Row class="filter-container" type="flex">
      <i-col :xs="8" :sm="12" :md="14" :lg="16">
        <ButtonGroup>
          <Button v-for="(item, index) in buttons" :key="index" :type="item.type" :size="item.size" :shape="item.shape" :icon="item.icon" :loading="item.loading?item.loading:false" :disabled="item.disabled?item.disabled:false" :html-type="item.htmlType?item.htmlType:'button'" @click="buttonClickHandle(item.clickName)">
            <i :class="item.iconfont"></i>{{item.name}}</Button>
        </ButtonGroup>
      </i-col>
      <i-col :xs="16" :sm="12" :md="10" :lg="8">
        <div class="right-pos" v-if="hasKeywordSearch || hasAdvancedSearch">
          <!-- 关键字搜索 -->
          <i-input v-if="hasKeywordSearch" size="small" icon="ios-search-strong" @on-click="handleSearchClick" class="filter-item table-header-input" placeholder="关键词" v-model="searchKeyword" @keyup.enter.native="handleSearchClick">
          </i-input>
          <!-- 高级搜索 -->
          <Button v-if="hasAdvancedSearch" class="filter-item" type="text" @click="handleAdvancedSearch">
            <Icon class="iconfont icon-gaojisousuo"></Icon>
            高级搜索
          </Button>
          <!-- 更多功能分类 -->
          <Dropdown v-if="hasOtherFuncs" @on-click="handleCommand" class="filter-item" placement="bottom-end">
            <a href="javascript:void(0)">
              <Icon type="navicon" style="font-size: 24px"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="exportOrginalData">导出原始数据</DropdownItem>
              <DropdownItem name="exportSortData">导出排序和过滤后的数据</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </i-col>
    </Row>
    <Row class="sharp-corner" v-if="hasAdvancedSearch && isShow">
      <LegaSearchForm :labelWidth="options.searchFormLabelWidth" :formItemData="options.formItemData" :formData="options.formData" @handleFormCancel="handleFormCancel" @handleFormSearch="handleFormSearch"></LegaSearchForm>
    </Row>
    <Row>
      <Table ref="table" class="lega-table" :data="tableData" :columns="columns" :loading="loading" :border="border" :stripe="stripe" :width="width" :height="height" :show-header="showHeader" :highlight-row="highlightCurrentRow" :no-data-text="noDataText" :no-filtered-data-text="noFilteredDataText" :disabled-hover="disabledHover" :size="size" :row-class-name="getRowClassName" @on-row-click="rowClick" @on-row-dblclick="rowDBclick" @on-select="selectHandle" @on-select-cancel="selectCancelHandle" @on-select-all="selectAllHandle" @on-selection-change="selectChangeHandle" @on-expand="expandHandle" @on-sort-change="sortChangeHandle" @on-filter-change="filterChangeHandle">
      </Table>
    </Row>
    <Row>
      <div v-if="hasPagination" class="elpagination">
        <Page size='small' @on-page-size-change="handleSizeChange" @on-change="handleCurrentChange" :current="options.pageIndex == null ? pageIndex : options.pageIndex" :page-sizes="pageSizes" :page-size="options.pageSize == null ? pageSize : options.pageSize" :total="options.total == null ? total : options.total" show-total show-elevator show-sizer>
        </Page>
      </div>
    </Row>
  </div>
</template>

<script>
import LegaSearchForm from './LegaSearchForm'
import { mapGetters } from 'vuex'
export default {
  props: {
    options: {
      type: Object,
      default: function() {
        return {}
      }
    },
    queryParams: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      isShow: false,
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 10,
      pageSizes: [10, 20, 50, 100],
      searchKeyword: '',
      currentPage: 1
    }
  },
  components: {
    LegaSearchForm
  },
  methods: {
    rowClick(row, ev, column) {
      this.$emit('rowClickHandle', row, ev)
    },
    rowDBclick(row, ev) {
      this.$emit('rowDBClickHandle', row, ev)
    },
    selectHandle(selection, row) {
      this.$emit('rowSelectHandle', selection, row)
    },
    selectCancelHandle(selection, row) {
      this.$emit('rowSelectCancelHandle', selection, row)
    },
    selectAllHandle(selection) {
      this.$emit('rowSelectAllHandle', selection)
    },
    selectChangeHandle(selection) {
      this.$emit('rowSelectChangeHandle', selection)
    },
    expandHandle(row, status) {
      this.$emit('expandHandle', row, status)
    },
    sortChangeHandle(column, key, order) {
      this.$emit('sortChangeHandle', column, key, order)
    },
    filterChangeHandle(column) {
      this.$emit('filterChangeHandle', column)
    },
    handleSearchClick() {
      this.$emit('keywordSearchHandle', this.searchKeyword)
    },
    handleFormSearch(searchFormData) {
      this.$emit('handleFormSearch', searchFormData)
    },
    handleFormCancel(isShow) {
      this.isShow = isShow
      // $('.sharp-corner').fadeOut()
    },
    handleAdvancedSearch() {
      this.isShow = !this.isShow
      // 淡入淡出
      // $('.sharp-corner').fadeToggle()
    },
    getRowClassName(row, index) {
      return row.className
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.$emit('refreshActionHandle', this.queryParams, this.currentPage, val)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.$emit('refreshActionHandle', this.queryParams, val, this.pageSize)
    },
    // 导出数据
    exportData(type) {
      if (type === 1) {
        this.$refs.table.exportCsv({
          filename:
            this.options && this.options.filename
              ? this.options.filename
              : '导出原始数据'
        })
      } else if (type === 2) {
        this.$refs.table.exportCsv({
          filename:
            this.options && this.options.filename
              ? this.options.filename
              : '导出排序和过滤后的数据',
          original: false
        })
      }
    },
    // 另外功能下拉列表点击事件
    handleCommand(name) {
      switch (name) {
        case 'exportOrginalData':
          this.$Modal.confirm({
            title: '导出数据',
            content: '是否导出所有数据？',
            onOk: () => {
              this.exportData(1)
            },
            onCancel: () => {}
          })
          break
        case 'exportSortData':
          this.$Modal.confirm({
            title: '导出数据',
            content: '是否导出排序和过滤后的数据？',
            onOk: () => {
              this.exportData(2)
            },
            onCancel: () => {}
          })
          break
      }
    },
    buttonClickHandle(name) {
      this.$emit(name)
    },
    isObjectEmpty(obj) {
      if (obj !== undefined && obj !== null) {
        return false
      }
      return true
    }
  },

  computed: {
    ...mapGetters([
      'elements',
      'hasElementsPerimByKey',
      'dictDatasWithGroupKey',
      'dictFormatter'
    ]),
    // 是否分页
    hasPagination() {
      if (
        !this.isObjectEmpty(this.options) &&
        !this.isObjectEmpty(this.options.hasPagination)
      ) {
        return this.options.hasPagination
      }
      return true
    },
    // 是否有边框
    border() {
      if (
        !this.isObjectEmpty(this.options) &&
        !this.isObjectEmpty(this.options.border)
      ) {
        return this.options.border
      }
      return false
    },
    // 是否为斑马纹
    stripe() {
      if (
        !this.isObjectEmpty(this.options) &&
        !this.isObjectEmpty(this.options.stripe)
      ) {
        return this.options.stripe
      }
      return false
    },
    // 表格宽度
    width() {
      if (
        !this.isObjectEmpty(this.options) &&
        !this.isObjectEmpty(this.options.width)
      ) {
        return this.options.width
      }
      return null
    },
    // 表格高度，设定会固定表头
    height() {
      if (
        !this.isObjectEmpty(this.options) &&
        !this.isObjectEmpty(this.options.height)
      ) {
        return this.options.height
      }
      return null
    },
    // 是否显示表头
    showHeader() {
      if (
        !this.isObjectEmpty(this.options) &&
        !this.isObjectEmpty(this.options.showHeader)
      ) {
        return this.options.showHeader
      }
      return true
    },
    // 高亮当前行
    highlightCurrentRow() {
      if (
        !this.isObjectEmpty(this.options) &&
        !this.isObjectEmpty(this.options.highlightCurrentRow)
      ) {
        return this.options.highlightCurrentRow
      }
      return true
    },
    // 空时的文本显示
    noDataText() {
      if (
        !this.isObjectEmpty(this.options) &&
        !this.isObjectEmpty(this.options.noDataText)
      ) {
        return this.options.noDataText
      }
      return '暂无数据'
    },
    // 筛选结果为空的提示文字
    noFilteredDataText() {
      if (
        !this.isObjectEmpty(this.options) &&
        !this.isObjectEmpty(this.options.noFilteredDataText)
      ) {
        return this.options.noFilteredDataText
      }
      return '筛选结果为空'
    },
    // 禁用鼠标悬停时的高亮
    disabledHover() {
      if (
        !this.isObjectEmpty(this.options) &&
        !this.isObjectEmpty(this.options.disabledHover)
      ) {
        return this.options.disabledHover
      }
      return false
    },
    // 表格尺寸，可选值为 large、small、default 或者不填
    size() {
      if (
        !this.isObjectEmpty(this.options) &&
        !this.isObjectEmpty(this.options.size)
      ) {
        return this.options.size
      }
      return 'default'
    },
    // 数据
    tableData() {
      this.loading = true
      if (
        this.options &&
        this.options.data &&
        this.options.data instanceof Array
      ) {
        setTimeout(() => {
          this.loading = false
        }, 1000)
        return this.options.data
      }
      return []
    },
    // 列名
    columns() {
      if (
        this.options &&
        this.options.columns &&
        this.options.columns instanceof Array
      ) {
        return this.options.columns
      }
      return []
    },
    // 表格按钮
    buttons() {
      if (
        this.options &&
        this.options.buttons &&
        this.options.buttons instanceof Array
      ) {
        return this.options.buttons
      }
      return []
    },
    // 是否有关键字搜索
    hasKeywordSearch() {
      if (
        !this.isObjectEmpty(this.options) &&
        !this.isObjectEmpty(this.options.hasKeywordSearch)
      ) {
        return this.options.hasKeywordSearch
      }
      return false
    },
    // 是否有高级搜索
    hasAdvancedSearch() {
      if (
        !this.isObjectEmpty(this.options) &&
        !this.isObjectEmpty(this.options.hasAdvancedSearch)
      ) {
        return this.options.hasAdvancedSearch
      }
      return false
    },
    // 是否有其他功能选项
    hasOtherFuncs() {
      if (
        !this.isObjectEmpty(this.options) &&
        !this.isObjectEmpty(this.options.hasOtherFuncs)
      ) {
        return this.options.hasOtherFuncs
      }
      return false
    }
  }
}
</script>

<style lang="less">
@import './legaTable.less';
</style>

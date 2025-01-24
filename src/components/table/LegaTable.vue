<!--
    描述 改造 iview table 组件
    使其具有可扩展的搜索表单
    表格具有
-->
<template>
  <div>
    <div style="margin-bottom:5px;">
      <LegaSearchForm :options="cloneOptions.searchOptions" @on-search-action="handleSearchAction" @on-reset-action="handleSearchAction"></LegaSearchForm>
    </div>
    <Row class="filter-container" type="flex">
      <i-Col :xs="24" :sm="24" :md="8" :lg="8">
        <ButtonGroup v-if="cloneOptions.buttons.length > 0">
          <Button v-for="(btn, index) in cloneOptions.buttons" :key="index" v-if="checkBtnPermissionAndType(btn,'button')" :type="btn.type" :size="btn.size||'default'" :shape="btn.shape" :icon="btn.icon" :loading="btn.loading||false" :disabled="btn.disabled || false" :html-type="btn.htmlType||'button'" @click="handleBtnClickAction(btn.clickName)">
            <Icon v-if="!_.isNil(btn.customIcon)" :custom="btn.customIcon" :size="btn.iconSize||12"></Icon>
            {{btn.name}}
          </Button>
          <Dropdown v-else-if="checkBtnPermissionAndType(btn,'dropdown')" style="margin-left:5px" @on-click="handleDropDownItemClick(arguments,btn.clickName)">
            <Button :type="btn.type">
              <Icon v-if="!_.isNil(btn.customIcon)" :custom="btn.customIcon" :size="btn.iconSize||12"></Icon>
              {{btn.name}}
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list" v-if="(btn.dropdownItems ||[]).length > 0">
              <DropdownItem v-for="(item, iIndex) in btn.dropdownItems" v-if="checkBtnPermission(item)" :key="iIndex" :name="item.clickName">
                <Icon v-if="!_.isNil(item.customIcon)" :custom="item.customIcon" :size="item.iconSize||16"></Icon>
                <Icon v-else-if="!_.isNil(item.icon)" :type="item.icon" :size="item.iconSize||16"></Icon>
                <span style="margin-left:5px">{{item.name}}</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </ButtonGroup>
        <slot name="other-btn">
        </slot>
      </i-Col>
    </Row>
    <slot name="table-title">
    </slot>
    <Row>
      <i-col v-if="cloneOptions.type==='table'">
        <Table ref='lega-table' :disabled-hover='disabledHover' :loading='cloneOptions.loading' :no-data-text='noDataText' :border='showBorder' :stripe='showStripe' :show-header='showHeader' :height='fixedHeader' :size='tableSize' :data='tableData' :highlight-row='heightLightRow' :columns='tableColumns' @on-row-click='handleRowClickAction' @on-row-dblclick='handleRowDblClickAction' @on-expand='handleExpandAction'></Table>
      </i-col>
      <i-col v-else>
        <Grid  ref='lega-grid' :border='showBorder'  :columns="tableColumns"  :loading='cloneOptions.loading' :data="tableData" :loadData="handleLoadTreeData" :height='fixedHeader'  ></Grid>
      </i-col>
    </Row>
    <div v-show='hasPagination' style='overflow: hidden;'>
      <div style='float: left;padding: 10px 0px 10px 15px;'>
        <Page transfer :total='page.total||0' size='small' :page-size='page.pageSize||10' :page-size-opts='page.pageSizeOpts' :current='page.current||1' :show-elevator='page.showElevator||true' :show-sizer='page.showSizer||false' :show-total='page.showTotal || false' @on-change='handlePageIndexAction' @on-page-size-change='handlePageSizeChangeAction'></Page>
      </div>
      <div style='float: left;padding: 13px;cursor:pointer' @click="reLoad">
        <Tooltip content="刷新" placement="top">
          <Icon type="md-refresh" />
        </Tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import LegaSearchForm from '../form/LegaSearchForm'
import { RenderActions } from '@/components/render-actions'
import ActionsProps from '@/components/render-actions/actions-props'
import Grid from '@/components/tree-grid/grid'
import { mapGetters } from 'vuex'
import api from '@/libs/api'
const IPage = {
  dataField: 'records',
  totalField: 'total',
  sizeField: 'size',
  indexField: 'current'
}
const defaultOptions = {
  searchOptions: {
    hiddenItems: [],
    showItems: [],
    labelWidth: 80
  },
  type: 'table',
  /**  */
  border: false,
  /** 展示表头 */
  showHeader: true,
  /** 是否开启加载动画 */
  loading: true,
  // 方法
  method: 'post',
  // page url
  url: undefined,
  // 参数
  queryParams: {},
  // 权限前缀
  permissonPrefix: '',

  columns: [],
  /** 表格数据 必须有 */
  data: [],
  /** 是否分页 */
  pageination: true,

  page: {
    current: 1, // 当前页码，支持 .sync 修饰符
    total: 0, // 数据总数
    pageSize: 10, // 每页条数
    pageSizeOpts: [10, 20, 30, 40], // 每页条数切换的配置
    placement: 'bottom', // 条数切换弹窗的展开方向，可选值为 bottom 和 top
    size: 'defualt', // small default
    simple: false, // 简洁版
    /** 展示 数据总数 */
    showTotal: true,
    showElevator: true, // 显示总数
    showSizer: true, // 显示分页，用来改变page-size
    prevText: undefined, // 替代图标显示的上一页文字
    nextText: undefined // 替代图标显示的下一页文字
    // className: '', //自定义 class 名称
    // styles: '', //自定义 class 名称
  },
  // 操作栏 handle
  actionsHandle: {
    edit: () => {},
    delete: () => {}
  },
  // 其他按钮按钮
  buttons: []
}
export default {
  name: 'LegaTable',
  props: {
    options: {
      type: Object,
      required: true,
      default: function() {
        return {}
      }
    }
  },
  components: {
    LegaSearchForm,
    Grid
  },
  data() {
    return {
      /** 表格属性 */
      cloneOptions: {
        ...defaultOptions
      },
      cloneTableColumns: []
    }
  },
  methods: {
    handleLoadTreeData: function(pdata, callback) {
      if (this.cloneOptions && this._.isFunction(this.cloneOptions.loadData)) {
        this.cloneOptions.loadData(pdata, callback)
      }
    },
    handleDropDownItemClick: function() {
      const vm = this
      const arg1 = arguments[0]
      const clickName = arguments[1]
      if (!vm._.isNil(clickName)) {
        vm.$emit(clickName, arg1[0])
      } else {
        vm.$emit('handleDropDownItemClick', arg1[0])
      }
      console.log(arg1, clickName)
    },
    /** 检查btn 是否满足权限和 类型 */
    checkBtnPermissionAndType: function(btn, btnType) {
      return (
        (btn.btnType || 'button') === btnType && (!btn.permissionSuffix ||
        this.hasElementsPerimByKey(
          `${this.cloneOptions.permissionPerfix}:${btn.permissionSuffix || ''}`)
        )
      )
    },
    /** 检查btn 是否满足权限 */
    checkBtnPermission: function(btn) {
      return this.hasElementsPerimByKey(
        `${this.cloneOptions.permissionPerfix}:${btn.permissionSuffix || ''}`
      )
    },
    /** 搜索 */
    handleSearchAction: function(formData = {}, fieldQueryType) {
      let params = {
        conditions: [],
        size: this.cloneOptions.page.pageSize,
        current: this.cloneOptions.page.current
      }
      for (let field in formData) {
        let queryItem = {
          field: field,
          queryType: fieldQueryType[field] || 'like',
          value: formData[field]
        }
        params.conditions.push(queryItem)
      }
      this.cloneOptions.queryParams = params
      this.reLoad()
    },
    setQueryParams: function(queryParams) {
      this.cloneOptions.queryParams = queryParams || {}
    },
    /** 查询表格数据 */
    doQueryTableData: async function(params) {
      const vm = this
      let url = vm.cloneOptions.url
      if (!vm._.isNil(url) && !vm._.isEmpty(url)) {
        let resp = {}
        if (vm._.lowerCase(vm.method) === 'post') {
          resp = await api.post(url, params)
        } else {
          resp = await api.get(url, params)
        }
        return vm.dealResponseData(resp)
      }
      // else {
      //   vm.cloneOptions.data = [...vm.cloneOptions.data]
      // }
      // 将要废弃
    },
    /** 处理返回数据 */
    async dealResponseData(resp) {
      const vm = this
      if (resp && resp.ok()) {
        let tag = false
        let _data = resp.data || {}
        if (typeof _data === 'string') {
          return
        }
        if (!_data[IPage.dataField]) {
          tag = true
        }
        if (!tag) {
          vm.cloneOptions.page.total = _data[IPage.totalField] || 0
          vm.cloneOptions.page.current = _data[IPage.indexField] || 1
          vm.cloneOptions.page.pageSize = _data[IPage.sizeField] || 10
          vm.cloneOptions.data = _data[IPage.dataField] || []
        } else {
        // 跟改为 List
          vm.cloneOptions.data = _data
          vm.cloneOptions.pageination = false
        }
      } else {
        vm.cloneOptions.data = []
      }
    },
    /** 刷新表格内容 */
    reLoad: function() {
      this.openLoading()
      this.$nextTick(() => {
        let params = Object.assign({}, this.queryParams)
        if (this.cloneOptions.beforeQueryDataAction && this._.isFunction(this.cloneOptions.beforeQueryDataAction)) {
          this.cloneOptions.beforeQueryDataAction(params, (p) => {
            this.queryData(p)
          })
        } else {
          this.queryData(params)
        }
      })
    },
    queryData(params) {
      this.doQueryTableData(params).then(() => {
        let params = Object.assign({}, this.queryParams)
        if (this._.isFunction(this.cloneOptions.queryDataAction)) {
          this.cloneOptions.queryDataAction(params, result => {
            this.dealResponseData(result)
            this.closeLoading()
          })
        } else {
          this.closeLoading()
        }
      })
    },

    /** 单击某一行时触发 */
    handleRowClickAction: function(row, index) {
      /** 隐藏 高级搜索表单 */
      if (this.showAdvanceSearchPage) {
        this.showAdvanceSearchPage = false
      }
      this.$emit('on-row-click', row, index)
    },

    /** 双击某一行时触发  */
    handleRowDblClickAction: function(row, index) {
      this.$emit('on-row-dblclick', row, index)
    },

    /** 展开时 或者关闭 时 触发的事件 */
    handleExpandAction: function(row, status) {
      this.$emit('on-expand', row, status)
    },

    /** 页码发生改变时 触发的事件 */
    handlePageIndexAction: function(page) {
      this.cloneOptions.page.current = page
      this.cloneOptions.queryParams.current = page
      this.reLoad()
    },
    /** 页数切换 时触发的 事件 */
    handlePageSizeChangeAction: function(pageSize) {
      this.cloneOptions.page.pageSize = pageSize
      this.cloneOptions.queryParams.size = pageSize
      this.reLoad()
    },
    /** 打开加载器 */
    openLoading: function() {
      this.cloneOptions.loading = true
    },
    /** 关闭加载器 */
    closeLoading: function() {
      this.cloneOptions.loading = false
    },
    /** 根据function 名称获取函数 */
    getActionHandle(funcName) {
      if (this._.isFunction(this.cloneOptions.actionsHandle[funcName])) {
        return this.cloneOptions.actionsHandle[funcName]
      }
      return () => {}
    },
    /** 转换 column 的render 函数 */
    convertColumnRender: function(item, h, params, column) {
      const vm = this
      if (vm._.isString(item)) {
        if (vm._.isFunction(RenderActions[item])) {
          return RenderActions[item](h, params, column, vm)
        } else if (!vm._.isNil(ActionsProps[item])) {
          return RenderActions['getActionsByProps'](
            h,
            params,
            column,
            vm,
            ActionsProps[item]
          )
        }
      } else {
        let { key, permissionSuffix } = item
        let isShow = true
        if (vm._.isFunction(item.show)) {
          isShow = item.show(params)
        }
        if (
          isShow &&
          vm.hasElementsPerimByKey(
            `${vm.cloneOptions.permissionPerfix}:${permissionSuffix}`
          )
        ) {
          if (vm._.isFunction(RenderActions[key])) {
            return RenderActions[key](h, params, column, vm)
          } else if (!vm._.isNil(ActionsProps[key])) {
            return RenderActions['getActionsByProps'](
              h,
              params,
              column,
              vm,
              ActionsProps[key]
            )
          }
        }
      }
      return null
    },
    /** 转换 将多余的按钮转化成更多的下拉按钮菜单 */
    convertMoreOperateOptions: function(moreBtns) {
      const vm = this
      let dropdownOptions = {
        customIcon: 'iconfont icon-icon-test2',
        iconSize: 12,
        dropdownItems: []
      }
      moreBtns.forEach(btn => {
        let { key, permissionSuffix } = btn
        if (vm._.isString(btn)) {
          let _props = ActionsProps[btn]
          if (!vm._.isNil(_props)) {
            dropdownOptions.dropdownItems.push({
              ...{
                name: _props.tip.content,
                handleName: _props.handleName || key
              },
              ..._props.btnIcon
            })
          }
        } else {
          if (
            vm.hasElementsPerimByKey(
              `${vm.cloneOptions.permissionPerfix}:${permissionSuffix}`
            )
          ) {
            let _props = ActionsProps[key]
            if (!vm._.isNil(_props)) {
              dropdownOptions.dropdownItems.push({
                ...{
                  name: _props.tip.content,
                  handleName: _props.handleName || key
                },
                ..._props.btnIcon
              })
            }
          }
        }
      })
      return dropdownOptions
    },
    /** 转换 table columns */
    convertColumns(allColumns) {
      const vm = this
      const _columns = allColumns.map(item => {
        let _col = {
          ...{
            hidden: false
          },
          ...item
        }
        if (!vm._.isNil(item.render) && !vm._.isFunction(item.render)) {
          _col.render = (h, params) => {
            let renders = []
            if (vm._.isArray(item.render)) {
              // 操作按钮数 最多展示3个，超过部分 下拉展示
              let moreBtns = []
              item.render.forEach((_key, index) => {
                if (index < 5) {
                  let cRender = vm.convertColumnRender(_key, h, params, item)
                  if (!vm._.isNil(cRender)) {
                    renders.push(cRender)
                  }
                } else {
                  moreBtns.push(_key)
                }
              })
              if (moreBtns.length > 0) {
                renders.push(
                  RenderActions['dropDown'](
                    h,
                    params,
                    item,
                    vm,
                    vm.convertMoreOperateOptions(moreBtns)
                  )
                )
              }
            } else {
              let cRender = vm.convertColumnRender(item.render, h, params, item)
              if (!vm._.isNil(cRender)) {
                renders.push(cRender)
              }
            }
            if (item.key === 'action') {
              return h('div', [...renders])
            } else {
              return h('div', [...renders])
            }
          }
        }
        return _col
      })

      return [..._columns]
    },
    init: function() {
      const vm = this
      vm.cloneOptions = vm._.defaultsDeep({}, vm.options, defaultOptions)
      vm.cloneOptions.queryParams = {
        current: vm.page.current,
        size: vm.page.pageSize
      }
      vm.reLoad()
    },
    /** 向上分发按钮点击事件 */
    handleBtnClickAction: function(clickName) {
      if (!this._.isNil(clickName)) {
        this.$emit(clickName)
      }
    },
    updateByRowKey(rowKey, row) {
      if (this.cloneOptions.type === 'tree') {
        this.$refs['lega-grid'].updateByRowKey(rowKey, row)
      }
    },
    getRowByKey(rowKey) {
      if (this.cloneOptions.type === 'tree') {
        return this.$refs['lega-grid'].getRowByKey(rowKey)
      }
    }
  },
  created: function() {
  },
  mounted: function() {
    this.init()
  },
  computed: {
    ...mapGetters([
      'elements',
      'hasElementsPerimByKey',
      'dictDatasWithGroupKey',
      'dictFormatter'
    ]),
    /** Page组件 */
    page() {
      return (
        {
          ...this.cloneOptions.page
        } || {}
      )
    },

    /** table 查询参数 */
    queryParams() {
      return {
        ...(this.cloneOptions.queryParams || {})
      }
    },

    /** 是否高亮显示选中行 默认：true */
    heightLightRow() {
      if (this.cloneOptions.heightLightRow === false) {
        return false
      }
      return true
    },

    /** url 请求方式 post | get */
    method() {
      if (!this._.isNil(this.cloneOptions.method)) {
        if (this._.toLower(this.cloneOptions.method) === 'post') {
          return 'post'
        }
      }
      return 'get'
    },
    /** 是否分页 */
    hasPagination() {
      if (this.cloneOptions.pageination === true) {
        return this.tableData.length > 0
      }
      return false
    },
    /** 是否显示纵向边框 ,默认false */
    showBorder() {
      if (
        this.cloneOptions.border !== null &&
        this.cloneOptions.border !== undefined
      ) {
        return this.cloneOptions.border
      }
      return false
    },

    /** 是否显示间隔斑马纹 默认false */
    showStripe() {
      if (this.cloneOptions.stripe === true) {
        return true
      }
      return false
    },

    /** 是否显示表头 默认true */
    showHeader() {
      if (this.cloneOptions.showHeader === false) {
        return false
      }
      return true
    },

    /** 是否固定高度 */
    fixedHeader() {
      if (!this._.isNil(this.cloneOptions.height)) {
        const height = 40 * this.cloneOptions.data.length
        return height > this.cloneOptions.height ? this.cloneOptions.height : ''
      }
      return ''
    },

    /** 表格尺寸，可选值为 large、small、default */
    tableSize() {
      let size = 'default'
      if (!this._.isNil(this.cloneOptions.tableSize)) {
        switch (this.cloneOptions.tableSize) {
          case 'large':
            size = 'large'
            break
          case 'small':
            size = 'small'
            break
          default:
            size = 'default'
        }
      }
      return size
    },
    /** 禁用鼠标悬停时的高亮 */
    disabledHover() {
      if (this.cloneOptions.disabledHover === true) {
        return true
      }
      return false
    },
    /** 表格数据 */
    tableData: {
      get: function() {
        const vm = this
        if (vm._.isNil(vm.cloneOptions.data)) {
          vm.cloneOptions.data = []
        }
        const data = vm.cloneOptions.data
        vm.getActionHandle('loadDataSuccess')(data)
        return [...data]
      }
    },

    /** 表格columns 定义 */
    tableColumns() {
      const vm = this
      if (vm.cloneTableColumns.length === 0) {
        if (
          !vm._.isNil(vm.cloneOptions.columns) &&
          !vm._.isNaN(vm.cloneOptions.columns)
        ) {
          vm.cloneTableColumns = vm.convertColumns([
            ...(vm.cloneOptions.columns || [])
          ])
        }
      }
      return vm.cloneTableColumns.filter(col => {
        return col.hidden !== true
      })
    },
    /** 数据为空时展示内容 */
    noDataText() {
      if (!this._.isNil(this.cloneOptions.noDataText)) {
        return this.cloneOptions.noDataText
      }
      return '暂无数据'
    }
  }
}
</script>

<style scoped>
.filter-container {
  margin-bottom: 5px;
}
</style>

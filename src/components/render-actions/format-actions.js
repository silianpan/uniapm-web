const FormatActions = {
  /** 类型formatter */
  dictFormatter: function(h, params, column, vm) {
    const status = vm.dictFormatter(column['dictGroup'], params.row[column.key])
    return h('div', status)
  }
}
export { FormatActions }

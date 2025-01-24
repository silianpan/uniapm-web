/** 单元格 render  */
export default {
  name: 'Cell',
  functional: true,
  props: {
    row: Object,
    render: Function,
    rowKey: String,
    column: {
      type: Object,
      default: null
    }
  },
  render: (h, ctx) => {
    const params = {
      row: ctx.props.row,
      rowKey: ctx.props.rowKey
    }
    if (ctx.props.column) params.column = ctx.props.column
    return ctx.props.render(h, params)
  }
}

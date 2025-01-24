/** LegaCell render  */
export default {
  name: 'LegaCell',
  functional: true,
  props: {
    value: [Object, String, Array],
    render: Function
  },
  render: (h, ctx) => {
    const params = {
      value: ctx.props.value
    }
    return ctx.props.render(h, params)
  }
}

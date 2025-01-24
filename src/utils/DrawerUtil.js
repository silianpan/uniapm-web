import { Drawer } from 'iview'
import Vue from 'vue'
import store from '@/store'
import _ from 'lodash'

// 请参考 iview drawer属性
Drawer.newInstance = (properties, vNode) => {
  let _props = Object.assign(
    {
      visible: false
    }, properties)
  let Instance = new Vue({
    store: (vNode || {}).$store || store,
    data: Object.assign({}, _props),
    render(h) {
      return h(
        Drawer,
        {
          props: Object.assign({}, _props),
          domProps: {
            value: this.visible
          },
          on: {
            input: status => {
              this.visible = status
            },
            'on-visible-change': visible => {
              if (visible === false) {
                this.onCancel()
                this.remove()
              }
            }
          }
        }, [
          (_props.renderDrawer && this._.isFunction(_props.renderDrawer)) ? _props.renderDrawer(h, _props) : []
        ]
      )
    },
    computed: {
    },
    methods: {
      remove() {
        this.destroy()
      },
      cancel() {
        this.$children[0].visible = false
        this.onCancel()
        this.remove()
      },
      destroy() {
        this.$destroy()
        if (!_.isNil(vNode)) {
          vNode.$el.removeChild(this.$el)
        } else {
          document.body.removeChild(this.$el)
        }
        this.onRemove()
      },
      // onOk() {},
      onCancel() {},
      onRemove() {}
    }
  })
  const component = Instance.$mount()
  if (!_.isNil(vNode)) {
    vNode.$el.appendChild(component.$el)
  } else {
    document.body.appendChild(component.$el)
  }
  const modal = Instance.$children[0]

  return {
    /** 显示 弹出框 */
    show: () => {
      modal.visible = true
    },
    /** 移除 */
    remove() {
      modal.visible = false
      modal.$parent.remove()
    },
    /** 当前的 modal */
    component: modal
  }
}
export default Drawer

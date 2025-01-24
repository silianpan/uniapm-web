import { Modal, Button } from 'iview'
import Vue from 'vue'
import i18n from '@/locale'
import store from '@/store'
import _ from 'lodash'

let DynamicModal = {}
const prefixCls = 'ivu-modal-confirm'
DynamicModal.newInstance = (properties, vNode) => {
  const _props = Object.assign(
    {},
    {
      // modal 初始化是否可见
      visible: false,
      // modal 宽度
      width: '50%',
      // 自定义渲染header 优先级 大于 title
      // renderHeader: (h) => {},
      // 渲染modal body 优先级大于 body
      // renderBody: (h) => {},
      // 优先级 大于默认footer
      // renderFooter: (h) => {},
      // title
      title: '',
      // body
      body: '',
      // 是否置于body 里
      transfer: false,
      // 是否可拖动
      draggable: false,
      // 是否隐藏footer 如果 footerHide为true 则  okText ，cancelText ，showCancel 无效
      footerHide: false,
      // 确定按钮显示文本
      okText: undefined,
      // 取消按钮显示文本
      cancelText: undefined,
      // 是否展示取消按钮
      showCancel: false,
      // 否处于加载状态
      loading: false,
      // 按钮是否处于加载状态
      buttonLoading: false,
      // 页面是否可以滚动
      scrollable: false,
      // 是否显示右上角的关闭按钮，关闭后 Esc 按键也将关闭
      closable: true
    },
    properties || {}
  )
  let Instance = new Vue({
    store: (vNode || {}).$store || store,
    data: Object.assign({}, _props),
    render(h) {
      // header 渲染
      let headerRender
      if (this.renderHeader && _.isFunction(this.renderHeader)) {
        headerRender = h(
          'div',
          {
            attrs: {
              class: `${prefixCls}-head-title`
            },
            slot: 'header'
          },
          [this.renderHeader(h)]
        )
      } else if (this.title) {
        headerRender = h('div', {
          attrs: {
            class: `${prefixCls}-head-title`
          },
          slot: 'header',
          domProps: {
            innerHTML: this.title
          }
        })
      }
      // body 渲染
      let bodyRender
      if (this.renderBody && _.isFunction(this.renderBody)) {
        bodyRender = h(
          'div',
          {
            attrs: {
              class: `${prefixCls}-body ${prefixCls}-body-render`
            }
          },
          [this.renderBody(h)]
        )
      } else {
        bodyRender = h(
          'div',
          {
            attrs: {
              class: `${prefixCls}-body`
            }
          },
          [
            h('div', {
              domProps: {
                innerHTML: this.body
              }
            })
          ]
        )
      }

      // 底部按钮
      let footerVNodes = []
      if (this.footerHide !== true) {
        if (this.showCancel === true) {
          footerVNodes.push(
            h(
              Button,
              {
                props: {
                  type: 'text',
                  size: 'large'
                },
                on: {
                  click: this.cancel
                }
              },
              this.localeCancelText
            )
          )
        }
        footerVNodes.push(
          h(
            Button,
            {
              props: {
                type: 'primary',
                size: 'large',
                loading: this.buttonLoading
              },
              on: {
                click: this.ok
              }
            },
            this.localeOkText
          )
        )
      }

      let modalRenders = []
      if (!_.isNil(headerRender)) {
        modalRenders.push(headerRender)
      }

      if (!_.isNil(bodyRender)) {
        modalRenders.push(bodyRender)
      }

      if (!_.isNil(footerVNodes) && footerVNodes.length > 0) {
        modalRenders.push(
          h(
            'div',
            {
              slot: 'footer'
            },
            footerVNodes
          )
        )
      }

      return h(
        Modal,
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
        },
        modalRenders
      )
    },
    computed: {
      localeOkText() {
        if (this.okText) {
          return this.okText
        } else {
          return i18n.t('i.modal.okText')
        }
      },
      localeCancelText() {
        if (this.cancelText) {
          return this.cancelText
        } else {
          return i18n.t('i.modal.cancelText')
        }
      }
    },
    methods: {
      t(...args) {
        return t.apply(this, args)
      },
      remove() {
        this.destroy()
      },
      cancel() {
        this.$children[0].visible = false
        this.buttonLoading = false
        this.onCancel()
        this.remove()
      },
      ok() {
        if (this.loading) {
          this.buttonLoading = true
        } else {
          this.$children[0].visible = false
          this.remove()
        }
        if (_.isFunction(this.onOk)) {
          this.onOk()
        }
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
      modal.$parent.buttonLoading = false
      modal.$parent.remove()
    },
    /** 当前的 modal */
    component: modal
  }
}
export { DynamicModal }
